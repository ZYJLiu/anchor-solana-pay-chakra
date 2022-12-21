import * as anchor from "@project-serum/anchor"
import * as spl from "@solana/spl-token"
import { Program } from "@project-serum/anchor"
import { SplTransfer } from "../target/types/spl_transfer"
import { Keypair } from "@solana/web3.js"
import { expect } from "chai"

describe("spl-transfer", () => {
  anchor.setProvider(anchor.AnchorProvider.env())
  const connection = anchor.getProvider().connection
  const wallet = anchor.workspace.SplTransfer.provider.wallet

  const program = anchor.workspace.SplTransfer as Program<SplTransfer>

  const receiver = anchor.web3.Keypair.generate()
  let senderTokenAccount: anchor.web3.PublicKey
  let receiverTokenAccount: anchor.web3.PublicKey
  let mint: anchor.web3.PublicKey

  before(async () => {
    mint = await spl.createMint(
      connection,
      wallet.payer,
      wallet.publicKey,
      null,
      3
    )

    senderTokenAccount = await spl.createAccount(
      connection,
      wallet.payer,
      mint,
      wallet.publicKey
    )

    receiverTokenAccount = await spl.getAssociatedTokenAddress(
      mint,
      receiver.publicKey
    )

    await spl.mintTo(
      connection,
      wallet.payer,
      mint,
      senderTokenAccount,
      wallet.payer,
      100_000
    )
  })

  it("Is initialized!", async () => {
    // Add your test here.
    const tx = await program.methods
      .tokenTransfer(new anchor.BN(10))
      .accounts({
        // sender: wallet.publicKey,
        receiver: receiver.publicKey,
        fromTokenAccount: senderTokenAccount,
        toTokenAccount: receiverTokenAccount,
        mint: mint,
      })
      .rpc()

    const tokenAccount = await spl.getAccount(connection, receiverTokenAccount)
    expect(Number(tokenAccount.amount)).to.equal(10)
  })
})
