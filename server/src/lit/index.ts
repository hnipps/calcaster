import LitJsSdk from "@lit-protocol/sdk-nodejs";

const init = async () => {
  const litNodeClient = new LitJsSdk.LitNodeClient({
    alertWhenUnauthorized: false,
  });
  await litNodeClient.connect();
  return litNodeClient;
};

export default init;
