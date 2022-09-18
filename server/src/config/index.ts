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
        value: "0xBC1b379cD5182F0f096402223794afa0994B812c",
      },
    },
  ],
};

export default config;
