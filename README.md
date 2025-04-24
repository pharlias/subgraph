# Subgraph with Ponder

![Ponder Logo](./public/logo-ponder.png)

## 🚀 Overview
This project is a **Ponder Event Listener** setup that listens to on-chain events from various smart contracts on the **Pharos Devnet**. It records events like **DomainRegistered, DomainRenewed, and RegistrationFeeChanged** into a structured database.

## 📌 Features
- Listens to multiple smart contracts.
- Stores events efficiently using a single **handleEvent** function.
- Supports **DomainRegistered, DomainRenewed, and RegistrationFeeChanged**.
- Uses **Ponder** for indexing and event tracking.

## 📂 Project Structure
```
📦 subgraph
├── 📄 ponder.config.ts  # Ponder configuration (networks & contracts)
├── 📄 ponder.schema.ts  # Defines on-chain table schemas
├── 📄 src/index.ts      # Main event handlers
├── 📄 README.md         # Documentation
```

## ⚙️ Installation
To set up the project locally:
```sh
# Clone the repository
git clone https://github.com/pharlias/subgraph.git
cd subgraph

# Install dependencies
pnpm install
```

## 🏗️ Usage
Run the Ponder indexer to start listening for events:
```sh
pnpm dev
```

## 📡 Supported Events
### Pharlias Contract
- `DomainRegistered`
- `DomainRenewed`
- `RegistrationFeeChanged`

## ⚡ Configuration
Modify the **ponder.config.ts** file to add/remove contracts or update network settings.
```js
export default createConfig({
  networks: {
    educhainTestnet: {
      chainId: 50002,
      transport: http(process.env.PONDER_RPC_URL_1),
    },
  },
  contracts: {
    Opti: { ... },
    // Add more contracts here
  },
});
```

## 📜 License
This project is licensed under the **MIT License**.

## 💡 Contributing
Feel free to submit issues or pull requests to improve the project.

## 🔗 Links
- [Ponder Documentation](https://ponder.sh/docs)
- [Viem Library](https://viem.sh/)