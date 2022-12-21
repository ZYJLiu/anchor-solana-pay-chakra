import { Flex } from "@chakra-ui/react"
import ModalButton from "../components/ModalButton"
import NumberPad from "../components/Numpad"
export default function Home() {
  return (
    <div>
      <Flex height="75vh" alignItems="center" justifyContent="center">
        <NumberPad />
        <ModalButton />
      </Flex>
    </div>
  )
}
