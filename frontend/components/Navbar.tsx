import { Box, Flex, Text, HStack, Spacer } from "@chakra-ui/react"
import { useRouter } from "next/router"
import Link from "next/link"
import WalletMultiButton from "./WalletMultiButton"
function NavigationBar() {
  const router = useRouter()
  const pathname = router.pathname

  return (
    <Box p={4}>
      <HStack justify={"flex-end"} direction={"row"} spacing={6}>
        <Link href="/">Home</Link>
        <Link href="/test">Test</Link>
        <Link href="/">Test</Link>
        <Spacer />
        <WalletMultiButton />
      </HStack>
    </Box>
  )
}

export default NavigationBar
