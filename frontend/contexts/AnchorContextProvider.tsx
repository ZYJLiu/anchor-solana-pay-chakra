import { createContext, useContext } from "react"
import {
  Program,
  AnchorProvider,
  Idl,
  setProvider,
} from "@project-serum/anchor"
import { IDL, Nft } from "../idl/program_idl"
import { Connection, PublicKey } from "@solana/web3.js"
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react"
// import MockWallet from "./MockWallet"

const AnchorContext = createContext({})
const programId = new PublicKey("5aia16UteFJBDNNW3RBqtxRqVKULCBKgppjPafEvTzG1")

interface AnchorWorkSpace {
  connection?: Connection
  provider?: AnchorProvider
  program?: Program<Nft>
}

const AnchorContextProvider = ({ children }: any) => {
  // const network = "https://api.devnet.solana.com/"
  // const connection = new Connection(network)
  const { connection } = useConnection()
  const wallet = useAnchorWallet()
  const provider = new AnchorProvider(connection, wallet!, {})

  setProvider(provider)
  const program = new Program(IDL as Idl, programId) as unknown as Program<Nft>

  const anchorWorkspace = {
    connection,
    provider,
    program,
  }

  return (
    <AnchorContext.Provider value={anchorWorkspace}>
      {children}
    </AnchorContext.Provider>
  )
}

const useAnchor = (): AnchorWorkSpace => {
  return useContext(AnchorContext)
}

export { AnchorContextProvider, useAnchor }
