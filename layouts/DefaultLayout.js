import Image from "next/image";
import { cloneElement, useEffect, useState } from "react";
import { IconArrowLeft, IconMenu } from "../icons";
import ClickAwayListener from "react-click-away-listener";
import { Menu } from "../components/Menu";
import { LoadingProvider, LoadingContextProvider } from "../context/LoadingContext";
import { AppProvider } from "../context/AppContext";
import { AppContextProvider } from "../context/AppContext"
import { ToastContextProvider } from "../context/ToastContext";
import dynamic from "next/dynamic";
import { AuthProvider } from "../context/AuthContext";

const DynamicToastProvider = dynamic(() =>
  import("../context/ToastContext").then((mod) => mod.ToastProvider)
);

export const DefaultLayout = ({ children }) => {
  const [innerHeight, setInnerHeight] = useState(0)
  const [innerWidth, setInnerWidth] = useState(0)
  const [showMenu, setShowMenu] = useState(false)
  useEffect(() => {
    setInnerHeight(window.innerHeight)
    setInnerWidth(window.innerWidth)
  }, [])

  useEffect(() => {
    const handleResize = e => {
      setInnerHeight(window.innerHeight)
      setInnerWidth(window.innerWidth)
    }
    window.addEventListener('resize', handleResize)
    return _ => window.removeEventListener('resize', handleResize)
  });

  const transitionLeftOpen = {
    transition: `left 0.4s`,
    left: `0%`,
    height: `${innerHeight}px`
  }
  const transitionLeftClose = {
    transition: "left 0.3s",
    left: `-100%`,
    height: `${innerHeight}px`
  }


  return (
    <>
      <AuthProvider>
        <AppProvider>
          <LoadingProvider >
            <DynamicToastProvider>
              <div className="flex">
                <ClickAwayListener onClickAway={() => { setShowMenu(false) }}>
                  <div className="flex flex-col w-[80%] absolute z-[15] md:relative md:w-[66px]">
                    <div className="*bg-white absolute md:hidden w-[14%] h-10 md:h-16 mx-2 md:mx-6 flex items-center justify-center">
                      <IconMenu className="w-6 h-6" onClick={() => { setShowMenu(true) }} />
                    </div>
                    <div style={innerWidth < 768 ? showMenu ? transitionLeftOpen : transitionLeftClose : { height: `${innerHeight}px` }} className="bg-gray-200 flex flex-col w-[100%] absolute md:relative  shadow-md">
                      <div className="bg-red-100 h-28 md:h-0 ">
                        <IconArrowLeft className="md:hidden w-6 h-6 mt-2 ml-4" onClick={() => { setShowMenu(false) }} />
                      </div>
                      <Menu setShowMenu={setShowMenu} showMenu={showMenu} />
                    </div>
                  </div>
                </ClickAwayListener>
                <div style={{ height: `${innerHeight}px` }} className="flex flex-col w-[100%] md:w-[96%]">
                  <div className="bg-gray-50 w-full h-[40px] md:h-[64px] flex">
                    <div className="ml-14 w-[64%] md:w-[88%] h-10 md:h-16 mx-2 md:mx-6 flex items-center justify-center">
                      <Title />
                    </div>
                    <div className="w-[14%] h-10 md:h-16 mx-2 md:mx-6 flex items-center justify-center">
                      <Image width={"400"} height={"400"} className="w-16 h-8 md:w-18 md:h-14" alt="4net" src="http://96.126.110.203:5500/madison/logoMadison.png" />
                    </div>
                  </div >
                  <div className="w-full h-[calc(100%-40px)] md:h-[calc(100%-64px)]">
                    {children}
                  </div>
                </div >
              </div >
            </DynamicToastProvider>
          </LoadingProvider>
        </AppProvider>
      </AuthProvider>
    </>
  );
};
const Title = () => {
  const { itemSchema } = AppContextProvider()
  return (
    <div className=" flex w-full h-full text-gray-600 px-4 items-center md:items-center">
      {itemSchema?.icon && cloneElement(itemSchema?.icon, { className: "w-9 h-9  md:w-14 md:h-14" })}
      <div className="flex flex-col">
        <span className="uppercase font-bold text-xs md:text-lg mb-[-4px] md:mb-[-8px]">
          {itemSchema?.father ? `${itemSchema?.father?.title}` : itemSchema?.title}
        </span>
        <span className="text-xs md:text-sm">   Breve descripción</span>
      </div>
    </div>
  )
}