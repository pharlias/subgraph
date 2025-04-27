import { createConfig } from "ponder";
import { http } from "viem";
import { RentRegistrarABI } from "./abis/RentRegistrarABI";

export default createConfig({
  // database: {
  //   kind: "postgres",
  //   connectionString: process.env.PONDER_DATABASE_URL,
  // },
  networks: {
    pharosDevnet: {
      chainId: 50002,
      transport: http(process.env.PONDER_RPC_URL_1),
    },
  },
  contracts: {
    RentRegistrar: {
      network: "pharosDevnet",
      abi: RentRegistrarABI,
      address: "0x04Fe54D9c2C6A6753938690429C59e802C1f7b2e",
      startBlock: 18051350,
    }
  },
});
