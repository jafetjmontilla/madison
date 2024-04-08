import { useEffect, useState } from "react"
import { fetchApi, queries } from "../utils/Fetching"
import { useField } from "formik";
import { AppContextProvider } from "../context/AppContext";
import { GiBackwardTime } from "react-icons/gi"
import { AiTwotoneEdit, AiTwotoneDelete } from "react-icons/ai"
import { MdOutlineAddCircleOutline } from "react-icons/md"
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io"
import { CreaAndEditProperties } from "./CreaAndEditProperties"
import { useToast } from "../hooks/useToast";
import { TiEye } from "react-icons/ti";

export const InputProperties = ({ params, props, setDataComponenentes, setConfirmation }) => {
  const toast = useToast();
  const { stage, setStage, barNav } = AppContextProvider()
  const [field, meta, helpers] = useField(props);
  const [showAdd, setShowAdd] = useState({ status: false, payload: {} })

  useEffect(() => {
    if (params) {
      helpers.setValue(params?.properties)
    } else {
      helpers.setValue(stage?.payload?.properties)
    }
  }, [stage?.payload])

  const handleDelete = async (elem) => {
    try {
      await fetchApi({
        query: queries.updateProperties,
        variables: {
          args: { elementID: stage.payload._id, ...elem, status: false },
        },
        type: "json"
      }).then(data => {
        if (!setDataComponenentes) {
          const f1 = stage?.payload?.properties?.findIndex(elem => elem?._id === data?._id)
          stage?.payload?.properties?.splice(f1, 1)
          setStage({ ...stage })
        }
        if (setDataComponenentes) {
          setDataComponenentes(old => {
            const f1 = old?.data?.findIndex(elem => elem?._id === params?._id)
            const f2 = old.data[f1].properties.findIndex(elem => elem._id === data?._id)
            old.data[f1].properties.splice(f2, 1)
            return { ...old }
          })
        }
        toast("success", "propiedad eliminada")
      })
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="w-full -mt-1">
      <div className="w-full text-gray-700 capitalize grid grid-cols-12 items-center text-left font-semibold border-b-2 text-xs *py-1">
        <span className="col-span-4">Nombre</span>
        <span className="col-span-2">ejecución</span>
        <span className="col-span-2">medición</span>
        <span className="col-span-3">coordinación</span>
      </div>
      {typeof field?.value === "object" && field?.value?.map((elem, idx) => {
        return (
          <div key={idx} className="w-full">
            < div className={`w-full ${(showAdd.status && showAdd?.payload?._id === elem._id) && "bg-gray-200"} text-gray-700 uppercase grid grid-cols-12 gap-4 items-center py-1`}>
              <div className="col-span-4 gap-2 flex items-center">
                <GiBackwardTime className="w-5 h-5" />
                <span className="truncate flex-1">{elem?.title}</span>
              </div>
              <span className="col-span-2 truncate">{elem?.execution}</span>
              <span className="col-span-2 truncate">{elem?.medition}</span>
              <span className="col-span-3 truncate">{elem?.coordination}</span>
              <div className="col-span-1 w-full h-full relative flex justify-end">
                <div className="flex items-center justify-end gap-1 absolute">
                  <TiEye onClick={() => {
                    (showAdd.status && showAdd?.payload?._id === elem._id && showAdd.action !== "edit")
                      ? setShowAdd({ status: false })
                      : setShowAdd({ status: true, payload: elem, action: "view" })
                  }} className={`w-5 h-5 cursor-pointer ${(showAdd.action === "view" && showAdd?.payload?._id === elem._id) && "text-blue-600"}`} />
                  <AiTwotoneEdit
                    onClick={() => {
                      (showAdd.status && showAdd?.payload?._id === elem._id && showAdd.action !== "view")
                        ? setShowAdd({ status: false })
                        : setShowAdd({ status: true, payload: elem, action: "edit" })
                    }}
                    className={`w-5 h-5 cursor-pointer ${(showAdd.action === "edit" && showAdd?.payload?._id === elem._id) && "text-blue-600"}`} />
                  <AiTwotoneDelete
                    onClick={() => { setConfirmation({ state: true, handleDelete: () => handleDelete(elem) }) }}
                    className="w-5 h-5 cursor-pointer" />
                </div>
              </div>
            </div>
            {(showAdd.status && showAdd?.payload?._id === elem._id) &&
              <div className={`border-2 border-t-0 rounded-b-xl pb-4 mb-4 ${showAdd?.action === "view" && "bg-blue-50"}`}>
                <CreaAndEditProperties father={params} params={elem} showAdd={showAdd} setShowAdd={setShowAdd} setDataComponenentes={setDataComponenentes} />
              </div>
            }
          </div>
        )
      })}
      <div className="w-full text-gray-700 uppercase grid grid-cols-12 gap-4 items-center border-t-2 py-1">
        <div className="col-span-12 gap-2 flex items-center cursor-pointer ml-10"
          onClick={(e) => {
            const rootScroll = document.getElementById("root-scroll")
            const positionScroll = rootScroll.scrollTop
            const desplazar = Math.trunc((e.clientY - 260) / 10) * 10
            rootScroll.scrollTop = positionScroll + desplazar
            if (barNav[barNav.length - 1] !== "...") {
              setShowAdd({ status: showAdd?.payload ? true : !showAdd?.status })
            }
          }}>
          {showAdd?.status && !showAdd?.payload ? <IoIosArrowUp className="w-4 h-4" /> : <IoIosArrowDown className="w-4 h-4" />}
          <span className="">agregar propiedad</span>
          <MdOutlineAddCircleOutline className="w-5 h-5" />
        </div>
      </div>
      {(showAdd?.status && !showAdd?.payload) &&
        <CreaAndEditProperties father={params} setShowAdd={setShowAdd} setDataComponenentes={setDataComponenentes} />
      }
    </div>
  )
}

