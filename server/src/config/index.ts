const config = {
  accessControlConditions: [
    {
      contractAddress: "",
      standardContractType: "",
      chain: "ethereum",
      method: "",
      parameters: [":userAddress"],
      returnValueTest: {
        comparator: "=",
        value: "0xD02bf9b3DA78BEc791014EB3cEecA65990cb046F",
      },
    },
    { operator: "or" },
    {
      contractAddress: "",
      standardContractType: "",
      chain: "ethereum",
      method: "",
      parameters: [":userAddress"],
      returnValueTest: {
        comparator: "=",
        value: "0x50e2dac5e78B5905CB09495547452cEE64426bb2",
      },
    },
  ],
};

export default config;
