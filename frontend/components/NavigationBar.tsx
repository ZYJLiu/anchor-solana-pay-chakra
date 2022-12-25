import { Box, HStack, Spacer } from "@chakra-ui/react"
import Link from "next/link"
import WalletMultiButton from "./WalletMultiButton"

const NavigationBar = () => {
  return (
    <Box p={4}>
      <HStack justify={"flex-end"} direction={"row"} spacing={6}>
        <Link href="/">Mint Nft</Link>
        <Link href="/transfer">Spl Transfer</Link>
        <Link href="/test">Test</Link>
        <Spacer />
        <WalletMultiButton />
      </HStack>
    </Box>
  )
}

export default NavigationBar
