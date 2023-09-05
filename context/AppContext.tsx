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
  slug: string;
  setSlug: Dispatch<SetStateAction<string>>
  itemSchema: any;
  setItemSchema: Dispatch<SetStateAction<any>>
  variables: Property | undefined
  setVariables: Dispatch<SetStateAction<Property | undefined>>
  stage: Stage
  setStage: Dispatch<SetStateAction<Stage>>
  data: Data
  setData: Dispatch<SetStateAction<Data>>
};

const initialContext: Context = {
  slug: "",
  setSlug: () => { },
  itemSchema: undefined,
  setItemSchema: () => { },
  variables: undefined,
  setVariables: undefined,
  stage: { action: "viewTable", payload: {}, dataIndex: 0 },
  setStage: () => { return { stage: "viewTable", payload: {} } },
  data: { total: 0, results: [] },
  setData: () => { return { total: 0, results: [] } },
};

const AppContext = createContext<Context>(initialContext);

const AppProvider: FC<any> = ({ children }): JSX.Element => {
  const [slug, setSlug] = useState<string>(initialContext.slug);
  const [itemSchema, setItemSchema] = useState<any>(initialContext.itemSchema);
  const [variables, setVariables] = useState<Property>(undefined);
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
        query: queries.getVariables,
        variables: {
          args: {},
          sort: {},
          limit: 0,
          skip: 0,
        },
        type: "json"
      }).then((result) => setVariables(result?.results))
    }
  }, [isMounted])


  return (
    <AppContext.Provider value={{ slug: slug, setSlug: setSlug, itemSchema: itemSchema, setItemSchema: setItemSchema, variables, setVariables, stage, setStage, data, setData }}>
      {children}
    </AppContext.Provider>
  );
};

const AppContextProvider = () => useContext(AppContext)

export { AppProvider, AppContextProvider };
