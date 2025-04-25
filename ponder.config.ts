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
      address: "0x578b2807ea81C429505F1be4743Aec422758A461",
      startBlock: 17824021,
    }
  },
});
