import { NextApiRequest, NextApiResponse } from "next"
import {
  clusterApiUrl,
  Connection,
  Keypair,
  PublicKey,
  Transaction,
} from "@solana/web3.js"
import { getAssociatedTokenAddress } from "@solana/spl-token"
import { Metaplex } from "@metaplex-foundation/js"
import {
  Program,
  AnchorProvider,
  Idl,
  setProvider,
} from "@project-serum/anchor"
import { IDL, Nft } from "../../idl/program_idl"

// setup
const MockWallet = {
  signTransaction: () => Promise.reject(),
  signAllTransactions: () => Promise.reject(),
  publicKey: Keypair.generate().publicKey,
}

const connection = new Connection(clusterApiUrl("devnet"))
const provider = new AnchorProvider(connection, MockWallet, {})
setProvider(provider)

// Anchor Program setup
const programId = new PublicKey("5aia16UteFJBDNNW3RBqtxRqVKULCBKgppjPafEvTzG1")
const program = new Program(IDL as Idl, programId) as unknown as Program<Nft>

// metaplex token metadata program
const TOKEN_METADATA_PROGRAM_ID = new PublicKey(
  "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
)

// nft test data
const nft = {
  uri: "https://arweave.net/bj7vXx6-AmFV0lk0QlCOGk1O9aCDoJAqefg55107rT4",
  name: "Test",
  symbol: "Test",
}

type InputData = {
  account: string
}

type GetResponse = {
  label: string
  icon: string
}

export type PostResponse = {
  transaction: string
  message: string
}

export type PostError = {
  error: string
}

function get(res: NextApiResponse<GetResponse>) {
  res.status(200).json({
    label: "My Store",
    icon: "https://solana.com/src/img/branding/solanaLogoMark.svg",
  })
}

async function post(
  req: NextApiRequest,
  res: NextApiResponse<PostResponse | PostError>
) {
  const { account } = req.body as InputData
  console.log(req.body)
  if (!account) {
    res.status(400).json({ error: "No account provided" })
    return
  }

  const { reference } = req.query
  if (!reference) {
    console.log("Returning 400: no reference")
    res.status(400).json({ error: "No reference provided" })
    return
  }

  try {
    const mintOutputData = await postImpl(
      new PublicKey(account),
      new PublicKey(reference)
    )
    res.status(200).json(mintOutputData)
    return
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "error creating transaction" })
    return
  }
}

async function postImpl(
  account: PublicKey,
  reference: PublicKey
): Promise<PostResponse> {
  // Metaplex setup
  const metaplex = Metaplex.make(connection).nfts().pdas()

  // Create new mint for NFT
  const mintKeypair = Keypair.generate()

  // Master edition PDA for mint
  const masterEditionPda = metaplex.masterEdition({
    mint: mintKeypair.publicKey,
  })

  // Token metadata PDA for mint
  const metadataPda = metaplex.metadata({ mint: mintKeypair.publicKey })

  // Anchor program mint authority PDA
  const [auth] = await PublicKey.findProgramAddress(
    [Buffer.from("auth")],
    program.programId
  )

  // token account address for user minting NFT
  const tokenAccount = await getAssociatedTokenAddress(
    mintKeypair.publicKey,
    account
  )

  const instruction = await program.methods
    .initialize(nft.uri, nft.name, nft.symbol)
    .accounts({
      mint: mintKeypair.publicKey,
      metadata: metadataPda,
      masterEdition: masterEditionPda,
      auth: auth,
      tokenAccount: tokenAccount,
      user: account,
      payer: account,
      tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
    })
    // .signers([mintKeypair])
    .instruction()

  instruction.keys.push({
    pubkey: reference,
    isSigner: false,
    isWritable: false,
  })

  // Convert to transaction
  const latestBlockhash = await connection.getLatestBlockhash()
  // const transaction = await transactionBuilder.toTransaction(latestBlockhash)

  // create new Transaction
  const transaction = new Transaction({
    recentBlockhash: latestBlockhash.blockhash,
    feePayer: account,
  })

  // add instruction to transaction
  transaction.add(instruction)

  // add new mintKeypair as signer
  transaction.sign(mintKeypair)

  // Serialize the transaction and convert to base64 to return it
  const serializedTransaction = transaction.serialize({
    requireAllSignatures: false, // account is a missing signature
  })
  const base64 = serializedTransaction.toString("base64")

  const message = "Please approve the transaction to mint your NFT!"

  // Return the serialized transaction
  return {
    transaction: base64,
    message,
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<GetResponse | PostResponse | PostError>
) {
  if (req.method === "GET") {
    return get(res)
  } else if (req.method === "POST") {
    return await post(req, res)
  } else {
    return res.status(405).json({ error: "Method not allowed" })
  }
}
