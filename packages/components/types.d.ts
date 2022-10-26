interface Window {
  ethereum?: any
}

declare module '@pinata/ipfs-gateway-tools/dist/node' {
  export default class IPFSGatewayTools {
    constructor()

    containsCID(url: string): { containsCid: boolean; cid: string | null }
  }
}

type URI = string
type UUID = string

interface BlockExplorer {
  name: string
  token: (address: string, id: string) => string
  transaction: (hash: string | undefined) => string | null
}
