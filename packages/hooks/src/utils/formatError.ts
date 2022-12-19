import { ErrorMessages } from '../errorMessages'

export const formatError = (error: unknown): string | undefined => {
  if (!error) return
  if ((error as any).code === 'ACTION_REJECTED')
    return ErrorMessages.TRANSACTION_REJECTED_BY_USER
  if ((error as any).error) return formatError((error as any).error)
  if ((error as any).data?.message) return formatError((error as any).data)
  if ((error as Error).message) return (error as Error).message
  return (error as any).toString()
}
