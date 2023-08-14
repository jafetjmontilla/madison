import { createContext, FC, useState, Dispatch, SetStateAction, useContext, useEffect } from 'react';
import { Loading } from "../components/Loading"
import { fetchApi, queries } from '../utils/Fetching';

interface Property {
  _id: string
  tag: string
  type: string
  title: string
  status: boolean
  createdAt: Date
  updatedAt: Date
}

type Context = {
  loading: boolean,
  setLoading: Dispatch<SetStateAction<boolean>>,
  component: string;
  setComponent: Dispatch<SetStateAction<string>>
  properties: Property | undefined
  setProperties: Dispatch<SetStateAction<Property | undefined>>
};

const initialContext: Context = {
  loading: true,
  setLoading: undefined,
  component: "",
  setComponent: () => { },
  properties: undefined,
  setProperties: undefined,
};

const LoadingContext = createContext<Context>(initialContext);

const LoadingProvider: FC<any> = ({ children }): JSX.Element => {
  const [loading, setLoading] = useState(true);
  const [component, setComponent] = useState<string>(initialContext.component);
  const [properties, setProperties] = useState<Property>(undefined);
  const [isMounted, setIsMounted] = useState(false)


  useEffect(() => {
    if (!isMounted) {
      setIsMounted(true)
    }
    return () => {
      setIsMounted(false)
    }
  }, [])

  useEffect(() => {
    if (isMounted) {
      fetchApi({
        query: queries.getProperties,
        variables: {
          args: {},
          sort: {},
          limit: 0,
          skip: 0,
        },
        type: "json"
      }).then((result) => setProperties(result?.results))
    }
  }, [isMounted])


  return (
    <LoadingContext.Provider value={{ loading, setLoading, component, setComponent, properties, setProperties }}>
      {loading && <Loading />}
      {children}
    </LoadingContext.Provider>
  );
};

const LoadingContextProvider = () => useContext(LoadingContext)

export { LoadingProvider, LoadingContextProvider };
