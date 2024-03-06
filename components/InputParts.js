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


export const InputParts = ({ params, props }) => {
  const toast = useToast();
  const { stage, setStage, barNav } = AppContextProvider()
  const [field, meta, helpers] = useField(props);
  const [showAdd, setShowAdd] = useState({ status: false, payload: {} })
  const [parts, setParts] = useState([])
  const [partsOptions, setPartsOptions] = useState([])

  useEffect(() => {
    fetchApi({
      query: queries.getElements,
      variables: {
        args: { typeElement: "part", father: JSON.stringify({ $eq: null }) },
        sort: { title: 1 }
      },
      type: "json"
    }).then(data => {
      setParts(data.results)
    })
  }, [])

  useEffect(() => {
    console.log({ parts })
  }, [parts])

  useEffect(() => {
    if (parts.length) {
      console.log(10024, parts,)
      console.log(10025, field?.value)
      const partsOptions = parts.filter(elem => !field.value?.map(elem => elem._id).includes(elem._id))
      setPartsOptions(partsOptions)
      console.log(100040, partsOptions)
    }
  }, [parts, field?.value])


  const handleAdd = async (value) => {
    try {
      console.log(10004, value)
      const partsMasters = [...field.value, parts.find(elem => elem._id === value.value)]
      helpers.setValue(partsMasters)
      await fetchApi({
        query: queries.updateElements,
        variables: {
          args: { _id: stage.payload._id, partsMasters: partsMasters.map(elem => elem._id) },
        },
        type: "json"
      }).then(data => {
        toast("success", "parte agregada")
      })
    } catch (error) {
      console.log(error)
    }
    setShowAdd({ status: false })
  }

  const handleDelete = async (item) => {
    const f1 = field.value.findIndex(elem => elem._id === item._id)
    field.value.splice(f1, 1)
    const partsMasters = [...field.value]
    helpers.setValue(partsMasters)
    try {
      await fetchApi({
        query: queries.updateElements,
        variables: {
          args: { _id: stage.payload._id, partsMasters: partsMasters.map(elem => elem._id) },
        },
        type: "json"
      }).then(data => {
        toast("success", "parte eliminada")
      })
      setShowAdd(false)
    } catch (error) {
      console.log(error)
    }
  }



  return (
    <div className="w-full -mt-1">
      <div className="w-full text-gray-700 capitalize grid grid-cols-12 items-center text-left font-semibold border-b-2 text-xs *py-1">
        <span className="col-span-4">Tipo</span>
        <span className="col-span-4">Código</span>
        <span className="col-span-3">Nonbre</span>
      </div>
      {typeof field?.value === "object" && field?.value?.map((elem, idx) => {
        return (
          <div key={idx} className="w-full">
            < div className={`w-full ${(showAdd.status && showAdd?.payload?._id === elem._id) && "bg-gray-200"} text-gray-700 uppercase grid grid-cols-12 gap-4 items-center py-1`}>
              <div className="col-span-4 gap-2 flex items-center">
                <GiBookPile className="w-5 h-5" />
                <span className="truncate flex-1">{elem?.tipo?.title}</span>
              </div>
              <span className="col-span-4 truncate">{elem?.codigo}</span>
              <span className="col-span-3 truncate">{elem?.title}</span>
              <div className="col-span-1 gap-2 flex justify-end">

                <AiTwotoneDelete
                  onClick={() => { handleDelete(elem) }}
                  className="w-5 h-5 cursor-pointer" />
              </div>
            </div>
            {(showAdd.status && showAdd?.payload?._id === elem._id) &&
              <div className="border-2 border-t-0 rounded-b-xl pb-4 mb-4">
                algo
              </div>
            }
          </div>
        )
      })}
      <div className="w-full text-gray-700 uppercase grid grid-cols-12 gap-4 items-center border-t-2 py-1">
        <div className="col-span-12 gap-2 flex items-center cursor-pointer ml-10"
          onClick={() => {
            if (barNav[barNav.length - 1] !== "...") {
              setShowAdd({ status: showAdd?.payload ? true : !showAdd?.status })
            }
          }}>
          {showAdd?.status && !showAdd?.payload ? <IoIosArrowUp className="w-4 h-4" /> : <IoIosArrowDown className="w-4 h-4" />}
          <span className="">agregar partes</span>
          <MdOutlineAddCircleOutline className="w-5 h-5" />
        </div>
      </div>
      {(showAdd?.status && !showAdd?.payload) &&
        <InputSelect
          options={partsOptions.map(elem => { return { value: elem?._id, label: `${elem.codigo} ${elem.title}` } })}
          onChange={(value) => { handleAdd(value) }}
        />
      }
    </div>
  )
}

