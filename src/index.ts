import { ponder } from "ponder:registry";
import { createHash, randomBytes } from "crypto";
import {
  DomainRegistered,
  DomainRenewed,
  DomainTransferred,
  FundsWithdrawn,
  DomainUpdated,
  ETHTransferToPNS
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
  try {
    const name = isTransfer ? event.args.name : event.args.name;
    if (!name) {
      console.error("Missing domain name in event args", event.args);
      return;
    }

    const domainKey = `${name}`;
    let domain = domains.get(domainKey);

    if (isTransfer) {
      if (domain) {
        domain = {
          ...domain,
          owner: event.args.to,
          status: "updated"
        };
      } else {
        domain = {
          name: name,
          owner: event.args.to,
          tokenId: event.args.tokenId,
          expires: 0,
          status: "updated"
        };
      }
    } else {
      if (domain) {
        const updatedDomain = { ...domain, status: "updated" };

        if (event.args.owner !== undefined) updatedDomain.owner = event.args.owner;
        if (event.args.expires !== undefined) updatedDomain.expires = event.args.expires;
        if (event.args.newExpiry !== undefined) updatedDomain.expires = event.args.newExpiry;
        if (event.args.tokenId !== undefined) updatedDomain.tokenId = event.args.tokenId;

        domain = updatedDomain;
      } else {
        domain = {
          name: name,
          owner: event.args.owner || "",
          tokenId: event.args.tokenId || 0,
          expires: event.args.expires || event.args.newExpiry || 0,
          status: "updated"
        };
      }
    }

    domains.set(domainKey, domain);

    const domainUpdatedData = {
      name: domain.name,
      owner: domain.owner,
      expires: domain.expires,
      tokenId: domain.tokenId,
      status: domain.status as Status,
    };

    await handleEvent(DomainUpdated, event, context, domainUpdatedData);
  } catch (error) {
    console.error("Error in updateDomainState:", error);
    throw error;
  }
};

ponder.on("RentRegistrar:DomainRegistered", async ({ event, context }) => {
  try {
    await handleEvent(DomainRegistered, event, context, {
      name: event.args.name,
      owner: event.args.owner,
      expires: event.args.expires,
      tokenId: event.args.tokenId,
    });

    const domainKey = `${event.args.name}`;
    const domain = {
      name: event.args.name,
      owner: event.args.owner,
      expires: event.args.expires,
      tokenId: event.args.tokenId,
      status: "registered"
    };
    domains.set(domainKey, domain);

    await handleEvent(DomainUpdated, event, context, {
      name: domain.name,
      owner: domain.owner,
      expires: domain.expires,
      tokenId: domain.tokenId,
      status: "registered" as Status,
    });
  } catch (error) {
    console.error("Error in DomainRegistered handler:", error);
    throw error;
  }
});

ponder.on("RentRegistrar:DomainRenewed", async ({ event, context }) => {
  try {
    await handleEvent(DomainRenewed, event, context, {
      name: event.args.name,
      owner: event.args.owner,
      newExpiry: event.args.newExpiry,
    });

    const domainKey = `${event.args.name}`;
    let domain = domains.get(domainKey);

    if (domain) {
      domain.expires = event.args.newExpiry;
      domains.set(domainKey, domain);
    } else {
      domain = {
        name: event.args.name,
        owner: event.args.owner,
        expires: event.args.newExpiry,
        tokenId: 0,
        status: "updated"
      };
      domains.set(domainKey, domain);
    }

    await updateDomainState(event, context);
  } catch (error) {
    console.error("Error in DomainRenewed handler:", error);
    throw error;
  }
});

ponder.on("RentRegistrar:DomainTransferred", async ({ event, context }) => {
  try {
    await handleEvent(DomainTransferred, event, context, {
      name: event.args.name,
      from: event.args.from,
      to: event.args.to,
      tokenId: event.args.tokenId,
    });

    await updateDomainState(event, context, true);
  } catch (error) {
    console.error("Error in DomainTransferred handler:", error);
    throw error;
  }
});

ponder.on("RentRegistrar:FundsWithdrawn", async ({ event, context }) => {
  try {
    await handleEvent(FundsWithdrawn, event, context, {
      owner: event.args.owner,
      amount: event.args.amount.toString(),
    });
  } catch (error) {
    console.error("Error in FundsWithdrawn handler:", error);
    throw error;
  }
});

ponder.on("PNSPaymentRouter:ETHTransferToPNS", async ({ event, context }) => {
  try {
    await handleEvent(ETHTransferToPNS, event, context, {
      sender: event.args.sender,
      name: event.args.name,
      amount: event.args.amount.toString(),
    });
  } catch (error) {
    console.error("Error in ETHTransferToPNS handler:", error);
    throw error;
  }
});