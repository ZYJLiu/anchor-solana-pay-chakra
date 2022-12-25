//testing nfc tag, creating QR code to scan with nfc writer

import {
  useDisclosure,
  Button,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  VStack,
} from "@chakra-ui/react"
import { useEffect, useState } from "react"
import QrModal from "../../components/QrCodeTest"

const Test = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [value, setValue] = useState(0)

  useEffect(() => {
    console.log(value)
  }, [value])

  return (
    <VStack justifyContent="center">
      <NumberInput
        defaultValue={0}
        min={0}
        maxW={24}
        precision={2}
        onChange={(event) => setValue(Number(event))}
      >
        <NumberInputField value={value} />
        <NumberInputStepper>
          <NumberIncrementStepper />
          <NumberDecrementStepper />
        </NumberInputStepper>
      </NumberInput>
      <Button onClick={onOpen}>Checkout</Button>
      {isOpen && <QrModal onClose={onClose} value={value} />}
    </VStack>
  )
}

export default Test
