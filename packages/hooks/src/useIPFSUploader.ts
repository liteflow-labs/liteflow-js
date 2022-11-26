import IPFSGatewayTools from '@pinata/ipfs-gateway-tools/dist/node' // The node plugin is working for both node and browser while the browser only works on client side
import { useCallback } from 'react'
import invariant from 'ts-invariant'
import { ErrorMessages } from './errorMessages'

type UploadFn = (
  file: File | string,
  options?: { protected?: boolean },
) => Promise<string>

export default function useIPFSUploader(uploadUrl: string): [UploadFn] {
  const upload = useCallback<UploadFn>(
    async (file, options) => {
      if (typeof file === 'string') {
        const gatewayTools = new IPFSGatewayTools()
        const { cid, containsCid } = gatewayTools.containsCID(file)
        return containsCid ? cid : undefined
      }
      const formData = new FormData()
      formData.append('file', file)
      formData.append('protected', options?.protected ? 'true' : 'false')
      const response = await fetch(uploadUrl, {
        method: 'POST',
        body: formData,
      })
      const result = await response.json()
      invariant(response.ok, `${ErrorMessages.UPLOAD_FAILED}: ${result.error}`)
      return result.cid
    },
    [uploadUrl],
  )

  return [upload]
}
