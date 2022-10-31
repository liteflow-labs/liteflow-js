export enum ErrorMessages {
  FEATURE_DISABLED_LAZY_MINT = 'Feature LazyMint disabled',
  FEATURE_DISABLED_TOP_UP = 'Feature TopUp disabled',
  FEATURE_DISABLED_SOCIAL = 'Feature Social disabled',
  FEATURE_DISABLED_UNLOCKABLE_CONTENT = 'Feature Unlockable Content disabled',
  FEATURE_DISABLED_REFERRAL = 'Feature Referral disabled',

  SIGNER_FALSY = 'Signer falsy: Please login first',

  AUCTION_NOT_FOUND = 'Auction not found',
  AUCTION_RESERVER_NOT_MATCH = 'Reserve not match',
  AUCTION_CREATION_FAILED = 'Auction creation failed',

  OFFER_NOT_FOUND = 'Offer not found',
  OFFER_CREATION_FAILED = 'Offer creation failed',

  MINT_UNLOCKABLE_CONTENT_PREVIEW = 'Preview is required for private content',
  MINT_ANIMATION_PREVIEW = 'Preview is required for animations content',
  MINT_SIGNATURE_GENERATION = 'Error while creating the lazy minted asset signature',

  ASSET_LAZY_MINT_CREATION_FAILED = 'Error while creating the lazy minted asset',
  ASSET_CREATION_FAILED = 'Error while creating this asset',
  ASSET_INVALID_STANDARD = 'Invalid token',
  ASSET_NO_MINT = 'No transaction to mint',

  INVITATION_NOT_FOUND = 'Invitation not found',
  INVITATION_CREATION_FAILED = 'Invitation creation failed',

  UPLOAD_FAILED = 'Upload failed',

  ACCOUNT_UPDATE_FAILED = 'Error while updating the account',
  ACCOUNT_VERIFICATION_FAILED = 'Error while verifying the account',

  OWNERSHIP_NOT_FOUND = 'Ownership not found',

  POLLING_TIMEOUT = 'Polling timeout. could not check ownership',
}
