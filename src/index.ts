import { ponder } from "ponder:registry";
import { createHash, randomBytes } from "crypto";
import {
  DomainRegistered,
  DomainRenewed,
  RegistrationFeeChanged,
} from "ponder:schema";

const handleEvent = async (table: any, event: any, context: any, extraValues = {}) => {
  const randomValue = randomBytes(16).toString("hex");
  const id = createHash("sha256")
    .update(`
      ${event.transaction.hash}
      -${event.block.number}
      -${event.block.timestamp}
      -${randomValue}
    `.trim())
    .digest("hex");

  await context.db.insert(table).values({
    id: id,
    blockNumber: event.block.number,
    blockTimestamp: event.block.timestamp,
    transactionHash: event.transaction.hash,
    ...extraValues,
  });
};

// Listen for DomainRegistered events
ponder.on("DomainNameNFT:DomainRegistered", async ({ event, context }) => {
  await handleEvent(DomainRegistered, event, context, {
    domain: event.args.domain,
    owner: event.args.owner,
    tokenId: event.args.tokenId,
    expiresAt: event.args.expiresAt,
  });
});


// Listen for DomainRenewed events
ponder.on("DomainNameNFT:DomainRenewed", async ({ event, context }) => {
  await handleEvent(DomainRenewed, event, context, {
    domain: event.args.domain,
    owner: event.args.owner,
    tokenId: Number(event.args.tokenId),
    expiresAt: Number(event.args.expiresAt),
  });
});

// Listen for RegistrationFeeChanged events
ponder.on("DomainNameNFT:RegistrationFeeChanged", async ({ event, context }) => {
  await handleEvent(RegistrationFeeChanged, event, context, {
    oldFee: event.args.oldFee.toString(),
    newFee: event.args.newFee.toString(),
  });
});
