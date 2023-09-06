import { createContext, useContext, useState, useEffect } from "react";
import { getAuth, signInWithCustomToken } from 'firebase/auth'
import Cookies from 'js-cookie'

import { firebaseConfig } from "../firebase";
import { fetchApi, queries } from "../utils/Fetching";
import { initializeApp } from "firebase/app";

const initialContext = {
  user: undefined,
  setUser: undefined,
  verificationDone: false,
  setVerificationDone: undefined,
}

type Context = {
  user: any
  setUser: any
  verificationDone: any
  setVerificationDone: any
}

const AuthContext = createContext<Context>(initialContext);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState<any>(initialContext.user);
  const [verificationDone, setVerificationDone] = useState<any>(false);
  const [isMounted, setIsMounted] = useState<any>(false)

  useEffect(() => {
    if (!isMounted) {
      setIsMounted(true)
    }
    return () => {
      setIsMounted(false)
    }
  }, [])


  let resp: any = undefined
  let firebaseClient: any
  useEffect(() => {
    if (isMounted) {
      try {
        firebaseClient = initializeApp(firebaseConfig);
      } catch (error) {
        console.log(90001, error)
      }
    }
  }, [isMounted])

  useEffect(() => {
    try {
      if (isMounted) {
        getAuth().onAuthStateChanged(async (user) => {
          const sessionCookie = Cookies.get("sessionCookie");
          console.info("Verificando cookie");
          //setUser(user)
          if (sessionCookie) {
            console.info("Tengo cookie de sesion");
            if (user) {
              console.info("Tengo user de contexto firebase");
              const asd = await fetchApi({
                query: queries.getUser,
                variables: { args: { uid: user?.uid } },
                development: "madison"
              });
              const moreInfo = asd?.results[0]
              moreInfo && console.info("Tengo datos de la base de datos");
              setUser({ ...user, ...moreInfo });
              console.info("Guardo datos en contexto react");
            } else {
              console.info("NO tengo user de contexto de firebase");
              const { customToken } = await fetchApi({
                query: queries.authStatus,
                variables: { sessionCookie },
                development: "madison"
              });
              console.info("Llamo con mi sessionCookie para traerme customToken");
              console.info("Custom token", customToken)
              customToken && signInWithCustomToken(getAuth(), customToken);
              console.info("Hago sesion con el custom token");
            }
          }
          setTimeout(() => {
            setVerificationDone(true)
          }, 800);
        });
      }
    } catch (error) {
      console.log(90002, error)
    }
  }, [isMounted]);

  return (
    <AuthContext.Provider value={{ user, setUser, verificationDone, setVerificationDone }}>
      {children}
    </AuthContext.Provider>
  );
};

const AuthContextProvider = () => useContext(AuthContext)
export { AuthContextProvider, AuthProvider };
