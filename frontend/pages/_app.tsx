import type { AppProps } from "next/app"
import { ChakraProvider } from "@chakra-ui/react"
import WalletContextProvider from "../contexts/WalletContextProvider"
import { AnchorContextProvider } from "../contexts/AnchorContextProvider"
import Header from "../components/Header"

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider>
      <WalletContextProvider>
        <AnchorContextProvider>
          <Header />
          <Component {...pageProps} />
        </AnchorContextProvider>
      </WalletContextProvider>
    </ChakraProvider>
  )
}
