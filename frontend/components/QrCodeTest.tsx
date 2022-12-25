// for use with static nfc tag, but dynamically update reference, amount, receiver

import { Button, Flex, VStack } from "@chakra-ui/react"
import {
  createQR,
  encodeURL,
  findReference,
  FindReferenceError,
  TransactionRequestURLFields,
  ValidateTransferError,
} from "@solana/pay"
import { useWallet } from "@solana/wallet-adapter-react"
import { clusterApiUrl, Connection, Keypair } from "@solana/web3.js"
import { useEffect, useRef, useState } from "react"
import Confirmed from "./Confirmed"

interface Props {
  onClose: () => void
  value: number
}

const QrModal = ({ onClose, value }: Props) => {
  console.log(value)
  const [confirmed, setConfirmed] = useState(false)
  const connection = new Connection(clusterApiUrl("devnet"))
  const qrRef = useRef<HTMLDivElement>(null)
  const [reference] = useState(Keypair.generate().publicKey)
  const { publicKey } = useWallet()

  const [size, setSize] = useState(() =>
    typeof window === "undefined" ? 100 : Math.min(window.outerWidth - 10, 512)
  )

  useEffect(() => {
    const listener = () => setSize(Math.min(window.outerWidth - 10, 512))
    window.addEventListener("resize", listener)
    return () => window.removeEventListener("resize", listener)
  }, [])

  useEffect(() => {
    if (publicKey) {
      const { location } = window
      const apiUrl = `${location.protocol}//${location.host}/api/test`
      const urlParams: TransactionRequestURLFields = {
        link: new URL(apiUrl),
      }
      const solanaUrl = encodeURL(urlParams)
      const qr = createQR(solanaUrl, size, "white")
      if (qrRef.current) {
        qrRef.current.innerHTML = ""
        qr.append(qrRef.current)
      }

      // const data = {
      //   receiver: "2Dbi1BTTVFeL8KD5r9sUxxdyjUbwFCGQ2eEWNpdvrYWs",
      //   reference: "2Dbi1BTTVFeL8KD5r9sUxxdyjUbwFCGQ2eEWNpdvrYWs",
      //   amount: "20",
      // }

      const url = new URL("/api/test", window.location.origin)
      url.search = new URLSearchParams({ path: "update-data" }).toString()

      fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          receiver: publicKey.toString(),
          reference: reference.toString(),
          amount: value.toString(),
        }),
      })
        .then((res) => res.json())
        .then((json) => console.log(json))
    }
  }, [window, size, reference, publicKey])

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const signatureInfo = await findReference(connection, reference, {
          finality: "confirmed",
        })
        setConfirmed(true)
      } catch (e) {
        if (e instanceof FindReferenceError) return
        if (e instanceof ValidateTransferError) {
          console.error("Transaction is invalid", e)
          return
        }
        console.error("Unknown error", e)
      }
    }, 500)
    return () => {
      clearInterval(interval)
      setConfirmed(false)
    }
  }, [reference.toString()])

  return (
    <VStack
      position="fixed"
      top="50%"
      left="50%"
      transform="translate(-50%, -50%)"
      backgroundColor="white"
      padding="10px"
      rounded="2xl"
    >
      {confirmed ? (
        <div style={{ width: size }}>
          <Confirmed />
        </div>
      ) : (
        <Flex ref={qrRef} />
      )}
      <Button
        color="gray"
        onClick={() => {
          setConfirmed(false)
          onClose()
        }}
      >
        Close
      </Button>
    </VStack>
  )
}

export default QrModal
