import { createContext, FC, useState, Dispatch, SetStateAction, useContext, useEffect } from 'react';
import { Loading } from "../components/Loading"
import { CSSTransition } from "react-transition-group";


type Context = {
  loading: boolean,
  setLoading: Dispatch<SetStateAction<boolean>>,
};

const initialContext: Context = {
  loading: true,
  setLoading: undefined,

};

const LoadingContext = createContext<Context>(initialContext);

const LoadingProvider: FC<any> = ({ children }): JSX.Element => {
  const [loading, setLoading] = useState(true);
  const [valir, setValir] = useState(true);

  useEffect(() => {
    if (loading) {
      setValir(false)
      setTimeout(() => {
        setValir(true)
      }, 800);
    }
  }, [loading])


  return (
    <LoadingContext.Provider value={{ loading, setLoading }}>
      <CSSTransition
        in={loading ? true : !valir}
        classNames="fadeLoadin"
        unmountOnExit
        onEnter={() => { }} //al comienzo de la transición
        timeout={300} //tiempo para demontar el componente
        onExited={() => { }} //al desmontar el componente
      >
        <Loading />
      </CSSTransition>
      {children}
    </LoadingContext.Provider>
  );
};

const LoadingContextProvider = () => useContext(LoadingContext)

export { LoadingProvider, LoadingContextProvider };
