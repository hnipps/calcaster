import { Wallet } from "ethers";

const getWallet = (mnemonic?: string) => {
  if (mnemonic) {
    const wallet = Wallet.fromMnemonic(mnemonic);
    return wallet;
  }

  const wallet = Wallet.createRandom();

  return wallet;
};

export default getWallet;
