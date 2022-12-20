import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  Heading,
  Link,
  Spacer,
  Text,
} from "@chakra-ui/react"
import React from "react"
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui"

const Header = () => {
  return (
    <Flex margin={5}>
      <Spacer />
      <WalletMultiButton />
    </Flex>
  )
}

export default Header
