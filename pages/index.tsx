import Image from "next/image";
import { useMounted } from "../hooks/useMounted";
import { useEffect, useState } from "react";
import { AppContextProvider } from "../context/AppContext";
import fondo from "../public/fondo.webp"
import { useRouter } from "next/router";
import FormLogin from "../components/login/FormLogin";
import { AuthContextProvider } from "../context/AuthContext";
import { UserForm, UserIcon } from "../icons";
import { LoadingContextProvider } from "../context/LoadingContext";
import { CSSTransition } from "react-transition-group";


export default function Home() {
  const { loading } = LoadingContextProvider()
  const [showLogin, setShowLogin] = useState(false)
  const [showInicio, setShowInicio] = useState(false)

  const { setComponent } = AppContextProvider()
  const { user } = AuthContextProvider()
  const router = useRouter()
  useEffect(() => {
    setComponent("inicio")
  }, [])

  const handleOnClick = () => {
    console.log("aqui")
    if (!user) {
      setShowLogin(!showLogin)
      return
    }
    setShowInicio(!showInicio)
  }

  useMounted()
  return (
    <div className="bg-blue-300 stick flex w-full h-full items-center justify-center">
      <CSSTransition in={showLogin} classNames="alert" unmountOnExit timeout={300} >
        <div className="w-full h-full absolute z-[7] top-0 left-0 flex items-center justify-center">
          <div className="bg-white flex flex-col p-6 w-[350px] h-[450px] rounded-3xl shadow-lg items-center relative">
            <div onClick={handleOnClick} className="bg-white opacity-70 w-7 h-7 absolute right-[-30px] top-[-30px] rounded-full text-center text-gray-700 font-semibold font-display cursor-pointer">
              X
            </div>
            <UserIcon className="w-20 h-20 text-gray-500" />
            <FormLogin />
          </div>
        </div>
      </CSSTransition>
      <CSSTransition in={showInicio} classNames="alert" unmountOnExit timeout={300} >
        <div className="bg-red-200 flex w-full h-[calc(100%-40px)] md:w-[calc(100%-66px)] md:h-[calc(100%-64px)] z-[5] items-center justify-center absolute *translate-y-[-70px]">
        </div>
      </CSSTransition>

      <CSSTransition in={!showInicio} classNames="fade" unmountOnExit timeout={300} >
        <>
          <div className="w-full h-full absolute z-[6] top-0 left-0 flex items-center justify-center">
            <Image onClick={handleOnClick} width={400} height={400} className="w-60 h-60 2xl:w-80 2xl:h-80 cursor-pointer" alt="4net" src="http://96.126.110.203:5500/madison/logoMadison.png" />
          </div>
          <Image fill sizes="1500" style={{ objectFit: 'cover' }} className="md:full md:h-full" alt="4net" src={fondo} />
        </>
      </CSSTransition>



    </div>
  )
}
