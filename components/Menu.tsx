import { Dispatch, FC, cloneElement, useEffect, useRef, useState } from "react"
import { BodyStaticAPP } from "../utils/schemas"
import { LoadingContextProvider } from "../context/LoadingContext"
import { useRouter } from "next/router"
import { AppContextProvider } from "../context/AppContext"

interface props {
  showMenu: boolean
  setShowMenu: Dispatch<boolean>
}

export const Menu: FC<props> = ({ setShowMenu }) => {
  const router = useRouter()
  const { setItemSchema, setSlug } = AppContextProvider()

  const [isMounted, setIsMounted] = useState(false)
  useEffect(() => {
    if (!isMounted) {
      setIsMounted(true)
    }
    return () => {
      if (isMounted) { }
    }
  }, [isMounted])

  useEffect(() => {
    if (isMounted) {
      setSlug(router?.asPath)
      const father = BodyStaticAPP.find(elem => elem?.slug === `/${router?.asPath.split("/")[1]}`)
      const item = father?.subMenu?.find(el => el.slug === router?.asPath)
      setItemSchema({ ...item, father: father && father })
    }
  }, [isMounted])

  const menus = {
    top: BodyStaticAPP.filter(elem => elem?.postition !== "bottom"),
    bottom: BodyStaticAPP.filter(elem => elem?.postition === "bottom")
  }
  return (
    <>
      <div className="w-[100%] h-[calc(100%-112px)] md:h-[calc(100%-64px)] flex flex-col md:items-center md:mt-16 justify-between shadow-sm">
        <div className="">
          {menus.top.map((elem, idx) => {
            return (
              <ItemMenu key={idx} elem={elem} setShowMenu={setShowMenu} />
            )
          })}
        </div>
        <div className="mb-10">
          {menus.bottom.map((elem, idx) => {
            return (
              <ItemMenu key={idx} elem={elem} setShowMenu={setShowMenu} />
            )
          })}
        </div>
      </div>
    </>
  )
}
interface propsItemMenu {
  elem: any
  setShowMenu: Dispatch<boolean>
}

////////////////////////////////otro componente
export const ItemMenu: FC<propsItemMenu> = ({ elem, setShowMenu }) => {
  const router = useRouter()
  const { setLoading } = LoadingContextProvider()
  const { itemSchema, setItemSchema, slug, setSlug } = AppContextProvider()

  const handleClick = async (elem, elemFather?) => {
    setShowMenu(!setShowMenu)
    if (slug !== elem.slug) {
      setSlug(elem.slug)
      setItemSchema({ ...elem, father: elemFather && elemFather })
      await router?.push(elem.slug)
    }
  }

  return (
    <>
      {false && <div className="w-full h-20 md:h-60 bg-gray-200" />}
      <div className={`${itemSchema?.father?.slug === elem.slug || slug === elem.slug ? "bg-gray-100" : "bg-none"} group flex flex-col relative ${elem?.slug && "md:cursor-pointer hover:bg-gray-300"} md:rounded-lg md:hover:rounded-r-none`}>
        <div className="flex items-center truncate">
          <div onClick={() => { elem?.slug && handleClick(elem.subMenu ? elem.subMenu[0] : elem, elem.subMenu ? elem : null) }} className="flex py-2 px-4 w-full h-full">
            {elem.icon}
            <span className="md:hidden text-gray-500 uppercase ml-2 text-sm font-bold">
              {elem.title}
            </span>
          </div>
          {elem?.slug &&
            <div className="group-hover:opacity-100 transition-opacity bottom-0 *ml-2 *2xl:ml-5 bg-gray-200 text-md text-gray-600  font-semibold rounded-r-lg hidden md:flex md:flex-col-reverse fixed group-hover:absolute z-0 left-[101%] opacity-0 truncate capitalize shadow-sm">
              <li className={`list-none px-4 py-[12px] hover:bg-gray-300 ${true && "bg-gray-300 hover:text-gray-50"}`} onClick={() => { handleClick(elem) }}>{elem.title}</li>
              <div className="flex flex-col">
                {elem?.subMenu && elem.subMenu.map((el, idx) => {
                  return (
                    <li key={idx} className={`${itemSchema?.slug === el.slug ? "bg-white" : "bg-none"} list-none px-4 py-[12px] *bg-gray-500 hover:bg-gray-300`} onClick={() => { handleClick(el, elem) }}>

                      <div className="flex items-center">
                        <div className="w-4 h-4">
                          {cloneElement(el?.icon, { className: "w-full h-full text-gray-700" })}
                        </div>
                        <span className="capitalize ml-1"> {el.title}</span>
                      </div>
                    </li>
                  )
                })
                }
              </div>
            </div>
          }
        </div>
      </div>
      {!elem?.slug && <div className="w-full border-t-2 border-gray-400 mb-2" />}
    </>
  )
}