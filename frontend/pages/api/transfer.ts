import { NextApiRequest, NextApiResponse } from "next"
import { Keypair, PublicKey, Transaction } from "@solana/web3.js"
import { getAssociatedTokenAddress } from "@solana/spl-token"
import { BN } from "@project-serum/anchor"
import { connection, splTransferProgram as program } from "../../utils/setup"

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

  const { receiver } = req.query
  if (!receiver) {
    console.log("Returning 400: no receiver")
    res.status(400).json({ error: "No receiver provided" })
    return
  }

  const { reference } = req.query
  if (!reference) {
    console.log("Returning 400: no reference")
    res.status(400).json({ error: "No reference provided" })
    return
  }

  const { amount } = req.query
  if (!amount) {
    console.log("Returning 400: no amount")
    res.status(400).json({ error: "No amount provided" })
    return
  }

  try {
    const mintOutputData = await postImpl(
      new PublicKey(account),
      new PublicKey(receiver),
      new PublicKey(reference),
      new BN(amount.toString())
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
  receiver: PublicKey,
  reference: PublicKey,
  amount: BN
): Promise<PostResponse> {
  const mint = new PublicKey("Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr")

  const senderTokenAccount = await getAssociatedTokenAddress(mint, account)
  const receiverTokenAccount = await getAssociatedTokenAddress(mint, receiver)

  const instruction = await program.methods
    .tokenTransfer(amount)
    .accounts({
      sender: account,
      receiver: receiver,
      fromTokenAccount: senderTokenAccount,
      toTokenAccount: receiverTokenAccount,
      mint: mint,
    })
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
