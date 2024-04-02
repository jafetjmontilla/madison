import { useEffect, useState } from "react"
import { fetchApi, queries } from "../utils/Fetching"
import { useField } from "formik";
import { AppContextProvider } from "../context/AppContext";
import { GiBookPile } from "react-icons/gi"
import { AiTwotoneDelete } from "react-icons/ai"
import { MdOutlineAddCircleOutline } from "react-icons/md"
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io"
import { useToast } from "../hooks/useToast";
import { InputSelect } from "./InputSelect";
import { IconScrewdriverWrench } from "../icons";


export const InputConsumables = ({ params, props, setConfirmation }) => {
  const toast = useToast();
  const { stage, setStage, barNav } = AppContextProvider()
  const [field, meta, helpers] = useField(props);
  const [showAdd, setShowAdd] = useState({ status: false, payload: {} })
  const [consumables, setConsumables] = useState([])
  const [consumablesOptions, setConsumablesOptions] = useState([])

  useEffect(() => {
    fetchApi({
      query: queries.getElements,
      variables: {
        args: { typeElement: "consumable", father: JSON.stringify({ $eq: null }) },
        sort: { title: 1 }
      },
      type: "json"
    }).then(data => {
      setConsumables(data.results)
    })
  }, [])

  useEffect(() => {
    if (consumables.length) {
      const consumablesOptions = field.value ? consumables.filter(elem => !field.value?.map(elem => elem._id).includes(elem._id)) : consumables
      setConsumablesOptions(consumablesOptions)
    }
  }, [consumables, field?.value])


  const handleAdd = async (value) => {
    try {
      console.log(51515152, field.value, props)
      const consumablesMasters = [...field.value, consumables.find(elem => elem._id === value.value)]
      helpers.setValue(consumablesMasters)
      await fetchApi({
        query: queries.updateElements,
        variables: {
          args: { _id: stage.payload._id, consumablesMasters: consumablesMasters.map(elem => elem._id) },
        },
        type: "json"
      }).then(data => {
        toast("success", "consumable agregada")
      })
    } catch (error) {
      console.log(error)
    }
    setShowAdd({ status: false })
  }

  const handleDelete = async (item) => {
    const f1 = field.value.findIndex(elem => elem._id === item._id)
    field.value.splice(f1, 1)
    const consumablesMasters = [...field.value]
    helpers.setValue(consumablesMasters)
    try {
      await fetchApi({
        query: queries.updateElements,
        variables: {
          args: { _id: stage.payload._id, consumablesMasters: consumablesMasters.map(elem => elem._id) },
        },
        type: "json"
      }).then(data => {
        toast("success", "consumable eliminada")
      })
      setShowAdd(false)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="w-full -mt-1">
      <div className="w-full text-gray-700 capitalize grid grid-cols-12 items-center text-left font-semibold border-b-2 text-xs *py-1">
        <span className="col-span-2">Tipo</span>
        <span className="col-span-2">Código</span>
        <span className="col-span-7">Nonbre</span>
      </div>
      {typeof field?.value === "object" && field?.value?.map((elem, idx) => {
        return (
          <div key={idx} className="w-full">
            < div className={`w-full ${(showAdd.status && showAdd?.payload?._id === elem._id) && "bg-gray-200"} text-gray-700 uppercase grid grid-cols-12 gap-4 items-center py-1`}>
              <div className="col-span-2 gap-2 flex items-center">
                <IconScrewdriverWrench className="w-5 h-5" />
                <span className="truncate flex-1">{elem?.tipo?.title}</span>
              </div>
              <span className="col-span-2 truncate">{elem?.codigo}</span>
              <span className="col-span-7 truncate">{elem?.title}</span>
              <div className="col-span-1 gap-2 flex justify-end">

                <AiTwotoneDelete
                  onClick={() => { setConfirmation({ state: true, handleDelete: () => handleDelete(elem) }) }}
                  className="w-5 h-5 cursor-pointer" />
              </div>
            </div>
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
          <span className="">agregar consumibles</span>
          <MdOutlineAddCircleOutline className="w-5 h-5" />
        </div>
      </div>
      {(showAdd?.status && !showAdd?.payload) &&
        <div className='h-24 flex flex-col w-full px-4'>
          <div>
            <label className="capitalize text-xs">Nombre</label>
            {meta.error && <span className="text-red-500 text-xs ml-2">!requerido</span>}
          </div>
          <InputSelect
            options={consumablesOptions.map(elem => { return { value: elem?._id, label: `${elem.title} ( ${elem.codigo} )` } })}
            onChange={(value) => { handleAdd(value) }}
          />
        </div>
      }
    </div>
  )
}

