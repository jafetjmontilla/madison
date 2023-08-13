import { createContext, FC, useState, Dispatch, SetStateAction, useContext, useEffect } from 'react';
import { Loading } from "../components/Loading"
import { useRouter } from 'next/router';


type Context = {
  loading: boolean,
  setLoading: Dispatch<SetStateAction<boolean>>,
  component: string;
  setComponent: Dispatch<SetStateAction<string>>
};

const initialContext: Context = {
  loading: true,
  setLoading: undefined,
  component: "",
  setComponent: () => { },
};

const LoadingContext = createContext<Context>(initialContext);

const LoadingProvider: FC<any> = ({ children }): JSX.Element => {
  const route = useRouter()
  const [loading, setLoading] = useState(true);
  const [component, setComponent] = useState<string>(initialContext.component);

  return (
    <LoadingContext.Provider value={{ loading, setLoading, component, setComponent }}>
      {loading && <Loading />}
      {children}
    </LoadingContext.Provider>
  );
};

const LoadingContextProvider = () => useContext(LoadingContext)

export { LoadingProvider, LoadingContextProvider };
