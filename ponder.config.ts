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
      address: "0xfBC3e454397C8e6525D48ED2bE6A91000B97a2D9",
      startBlock: 18656814,
    },
    PNSPaymentRouter: {
      network: "pharosDevnet",
      abi: PNSPaymentRouterABI,
      address: "0xD8d8F5051fe75B49DF221dCB6EB0cC4c2d8b25F6",
      startBlock: 18656814,
    },
    Pharlias: {
      network: "pharosDevnet",
      abi: PharliasABI,
      address: "0xee81752c72c97Cb231aC51F0434900C65C536Eb0",
      startBlock: 18656815,
    }
  },
});
