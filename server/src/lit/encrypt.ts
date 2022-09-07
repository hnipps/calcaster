import { Wallet } from "ethers";
import { SiweMessage } from "siwe";
import LitJsSdk from "@lit-protocol/sdk-nodejs";
import { getAddress, hexlify, toUtf8Bytes } from "ethers/lib/utils";

const encrypt = async (
  litNodeClient: any,
  file: File | Blob,
  wallet: Wallet,
  address: string,
  chain: string,
  accessControlConditions: any
) => {
  const message = `I am creating an account to use Lit Protocol at ${new Date().toISOString()}`;

  const signature = await wallet.signMessage(message);

  const authSig = {
    sig: signature,
    derivedVia: "web3.eth.personal.sign",
    signedMessage: message,
    address: wallet.address,
  };

  const {
    encryptedFile,
    symmetricKey,
  }: { encryptedFile: Blob; symmetricKey: Uint8Array } =
    await LitJsSdk.encryptFile({
      file,
    });

  const encryptedSymmetricKey = await litNodeClient.saveEncryptionKey({
    accessControlConditions,
    symmetricKey,
    authSig,
    chain,
  });

  return {
    encryptedFile,
    encryptedSymmetricKey: LitJsSdk.uint8arrayToString(
      encryptedSymmetricKey,
      "base16"
    ),
  };
};

export default encrypt;
