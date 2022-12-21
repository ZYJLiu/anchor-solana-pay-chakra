import { Flex, useDisclosure, Button } from "@chakra-ui/react"
import QrModal from "../../components/QrCodeSplTransfer"

const Test = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  return (
    <Flex justifyContent="center">
      <Button onClick={onOpen}>Test Modal</Button>
      {isOpen && <QrModal onClose={onClose} />}
    </Flex>
  )
}

export default Test
