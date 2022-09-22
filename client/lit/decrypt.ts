import LitJsSdk from "@lit-protocol/sdk-browser";

type Params = {
  litNodeClient: any;
  accessControlConditions: any;
  encryptedSymmetricKey: any;
  chain: string;
  signature: string;
  message: string;
  address: string;
  file: Blob;
};

const decrypt = async ({
  litNodeClient,
  accessControlConditions,
  encryptedSymmetricKey,
  chain,
  signature,
  message,
  address,
  file,
}: Params) => {
  const authSig = {
    sig: signature,
    derivedVia: "web3.eth.personal.sign",
    signedMessage: message,
    address,
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
