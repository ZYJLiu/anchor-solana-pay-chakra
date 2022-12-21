import { Flex, Spacer } from "@chakra-ui/react"
import React from "react"
import dynamic from "next/dynamic"

const Header = () => {
  const WalletMultiButtonDynamic = dynamic(
    async () =>
      (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
    { ssr: false }
  )

  return (
    <Flex margin={5}>
      <Spacer />
      <WalletMultiButtonDynamic />
    </Flex>
  )
}

export default Header
