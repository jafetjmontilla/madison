import { useCallback } from "react";
import { signInWithPopup, UserCredential, signInWithEmailAndPassword, signOut, sendPasswordResetEmail, getAuth } from 'firebase/auth';
import { useRouter } from "next/router";
import Cookies from 'js-cookie';

import { fetchApi, queries } from "./Fetching";
import { useToast } from "../hooks/useToast";
import { LoadingContextProvider } from "../context/LoadingContext";
import { AuthContextProvider } from "../context/AuthContext";
import { AppContextProvider } from "../context/AppContext";

export const useAuthentication = () => {
  const { setLoading } = LoadingContextProvider();
  const { setUser } = AuthContextProvider();
  const { setItemSchema } = AppContextProvider()
  const toast = useToast(3500);
  const router = useRouter();

  const getSessionCookie = useCallback(async (tokenID: any): Promise<string | undefined> => {
    if (tokenID) {
      const authResult: any = await fetchApi({
        query: queries.auth,
        variables: { idToken: tokenID },
        development: "madison"
      });
      if (authResult?.sessionCookie) {
        const { sessionCookie } = authResult;
        // Setear en localStorage token JWT
        Cookies.set("sessionCookie", sessionCookie, { domain: process.env.NEXT_PUBLIC_DIRECTORY ?? "", expires: 7 });
        return sessionCookie
      } else {
        console.warn("No se pudo cargar la cookie de sesión por que hubo un problema")
        throw new Error("No se pudo cargar la cookie de sesión por que hubo un problema")
      }
    } else {
      console.warn("No hay tokenID para pedir la cookie de sesion")
      throw new Error("No hay tokenID para pedir la cookie de sesion")
    }

  }, [])

  const signIn = useCallback(
    async (type: keyof typeof types, payload: any) => {
      const types = {
        provider: async () => {
          try {
            const asdf = await signInWithPopup(getAuth(), payload)

            return asdf
          } catch (error: any) {
            //setLoading(false);
            const er = error.toString().split(".")[0].split(": Error ")[1]
            if (er == "(auth/account-exists-with-different-credential)") {
              toast("error", "El correo asociado a su provedor ya se encuentra registrado en bodasdehoy.com");
            }
          }
        },
        credentials: async () => await signInWithEmailAndPassword(getAuth(), payload.identifier, payload.password)
      };

      // Autenticar con firebase
      try {
        const res: UserCredential | void = await types[type]();
        if (res) {

          // Solicitar datos adicionales del usuario
          const asd = await fetchApi({
            query: queries.getUser,
            variables: { args: { uid: res.user.uid } },
            development: "madison"
          })
          const moreInfo = asd.results[0]

          const rights = moreInfo?.groups.reduce((acc, item) => {
            acc.groups.push(item?.tag)
            acc.permissions.push({ group: item.tag, permissions: item.permissions.map(elem => elem.title) })
            return acc
          }, { groups: [], permissions: [] })
          console.log(rights)

          if (moreInfo?.status && res?.user?.email) {
            const token = (await res?.user?.getIdTokenResult())?.token;
            const sessionCookie = await getSessionCookie(token)
            if (sessionCookie) { }
            // Actualizar estado con los dos datos
            setUser({ ...res.user, ...moreInfo, rights });

            /////// REDIRECIONES ///////
            //setLoading(true)
            // router.push(`${"/"}`)
            // setItemSchema({ slug: "/" })
            ///////////////////////////

          } else {
            toast("error", "aun no está registrado");
            //verificar que firebase me devuelva un correo del usuario
            if (res?.user?.email) {
              //seteo usuario temporal pasar nombre y apellido de firebase a formulario de registro
              //setUserTemp({ ...res.user });
              toast("success", "Seleccione quien eres y luego completa el formulario");
            } else {
              toast("error", "usted debe tener asociado un correo a su cuenta de proveedor");
            }
          }
        }
      } catch (error: any) {
        const errorCode: string = error?.code ? error.code : error?.message
        switch (errorCode) {
          case "auth/too-many-requests":
            toast("error", "usuario o contraseña inválida");
            break;
          case "auth/wrong-password":
            toast("error", "usuario o contraseña inválido");
            break;
          case "auth/invalid-email":
            toast("error", "correo inválido");
            break;
          case "auth/missing-password":
            toast("error", "password inválido");
            break;
          case "user does not exist into events bd":
            toast("error", "debes estar invitado a un evento para poder ingresar");
            break;
          default:
            break;
        }

        console.log("error", error)
        console.log("errorCode", error?.code, "errorMessage", error?.message)
      }
      //setLoading(false);
    },
    [getSessionCookie, router, setLoading, setUser, toast]
  );

  const _signOut = useCallback(async () => {
    Cookies.remove("sessionCookie", { domain: process.env.NEXT_PUBLIC_DIRECTORY ?? "" });
    Cookies.remove("idToken", { domain: process.env.NEXT_PUBLIC_DIRECTORY ?? "" });
    await signOut(getAuth());
    router.push("/")
  }, [router])

  const resetPassword = async (values: any, setShowResetPassword: any) => {// funcion para conectar con con firebase para enviar el correo 
    if (values?.identifier !== "") {
      try {
        //await sendPasswordResetEmail(getAuth(), values?.identifier);
        setShowResetPassword(false)
        toast("success", "Se ha enviado un enlace a tu email")
      } catch (error) {
        toast("error", "Error, email no encontrado")
        console.log(error);
      }
    } else {
      toast("error", "introduce un correo")
    }
  };

  return { signIn, _signOut, getSessionCookie, resetPassword };

};

