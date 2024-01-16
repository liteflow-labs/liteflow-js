import invariant from 'ts-invariant'

export class Uploader {
  private readonly uploadEndpoint: URL

  constructor(uploadEndpoint: URL) {
    this.uploadEndpoint = uploadEndpoint
  }

  public async upload(file: File | URL | string | undefined | null) {
    if (file === null) return null
    if (!file) return
    if (file instanceof URL) return file.toString()
    if (typeof file === 'string') return file
    const formData = new FormData()
    formData.append('file', file)
    const response = await fetch(this.uploadEndpoint, {
      method: 'POST',
      body: formData,
    })
    const result = await response.json()
    invariant(response.ok, `Upload failed: ${result.error}`)
    return `ipfs://${result.cid}`
  }
}
