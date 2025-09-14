// utils/wagmi.js
import { createConfig, http } from "wagmi";
import { mainnet, sepolia } from "wagmi/chains";
import { injected } from "wagmi/connectors";

// create wagmi client config
export const config = createConfig({
  chains: [mainnet, sepolia], // which networks to support
  transports: {
    [mainnet.id]: http(), // default RPC provider
    [sepolia.id]: http(),
  },
  connectors: [injected()], // wallet connectors (e.g. MetaMask)
});
