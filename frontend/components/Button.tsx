import { Flex, Button, useDisclosure } from "@chakra-ui/react"
import QrModal from "./QrModal"

const QRCode = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <Flex>
      <Button onClick={onOpen}>Open Modal</Button>
      {isOpen && <QrModal onClose={onClose} isOpen={isOpen} />}
    </Flex>
  )
}

export default QRCode
