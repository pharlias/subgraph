import { createConfig } from "ponder";
import { http } from "viem";
import { DomainNameNFTABI } from "./abis/DomainNameNFTABI";

export default createConfig({
  database: {
    kind: "postgres",
    connectionString: process.env.PONDER_DATABASE_URL,
  },
  networks: {
    pharosDevnet: {
      chainId: 50002,
      transport: http(process.env.PONDER_RPC_URL_1),
    },
  },
  contracts: {
    DomainNameNFT: {
      network: "pharosDevnet",
      abi: DomainNameNFTABI,
      address: "0xeBf7d1872966FE6254caa8154b56bE4701BC3BA8",
      startBlock: 17382372,
    }
  },
});
