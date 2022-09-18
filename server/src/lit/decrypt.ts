import { Wallet } from "ethers";
import LitJsSdk from "@lit-protocol/sdk-nodejs";

const decrypt = async (
  litNodeClient: any,
  wallet: Wallet,
  accessControlConditions: any,
  encryptedSymmetricKey: any,
  chain: string,
  file: Blob
) => {
  console.log({
    wallet,
    accessControlConditions,
    encryptedSymmetricKey,
    chain,
    file,
  });

  const message = `I am creating an account to use Lit Protocol at ${new Date().toISOString()}`;

  const signature = await wallet.signMessage(message);

  const authSig = {
    sig: signature,
    derivedVia: "web3.eth.personal.sign",
    signedMessage: message,
    address: wallet.address,
  };

  const symmetricKey: Uint8Array = await litNodeClient.getEncryptionKey({
    accessControlConditions,
    toDecrypt: encryptedSymmetricKey,
    chain,
    authSig,
  });

  const decryptedFile: ArrayBuffer = await LitJsSdk.decryptFile({
    file,
    symmetricKey,
  }).catch((err: any) => {
    console.log("Something went wrong while decrypting...");
    console.error(err);
  });

  return JSON.parse(new Buffer(decryptedFile).toString());
};

export default decrypt;
