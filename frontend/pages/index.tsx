import { Flex, useDisclosure, Button } from "@chakra-ui/react"
import QrModal from "../components/QrCodeNftMint"

export default function Home() {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <Flex justifyContent="center">
      <Button onClick={onOpen}>Mint NFT</Button>
      {isOpen && <QrModal onClose={onClose} />}
    </Flex>
  )
}
