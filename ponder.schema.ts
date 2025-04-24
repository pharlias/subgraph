import { onchainTable } from "ponder";

export const DomainRegistered = onchainTable("DomainRegistered", (t) => ({
  id: t.text().primaryKey(),
  domain: t.text(),
  owner: t.text(),
  tokenId: t.integer(),
  expiresAt: t.integer(),
  blockNumber: t.integer(),
  blockTimestamp: t.integer(),
  transactionHash: t.text(),
}));

export const DomainRenewed = onchainTable("DomainRenewed", (t) => ({
  id: t.text().primaryKey(),
  domain: t.text(),
  owner: t.text(),
  tokenId: t.integer(),
  expiresAt: t.integer(),
  blockNumber: t.integer(),
  blockTimestamp: t.integer(),
  transactionHash: t.text(),
}));

export const RegistrationFeeChanged = onchainTable("RegistrationFeeChanged", (t) => ({
  id: t.text().primaryKey(),
  oldFee: t.numeric(),
  newFee: t.numeric(),
  blockNumber: t.integer(),
  blockTimestamp: t.integer(),
  transactionHash: t.text(),
}));
