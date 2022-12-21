import type { AppProps } from "next/app"
import { ChakraProvider } from "@chakra-ui/react"
import WalletContextProvider from "../contexts/WalletContextProvider"
import { AnchorContextProvider } from "../contexts/AnchorContextProvider"
import NavigationBar from "../components/NavigationBar"

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider>
      <WalletContextProvider>
        <AnchorContextProvider>
          <NavigationBar />
          <Component {...pageProps} />
        </AnchorContextProvider>
      </WalletContextProvider>
    </ChakraProvider>
  )
}
