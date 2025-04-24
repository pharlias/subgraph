import { createConfig } from "ponder";
import { http } from "viem";
import { RentRegistrarABI } from "./abis/RentRegistrarABI";

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
    RentRegistrar: {
      network: "pharosDevnet",
      abi: RentRegistrarABI,
      address: "0x92c0969b14078Bc57DaEfEda63e24C22dDa35BDf",
      startBlock: 17382372,
    }
  },
});
