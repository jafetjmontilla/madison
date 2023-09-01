
import { useEffect, useState } from "react";
import { DataTable } from "./DataTable";
import { CreaAndEdit } from "./CreaAndEdit";
import { LoadingContextProvider } from "../context/LoadingContext"
import { fetchApi } from "../utils/Fetching"
import { AppContextProvider } from "../context/AppContext"
import { ButtonBasic } from "./ButtonBasic"
import { CSSTransition } from "react-transition-group";
import { useRouter } from "next/router";
import { IconArrowLeft } from "../icons";

export const TableTag = () => {
  const router = useRouter()
  const { setLoading } = LoadingContextProvider()
  const { slug, setSlug, itemSchema, setItemSchema, stage, setStage, data, setData } = AppContextProvider()
  const [showSelect, setShowSelect] = useState(false)

  const subMenu = itemSchema?.father?.subMenu || itemSchema?.subMenu

  const [isMounted, setIsMounted] = useState(false)
  useEffect(() => {
    if (!isMounted) {
      console.log("montado")
      setIsMounted(true)
    }
    return () => {
      console.log("desmontado")
      setIsMounted(false)
    }
  }, [])

  useEffect(() => {
    if (isMounted) {
      setStage({ action: "viewTable" })
      fetchApi({
        query: itemSchema?.getData,
        variables: {
          args: {},
          sort: {},
          limit: 0,
          skip: 0,
        },
        type: "json"
      }).then(result => setData(result))
    }
  }, [itemSchema, isMounted]);

  const handleClick = async (elem) => {
    setShowSelect(false)
    if (slug !== elem.slug) {
      setSlug(elem.slug)
      setItemSchema({ ...elem, father: itemSchema?.father || itemSchema })
      await router?.push(elem.slug)
    }
  }

  return (
    <div className="bg-blue-200 w-full h-full flex items-center justify-center relative">

      <div className="flex flex-col relative h-[100%] w-[95%] overflow-auto">
        {subMenu &&
          <div className="flex w-full h-11 relative items-center md:items-start ">
            <div onClick={() => { setShowSelect(!showSelect) }} className="bg-white flex px-2 border-2 rounded-lg w-[60%] h-8 md:hidden justify-between items-center">
              <span className="capitalize text-sm">{subMenu?.find(elem => elem.slug === router?.asPath)?.title}</span>
              <IconArrowLeft className="w-6 h-6 text-gray-700" />
            </div>
            <div className={` ${!showSelect ? "hidden" : "flex"} bg-red-500  flex-col md:flex md:flex-row absolute z-10 md:static translate-y-[calc(50%+16px)] md:translate-y-0 w-[calc(60%-40px)] md:w-fit h-fit md:h-10 m-2 md:m-0 shadow-md rounded-b-lg md:rounded-none truncate`}>
              {subMenu?.map((elem, idx) => {
                return (
                  <div key={idx} onClick={() => { handleClick(elem) }} className={`${router?.asPath === elem.slug ? "bg-gray-100" : "bg-gray-300"} flex h-8 md:h-10 items-center md:justify-center cursor-pointer`}>
                    <span className="text-sm capitalize mx-3 my-2"> {elem.title}</span>
                  </div>
                )
              })}
            </div>
            {/* <span>      {slug}</span>
            <span>      {itemSchema?.father?.title}</span> */}
          </div>
        }
        <div className={`w-[100%] ${itemSchema?.father || itemSchema?.subMenu ? "h-[40px]" : "h-[84px]"} flex items-end justify-left mb-2`}>
          {itemSchema?.schema && <ButtonBasic
            className={`${stage.action == "viewTable" ? "bg-green-500 hover:bg-green-600" : "bg-gray-300 hover:bg-gray-500"}`}
            onClick={
              () => {
                // setLoading(true)
                setStage(stage.action == "viewTable" ? { action: "creaAndEdit" } : { action: "viewTable" })
              }
            }
            caption={stage.action == "viewTable" ? "crear registro" : "volver"}
          />}
        </div>
        <div className="bg-gray-100 rounded-lg w-[100%] h-[calc(100%-120px)] overflow-auto">
          <CSSTransition
            in={stage.action == "creaAndEdit"}
            //nodeRef={nodeRef}
            classNames="alert"
            unmountOnExit
            onEnter={() => { }} //al comienzo de la transición
            timeout={300} //tiempo para demontar el componente
            onExited={() => { }} //al desmontar el componente
          >
            <CreaAndEdit />
          </CSSTransition>
          <DataTable data={data} setData={setData} />
        </div>
      </div>
    </div>
  );
};


