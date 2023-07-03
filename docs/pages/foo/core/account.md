# Account

The `Account` module provides methods to update and verify an account.

## Methods

### update

This method allows you to update an account.

```ts
async update(account: AccountInput, signer: Signer): Promise<Address>
```

### verify

This method allows you to verify an account.

```ts
async verify(signer: Signer): Promise<AccountVerificationStatus>
```

Each method in the `Account` class returns a `Promise`. The `update` method returns a `Promise` that resolves to the address of the updated account. The `verify` method returns a `Promise` that resolves to the verification status of the account.

The `account` parameter in the `update` method is the account data to update. The `signer` parameter in both methods is an instance of `Signer` used to sign transactions.
