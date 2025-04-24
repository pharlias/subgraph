import { onchainTable } from "ponder";

export const DomainRegistered = onchainTable("DomainRegistered", (t) => ({
  id: t.text().primaryKey(),
  name: t.text(),
  owner: t.text(),
  expires: t.integer(),
  tokenId: t.text(),
  blockNumber: t.integer(),
  blockTimestamp: t.integer(),
  transactionHash: t.text(),
}));

export const DomainRenewed = onchainTable("DomainRenewed", (t) => ({
  id: t.text().primaryKey(),
  name: t.text(),
  owner: t.text(),
  newExpiry: t.integer(),
  blockNumber: t.integer(),
  blockTimestamp: t.integer(),
  transactionHash: t.text(),
}));

export const DomainTransferred = onchainTable("DomainTransferred", (t) => ({
  id: t.text().primaryKey(),
  name: t.text(),
  from: t.text(),
  to: t.text(),
  tokenId: t.text(),
  blockNumber: t.integer(),
  blockTimestamp: t.integer(),
  transactionHash: t.text(),
}));

export const FundsWithdrawn = onchainTable("FundsWithdrawn", (t) => ({
  id: t.text().primaryKey(),
  owner: t.text(),
  amount: t.numeric(),
  blockNumber: t.integer(),
  blockTimestamp: t.integer(),
  transactionHash: t.text(),
}));