import { ponder } from "ponder:registry";
import { createHash, randomBytes } from "crypto";
import {
  DomainRegistered,
  DomainRenewed,
  DomainTransferred,
  FundsWithdrawn,
} from "ponder:schema";

const handleEvent = async (table: any, event: any, context: any, extraValues = {}) => {
  const randomValue = randomBytes(16).toString("hex");
  const id = createHash("sha256")
    .update(`${event.transaction.hash}-${event.block.number}-${event.block.timestamp}-${randomValue}`.trim())
    .digest("hex");
  
  await context.db.insert(table).values({
    id: id,
    blockNumber: event.block.number,
    blockTimestamp: event.block.timestamp,
    transactionHash: event.transaction.hash,
    ...extraValues,
  });
};

ponder.on("RentRegistrar:DomainRegistered", async ({ event, context }) => {
  await handleEvent(DomainRegistered, event, context, {
    name: event.args.name,
    owner: event.args.owner,
    expires: event.args.expires,
    tokenId: event.args.tokenId,
  });
});

ponder.on("RentRegistrar:DomainRenewed", async ({ event, context }) => {
  await handleEvent(DomainRenewed, event, context, {
    name: event.args.name,
    owner: event.args.owner,
    newExpiry: event.args.newExpiry,
  });
});

ponder.on("RentRegistrar:DomainTransferred", async ({ event, context }) => {
  await handleEvent(DomainTransferred, event, context, {
    name: event.args.name,
    from: event.args.from,
    to: event.args.to,
    tokenId: event.args.tokenId,
  });
});

ponder.on("RentRegistrar:FundsWithdrawn", async ({ event, context }) => {
  await handleEvent(FundsWithdrawn, event, context, {
    owner: event.args.owner,
    amount: event.args.amount.toString(),
  });
});