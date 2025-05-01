import { createConfig } from "ponder";
import { http } from "viem";
import { RentRegistrarABI } from "./abis/RentRegistrarABI";
import { PNSPaymentRouterABI } from "./abis/PNSPaymentRouterABI";
import { PharliasABI } from "./abis/PharliasABI";

export default createConfig({
  // database: {
  //   kind: "postgres",
  //   connectionString: process.env.PONDER_DATABASE_URL,
  // },
  networks: {
    pharosDevnet: {
      chainId: 50002,
      transport: http(process.env.PONDER_RPC_URL_1),
      // pollingInterval: 2000,
      maxRequestsPerSecond: 5
    },
  },
  contracts: {
    RentRegistrar: {
      network: "pharosDevnet",
      abi: RentRegistrarABI,
      address: "0x5921505FDF107b78A7EEA7A6CA786Fc42fEFe49f",
      startBlock: 18807461,
    },
    PNSPaymentRouter: {
      network: "pharosDevnet",
      abi: PNSPaymentRouterABI,
      address: "0x6C9f6dA9c8716f12F86a40d62a7eABcAf63bc494",
      startBlock: 18807535,
    },
    Pharlias: {
      network: "pharosDevnet",
      abi: PharliasABI,
      address: "0x1B2071628e2338aD3A5724F5D0a03308Ff2dBf05",
      startBlock: 18807077,
    }
  },
});
