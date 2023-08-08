import { createContext, FC, useState, Dispatch, SetStateAction, useContext } from 'react';

type Context = {
  component: string;
  setComponent: Dispatch<SetStateAction<string>>
};

const initialContext: Context = {
  component: "",
  setComponent: () => { },
};

const LoadingContext = createContext<Context>(initialContext);

const LoadingProvider: FC<any> = ({ children }): JSX.Element => {
  const [component, setComponent] = useState<string>(initialContext.component);



  return (
    <LoadingContext.Provider value={{ component, setComponent }}>
      {children}
    </LoadingContext.Provider>
  );
};

const LoadingContextProvider = () => useContext(LoadingContext)

export { LoadingProvider, LoadingContextProvider };
