import { FC, useState } from "react";
import { UserIcon } from "../icons";
import FormLogin from "./login/FormLogin";
import { CSSTransition } from "react-transition-group";
import { AuthContextProvider } from "../context/AuthContext";
import { useEffect } from "react";


export const Login: FC<any> = ({ setShowLogin }) => {
  const { user, setUser } = AuthContextProvider()
  useEffect(() => {
    if (user?.uid) {
      setShowLogin(false)
    }
  }, [user?.uid])

  return (
    <div className="w-full h-full absolute z-[7] top-0 left-0 flex items-center justify-center">
      <div className="bg-white flex flex-col p-6 w-[90%] md:w-[350px] h-[450px] rounded-3xl shadow-lg items-center relative">
        {/* <div onClick={handleOnClick} className="bg-white opacity-70 w-7 h-7 right-2 top-2 absolute md:right-[-30px] md:top-[-30px] rounded-full text-center text-gray-700 font-semibold font-display cursor-pointer">
            X
          </div> */}
        <UserIcon className="w-20 h-20 text-gray-500" />
        <FormLogin />
      </div>
    </div>
  )
}
