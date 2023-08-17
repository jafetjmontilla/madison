import { createContext, FC, useState, Dispatch, SetStateAction, useContext, useEffect } from 'react';
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

interface Stage {
  action: string,
  payload: any
}

type Context = {
  component: string;
  setComponent: Dispatch<SetStateAction<string>>
  properties: Property | undefined
  setProperties: Dispatch<SetStateAction<Property | undefined>>
  stage: Stage
  setStage: Dispatch<SetStateAction<Stage>>
};

const initialContext: Context = {
  component: "",
  setComponent: () => { },
  properties: undefined,
  setProperties: undefined,
  stage: { action: "viewTable", payload: {} },
  setStage: () => { return { stage: "viewTable", payload: {} } },
};

const AppContext = createContext<Context>(initialContext);

const AppProvider: FC<any> = ({ children }): JSX.Element => {
  const [component, setComponent] = useState<string>(initialContext.component);
  const [properties, setProperties] = useState<Property>(undefined);
  const [isMounted, setIsMounted] = useState(false)
  const [stage, setStage] = useState({ action: "viewTable", payload: {} })


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
    <AppContext.Provider value={{ component, setComponent, properties, setProperties, stage, setStage }}>
      {children}
    </AppContext.Provider>
  );
};

const AppContextProvider = () => useContext(AppContext)

export { AppProvider, AppContextProvider };
