import {
  Program,
  AnchorProvider,
  Idl,
  setProvider,
} from "@project-serum/anchor"
import { IDL as NftIdl, Nft } from "../idl/NftProgram"
import { IDL as SplTransferIdl, SplTransfer } from "../idl/SplTransferProgram"
import { clusterApiUrl, Connection, Keypair, PublicKey } from "@solana/web3.js"

const MockWallet = {
  signTransaction: () => Promise.reject(),
  signAllTransactions: () => Promise.reject(),
  publicKey: Keypair.generate().publicKey,
}

export const connection = new Connection(clusterApiUrl("devnet"))

const provider = new AnchorProvider(connection, MockWallet, {})
setProvider(provider)

const splTransferProgramId = new PublicKey(
  "h9gqsge8CFzo2gajMwkUrWWp4RkX6xB6rrrQMhJfBkN"
)

export const splTransferProgram = new Program(
  SplTransferIdl as Idl,
  splTransferProgramId
) as unknown as Program<SplTransfer>

const nftProgramId = new PublicKey(
  "5aia16UteFJBDNNW3RBqtxRqVKULCBKgppjPafEvTzG1"
)

export const nftProgram = new Program(
  NftIdl as Idl,
  nftProgramId
) as unknown as Program<Nft>

export const TOKEN_METADATA_PROGRAM_ID = new PublicKey(
  "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
)

export const nft = {
  uri: "https://arweave.net/bj7vXx6-AmFV0lk0QlCOGk1O9aCDoJAqefg55107rT4",
  name: "Test",
  symbol: "Test",
}
