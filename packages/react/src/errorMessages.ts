export enum ErrorMessages {
  SIGNER_FALSY = 'Signer falsy: Please login first',

  OFFER_NOT_FOUND = 'Offer not found',
  OFFER_CREATION_FAILED = 'Offer creation failed',

  MINT_UNLOCKABLE_CONTENT_PREVIEW = 'Preview is required for private content',
  MINT_ANIMATION_PREVIEW = 'Preview is required for animations content',
  MINT_SIGNATURE_GENERATION = 'Error while creating the lazy minted asset signature',

  ASSET_LAZY_MINT_CREATION_FAILED = 'Error while creating the lazy minted asset',
  ASSET_TRANSACTION_CREATION_FAILED = 'Error while creating the transaction for the asset',

  INVITATION_NOT_FOUND = 'Invitation not found',
  INVITATION_CREATION_FAILED = 'Invitation creation failed',

  UPLOAD_FAILED = 'Upload failed',

  ACCOUNT_UPDATE_FAILED = 'Error while updating the account',
  ACCOUNT_VERIFICATION_FAILED = 'Error while verifying the account',

  OWNERSHIP_NOT_FOUND = 'Ownership not found',

  POLLING_TIMEOUT = 'Polling timeout. could not check ownership',

  TRANSACTION_REJECTED_BY_USER = 'Transaction was cancelled',
}
