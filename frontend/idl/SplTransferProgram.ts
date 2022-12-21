export type SplTransfer = {
  version: "0.1.0"
  name: "spl_transfer"
  instructions: [
    {
      name: "tokenTransfer"
      accounts: [
        {
          name: "sender"
          isMut: true
          isSigner: true
        },
        {
          name: "receiver"
          isMut: false
          isSigner: false
        },
        {
          name: "fromTokenAccount"
          isMut: true
          isSigner: false
        },
        {
          name: "toTokenAccount"
          isMut: true
          isSigner: false
        },
        {
          name: "mint"
          isMut: false
          isSigner: false
        },
        {
          name: "tokenProgram"
          isMut: false
          isSigner: false
        },
        {
          name: "associatedTokenProgram"
          isMut: false
          isSigner: false
        },
        {
          name: "systemProgram"
          isMut: false
          isSigner: false
        },
        {
          name: "rent"
          isMut: false
          isSigner: false
        }
      ]
      args: [
        {
          name: "amount"
          type: "u64"
        }
      ]
    }
  ]
}

export const IDL: SplTransfer = {
  version: "0.1.0",
  name: "spl_transfer",
  instructions: [
    {
      name: "tokenTransfer",
      accounts: [
        {
          name: "sender",
          isMut: true,
          isSigner: true,
        },
        {
          name: "receiver",
          isMut: false,
          isSigner: false,
        },
        {
          name: "fromTokenAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "toTokenAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "mint",
          isMut: false,
          isSigner: false,
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "associatedTokenProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "rent",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "amount",
          type: "u64",
        },
      ],
    },
  ],
}
