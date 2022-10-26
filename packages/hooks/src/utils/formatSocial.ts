export const formatSocial = (handle: string | undefined): string | undefined =>
  handle ? handle.replace(/^@/, '') : undefined
