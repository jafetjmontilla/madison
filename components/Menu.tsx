import { Dispatch, FC, useEffect, useRef } from "react"
import { BodyStaticAPP } from "../utils/schemas"
import { LoadingContextProvider } from "../context/LoadingContext"

interface props {
  showMenu: boolean
  setShowMenu: Dispatch<boolean>
}
console.log(BodyStaticAPP)
export const Menu: FC<props> = ({ showMenu, setShowMenu }) => {
  const { component, setComponent } = LoadingContextProvider()
  return (
    <>
      <div className="w-[100%] h-[calc(100%-112px)] md:h-[calc(100%-64px)] flex flex-col md:items-center md:mt-16">
        {BodyStaticAPP.map((elem, idx) => {
          return (
            <div key={idx} onClick={() => { setComponent(elem.title) }} className={`${component === elem.title ? "bg-white" : ""} group flex relative md:cursor-pointer hover:bg-gray-100 md:rounded-lg`}>
              <div className="m-2 flex items-center ">
                {elem.icon}
                <span className="md:hidden text-gray-500 uppercase ml-2 text-sm font-bold">{elem.title}</span>
                <span className="group-hover:opacity-100 transition-opacity ml-2 2xl:ml-5 bg-gray-800 text-sm text-gray-100 rounded-md hidden md:flex absolute left-[100%] opacity-0 px-2 py-1 truncate capitalize">{elem.title}</span>
              </div>
            </div>
          )
        })}
      </div>

    </>
  )
}