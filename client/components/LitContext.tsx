import {
  createContext,
  FC,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import LitJsSdk from "@lit-protocol/sdk-browser";

type LitType = {
  client: null | any;
};

const initialValue: LitType = {
  client: null,
};

export const LitContext = createContext(initialValue);

export const useLit = () => {
  const lit = useContext(LitContext);
  return lit;
};

const LitProvider: FC<PropsWithChildren> = ({ children }) => {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    const connect = async () => {
      const client = new LitJsSdk.LitNodeClient();
      await client.connect();
      setValue({ client });
    };
    connect();
  }, []);

  return <LitContext.Provider value={value}>{children}</LitContext.Provider>;
};

export default LitProvider;
