import invariant from 'ts-invariant'

export class Uploader {
  private readonly uploadEndpoint: URL

  constructor(uploadEndpoint: URL) {
    this.uploadEndpoint = uploadEndpoint
  }

  public async publicUpload(
    file: File | URL | undefined,
  ): Promise<string | undefined> {
    return this.upload(file, false)
  }

  public async privateUpload(
    file: File | URL | undefined,
  ): Promise<string | undefined> {
    return this.upload(file, true)
  }

  private async upload(file: File | URL | undefined, isPrivate = false) {
    if (!file) return
    if (file instanceof URL) return file.toString()
    const formData = new FormData()
    formData.append('file', file)
    formData.append('protected', isPrivate ? 'true' : 'false')
    const response = await fetch(this.uploadEndpoint, {
      method: 'POST',
      body: formData,
    })
    const result = await response.json()
    invariant(response.ok, `Upload failed: ${result.error}`)
    return result.cid
  }
}
