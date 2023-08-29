import { Dispatch, FC, useEffect, useRef } from "react"
import { BodyStaticAPP } from "../utils/schemas"
import { LoadingContextProvider } from "../context/LoadingContext"
import { useRouter } from "next/router"
import { AppContextProvider } from "../context/AppContext"

interface props {
  showMenu: boolean
  setShowMenu: Dispatch<boolean>
}
export const Menu: FC<props> = ({ showMenu, setShowMenu }) => {
  const { setLoading } = LoadingContextProvider()
  const { component, setComponent, } = AppContextProvider()
  const route = useRouter()

  const handleClick = async (elem) => {
    setShowMenu(false)
    if (component !== elem.title) {
      elem?.route != route && setLoading(true)
      setComponent(elem.title)
      await route?.push(elem.slug)
    }
  }

  return (
    <>
      <div className="w-[100%] h-[calc(100%-112px)] md:h-[calc(100%-64px)] flex flex-col md:items-center md:mt-16">
        {BodyStaticAPP.map((elem, idx) => {
          return (
            <div key={idx}>
              {!elem?.slug && <div className="w-full h-20 md:h-60 bg-gray-200" />}
              <div onClick={() => { elem?.slug && handleClick(elem) }} className={`${component === elem.title ? "bg-white" : ""} group flex flex-col relative ${elem?.slug && "md:cursor-pointer hover:bg-gray-100"} md:rounded-lg`}>
                <div className="m-2 flex items-center truncate">
                  {elem.icon}
                  <span className="md:hidden text-gray-500 uppercase ml-2 text-sm font-bold">{elem.title}</span>
                  {elem?.slug && <span className="group-hover:opacity-100 transition-opacity ml-2 2xl:ml-5 bg-gray-800 text-sm text-gray-100 rounded-md hidden md:flex fixed group-hover:absolute left-[100%] opacity-0 px-2 py-1 truncate capitalize">{elem.title}</span>}
                </div>
              </div>
              {!elem?.slug && <div className="w-full border-t-2 border-gray-400 mb-2" />}
            </div>
          )
        })}
      </div>
    </>
  )
}