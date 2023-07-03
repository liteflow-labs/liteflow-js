import { Client } from '@liteflow/core'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function offer(
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> {
  if (!req.query.id) return res.status(400).json({ error: 'Missing offer id' })
  if (typeof req.query.id !== 'string')
    return res.status(400).json({ error: 'Invalid offer id' })
  const client = new Client(process.env.NEXT_PUBLIC_LITEFLOW_API_KEY)
  const offer = await client.exchange.getOffer(req.query.id)
  res.status(200).json(offer)
}
