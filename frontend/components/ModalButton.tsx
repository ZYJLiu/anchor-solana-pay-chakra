import { Flex, Button, useDisclosure } from "@chakra-ui/react"
import QrModal from "./QrModal"
import { useAnchor } from "../contexts/AnchorContextProvider"

const ModalButton = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { program, connection, provider } = useAnchor()

  return (
    <Flex>
      <Button onClick={onOpen}>Open Modal</Button>
      {isOpen && <QrModal onClose={onClose} isOpen={isOpen} />}
    </Flex>
  )
}

export default ModalButton
