import { useEffect, useRef, useState } from "react"
import { fetchApi, queries } from "../utils/Fetching"
import { useField } from "formik";
import { AppContextProvider } from "../context/AppContext";
import { GiBookPile } from "react-icons/gi"
import { AiTwotoneEdit, AiTwotoneDelete } from "react-icons/ai"
import { MdOutlineAddCircleOutline } from "react-icons/md"
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io"
import { CreaAndEditComponentsAndParts } from "./CreaAndEditComponentsAndParts"
import { useToast } from "../hooks/useToast";
import { IconStateMachine } from "../icons";
import { ConfirmationDelete } from "./ConfirmationDelete";



export const InputComponentsAndParts = ({ params }) => {
  const toast = useToast();
  const { stage, setStage, data, setData, setBarNav, barNav } = AppContextProvider()
  const [showAdd, setShowAdd] = useState({ status: false, payload: {} })
  const [values, setValues] = useState([])
  const [dataComponentsAndParts, setDataComponentsAndParts] = useState([])
  const [dataComponentes, setDataComponenentes] = useState({ type: null, data: [] })
  const [isMounted, setIsMounted] = useState(false)
  const [confirmation, setConfirmation] = useState({ show: false, value: false, elem: {} })

  useEffect(() => {
    if (!isMounted) {
      setIsMounted(true)
    }
    return () => {
      if (isMounted) {
        setIsMounted(false)
      }
    }
  }, [isMounted])

  useEffect(() => {
    const rootelement = document.getElementById("rootelement")
    const child = document.getElementById("child")
    if (rootelement) {
      rootelement?.appendChild(child)
    }
  }, [])

  useEffect(() => {
    if (isMounted) {
      if (stage?.payload?._id && params?.payload?.action !== "creando") {
        fetchApi({
          query: queries.getElements,
          variables: {
            args: {
              typeElement: params?.accessor,
              father: params?.payload?._id ? params?.payload?._id : stage?.payload?._id,
            },
            sort: {},
            limit: 0,
            skip: 0,
          },
          type: "json"
        }).then(result => {
          // const opt = result?.results?.map(elem => {
          //   return { value: elem?._id, label: `${elem.tag} · ${elem.title}`, title: elem.title }
          // })
          setDataComponenentes({
            father: params?.payload?._id ? params?.payload?._id : stage?.payload?._id,
            type: params?.accessor === "component" ? "componentes" : "partes",
            data: result?.results
          }
          )
        })
      }
    }
  }, [params, isMounted])

  useEffect(() => {
    setDataComponentsAndParts(dataComponentes?.data)
  }, [dataComponentes])

  const handlerDelete = () => {
    try {
      fetchApi({
        query: queries.updateElements,
        variables: {
          args: { _id: confirmation?.elem?._id, status: false },
        },
        type: "json"
      }).then(data => {
        setData(old => {
          const f1 = old?.results?.findIndex(elem => elem._id === confirmation?.elem?._id)
          old?.results.splice(f1, 1)
          return { ...old }
        })
        setDataComponenentes(old => {
          const f1 = old?.data?.findIndex(elem => elem._id === confirmation?.elem?._id)
          old?.data.splice(f1, 1)
          return { ...old }
        })
        setShowAdd(false)
        toast("success", "eliminada")
      })
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="w-full static -mt-1">
      <div id="child" className="w-full">
        {confirmation.state &&
          <ConfirmationDelete confirmation={confirmation} handlerDelete={handlerDelete} setConfirmation={setConfirmation} email={null} tag={confirmation?.elem?.tag} />
        }
      </div>

      <div className="w-full text-gray-700 capitalize grid grid-cols-12 items-center text-left font-semibold border-b-2 text-xs *py-1">
        <span className="col-span-11">Nombre</span>
      </div>
      {dataComponentsAndParts.map((elem, idx) => {

        return (
          <div key={idx} className="w-full">
            < div className={`w-full ${(showAdd.status && showAdd?.payload?._id === elem._id) && "bg-gray-200"} text-gray-700 uppercase grid grid-cols-12 gap-4 items-center py-1`}>
              <div className="col-span-11 gap-2 flex items-center">
                {params?.icon}
                <span className=" flex-1">{elem?.title}</span>
              </div>
              <div className="col-span-1 gap-2 flex items-center">
                <AiTwotoneEdit
                  onClick={() => {
                    (showAdd.status && showAdd?.payload?._id === elem._id)
                      ? setShowAdd({ status: false })
                      : [setShowAdd({ status: true, payload: { ...elem, action: "modificando" } }),
                      barNav.push(elem?.title),
                      setBarNav([...barNav])
                      ]
                  }}
                  className="w-5 h-5 cursor-pointer" />
                <AiTwotoneDelete
                  onClick={() => { setConfirmation({ state: true, value: "", elem }) }}
                  className="w-5 h-5 cursor-pointer" />
              </div>
            </div>

          </div>
        )
      })}
      <div className="w-full text-gray-700 uppercase grid grid-cols-12 gap-4 items-center border-t-2 py-1">
        <div className="col-span-12 gap-2 flex items-center cursor-pointer ml-10"
          onClick={() => {
            if (barNav[barNav.length - 1] !== "...") {
              barNav.push("...")
              setBarNav([...barNav])
              setShowAdd({ status: showAdd?.payload ? true : !showAdd?.status, payload: { action: "creando" } })
            }
          }}>
          {showAdd?.status && !showAdd?.payload ? <IoIosArrowUp className="w-4 h-4" /> : <IoIosArrowDown className="w-4 h-4" />}
          <span className="">{`agregar ${params?.Header}`}</span>
          <MdOutlineAddCircleOutline className="w-5 h-5" />
        </div>
      </div>
      <div className={`absolute top-0 w-full ${showAdd.status && "h-full"} left-0 `}>
        {showAdd?.status &&
          <CreaAndEditComponentsAndParts params={params} showAdd={showAdd} setShowAdd={setShowAdd} dataComponentes={dataComponentes} setDataComponenentes={setDataComponenentes} setConfirmation={setConfirmation} />
        }
      </div>
    </div>
  )
}

