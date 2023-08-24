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
  dataIndex: number
}

interface Data {
  total: number,
  results: any[]
}

type Context = {
  component: string;
  setComponent: Dispatch<SetStateAction<string>>
  properties: Property | undefined
  setProperties: Dispatch<SetStateAction<Property | undefined>>
  stage: Stage
  setStage: Dispatch<SetStateAction<Stage>>
  data: Data
  setData: Dispatch<SetStateAction<Data>>
};

const initialContext: Context = {
  component: "",
  setComponent: () => { },
  properties: undefined,
  setProperties: undefined,
  stage: { action: "viewTable", payload: {}, dataIndex: 0 },
  setStage: () => { return { stage: "viewTable", payload: {} } },
  data: { total: 0, results: [] },
  setData: () => { return { total: 0, results: [] } },
};

const AppContext = createContext<Context>(initialContext);

const AppProvider: FC<any> = ({ children }): JSX.Element => {
  const [component, setComponent] = useState<string>(initialContext.component);
  const [properties, setProperties] = useState<Property>(undefined);
  const [isMounted, setIsMounted] = useState(false)
  const [stage, setStage] = useState({ action: "viewTable", payload: {}, dataIndex: 0 })
  const [data, setData] = useState({ total: 0, results: [] })


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
    <AppContext.Provider value={{ component, setComponent, properties, setProperties, stage, setStage, data, setData }}>
      {children}
    </AppContext.Provider>
  );
};

const AppContextProvider = () => useContext(AppContext)

export { AppProvider, AppContextProvider };
