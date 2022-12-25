import { NextApiRequest, NextApiResponse } from "next"
import { PublicKey, Transaction } from "@solana/web3.js"
import { getAssociatedTokenAddress, getMint } from "@solana/spl-token"
import { BN } from "@project-serum/anchor"
import { connection, splTransferProgram as program } from "../../utils/setup"

let data = {
  receiver: "",
  reference: "",
  amount: "",
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

export type UpdatePostResponse = {
  success: boolean
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
  res: NextApiResponse<PostResponse | PostError | UpdatePostResponse>
) {
  if (req.query.path === "update-data") {
    data = { ...data, ...req.body }
    res.json({ success: true })
  } else {
    const { account } = req.body as InputData
    console.log(req.body)
    if (!account) {
      res.status(400).json({ error: "No account provided" })
      return
    }

    if (data.receiver === "" || data.reference === "") {
      res.status(200).json({
        transaction: "",
        message: "No active checkout",
      })
      return
    }

    try {
      const postResponse = await postImpl(
        new PublicKey(account),
        new PublicKey(data.receiver),
        new PublicKey(data.reference),
        Number(data.amount)
      )
      res.status(200).json(postResponse)
      return
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: "error creating transaction" })
      return
    }
  }
}

async function postImpl(
  account: PublicKey,
  receiver: PublicKey,
  reference: PublicKey,
  amount: number
): Promise<PostResponse> {
  const mint = new PublicKey("Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr")
  const mintData = await getMint(connection, mint)
  const adjustedAmount = amount * 10 ** mintData.decimals

  const senderTokenAccount = await getAssociatedTokenAddress(mint, account)
  const receiverTokenAccount = await getAssociatedTokenAddress(mint, receiver)

  const instruction = await program.methods
    .tokenTransfer(new BN(adjustedAmount))
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

  const message = `Amount ${amount}, Receiver ${receiver}, Reference ${reference}`

  // Return the serialized transaction
  return {
    transaction: base64,
    message,
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<
    GetResponse | PostResponse | PostError | UpdatePostResponse
  >
) {
  if (req.method === "GET") {
    return get(res)
  } else if (req.method === "POST") {
    return await post(req, res)
  } else {
    return res.status(405).json({ error: "Method not allowed" })
  }
}
