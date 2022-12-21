import type { AppProps } from "next/app"
import { ChakraProvider } from "@chakra-ui/react"
import WalletContextProvider from "../contexts/WalletContextProvider"
import { AnchorContextProvider } from "../contexts/AnchorContextProvider"
import Header from "../components/Header"
import NavigationBar from "../components/Navbar"

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider>
      <WalletContextProvider>
        <AnchorContextProvider>
          {/* <Header /> */}
          <NavigationBar />
          <Component {...pageProps} />
        </AnchorContextProvider>
      </WalletContextProvider>
    </ChakraProvider>
  )
}
