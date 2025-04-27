import { ponder } from "ponder:registry";
import { createHash, randomBytes } from "crypto";
import {
  DomainRegistered,
  DomainRenewed,
  DomainTransferred,
  FundsWithdrawn,
  DomainUpdated
} from "ponder:schema";

type Status = "registered" | "updated";

const domains = new Map();

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

const updateDomainState = async (event: any, context: any, isTransfer = false) => {
  const { name, tokenId } = event.args;
  const domainKey = `${name}`;
  
  let domain = domains.get(domainKey);
  
  if (isTransfer) {
    if (domain) {
      domain.owner = event.args.to;
      domain.status = "updated";
    } else {
      domain = {
        name: name,
        owner: event.args.to,
        tokenId: tokenId,
        expires: 0, 
        status: "updated"
      };
    }
  } else {
    domain = {
      name: event.args.name,
      owner: event.args.owner,
      tokenId: event.args.tokenId,
      expires: event.args.expires,
      status: "updated"
    };
  }
  
  domains.set(domainKey, domain);
  
  await handleEvent(DomainUpdated, event, context, {
    name: domain.name,
    owner: domain.owner,
    expires: domain.expires,
    tokenId: domain.tokenId,
    status: domain.status as Status,
  });
};

ponder.on("RentRegistrar:DomainRegistered", async ({ event, context }) => {
  await handleEvent(DomainRegistered, event, context, {
    name: event.args.name,
    owner: event.args.owner,
    expires: event.args.expires,
    tokenId: event.args.tokenId,
  });
  
  const domainKey = `${event.args.name}`;
  domains.set(domainKey, {
    name: event.args.name,
    owner: event.args.owner,
    expires: event.args.expires,
    tokenId: event.args.tokenId,
    status: "registered"
  });
});

ponder.on("RentRegistrar:DomainRenewed", async ({ event, context }) => {
  await handleEvent(DomainRenewed, event, context, {
    name: event.args.name,
    owner: event.args.owner,
    newExpiry: event.args.newExpiry,
  });
  
  const domainKey = `${event.args.name}`;
  if (domains.has(domainKey)) {
    const domain = domains.get(domainKey);
    domain.expires = event.args.newExpiry;
    domains.set(domainKey, domain);
    
    await updateDomainState(event, context);
  }
});

ponder.on("RentRegistrar:DomainTransferred", async ({ event, context }) => {
  await handleEvent(DomainTransferred, event, context, {
    name: event.args.name,
    from: event.args.from,
    to: event.args.to,
    tokenId: event.args.tokenId,
  });
  
  await updateDomainState(event, context, true);
});

ponder.on("RentRegistrar:FundsWithdrawn", async ({ event, context }) => {
  await handleEvent(FundsWithdrawn, event, context, {
    owner: event.args.owner,
    amount: event.args.amount.toString(),
  });
});