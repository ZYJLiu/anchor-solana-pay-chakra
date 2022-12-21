import { Box, Button, Grid, Textarea } from "@chakra-ui/react"
import { useState } from "react"

function Numpad({
  onPress,
  value,
}: {
  onPress: (button: string) => void
  value: string
}) {
  return (
    <Box margin={4}>
      <Textarea value={value} />
      <Grid templateColumns="repeat(3, 1fr)" gap={4}>
        <Button onClick={() => onPress("1")}>1</Button>
        <Button onClick={() => onPress("2")}>2</Button>
        <Button onClick={() => onPress("3")}>3</Button>
        <Button onClick={() => onPress("4")}>4</Button>
        <Button onClick={() => onPress("5")}>5</Button>
        <Button onClick={() => onPress("6")}>6</Button>
        <Button onClick={() => onPress("7")}>7</Button>
        <Button onClick={() => onPress("8")}>8</Button>
        <Button onClick={() => onPress("9")}>9</Button>
        <Button onClick={() => onPress("0")}>0</Button>
        <Button onClick={() => onPress(".")}>.</Button>
        <Button onClick={() => onPress("submit")}>Submit</Button>
        <Button onClick={() => onPress("clear")}>Clear</Button>
        <Button onClick={() => onPress("backspace")}>Backspace</Button>
      </Grid>
    </Box>
  )
}

export default function NumberPad() {
  const [value, setValue] = useState("")

  const handlePress = (button: string) => {
    if (button === "clear") {
      setValue("")
    } else if (button === "backspace") {
      setValue((prevValue) => prevValue.slice(0, -1))
    } else if (button === "submit") {
    } else {
      setValue((prevValue) => prevValue + button)
    }
  }

  return <Numpad onPress={handlePress} value={value} />
}
