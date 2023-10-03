import { useEffect, useState } from "react"
import { InputSelect } from "./InputSelect"
import { fetchApi, queries } from "../utils/Fetching"
import { useField } from "formik";

export const InputDoubleSelect = ({ params, props }) => {
  const [field, meta, helpers] = useField(props);
  const [value, setValue] = useState(params?.options?.find(elem => elem?.value === field?.value?.typeElement))
  const [optiosSecondSelect, setOptiosSecondSelect] = useState()
  const [secondValue, setSecondValue] = useState(optiosSecondSelect?.find(elem => elem?.value === field?.value?._id))
  const [valir, setValir] = useState(false)

  useEffect(() => {
    if (value?.value) {
      fetchApi({
        query: queries.getElements,
        variables: {
          args: { typeElement: value?.value },
          sort: {},
          limit: 0,
          skip: 0,
        },
        type: "json"
      }).then(result => {
        const opt = result?.results?.map(elem => {
          return { value: elem?._id, label: elem.title }
        })
        setOptiosSecondSelect(opt)
        if (valir) {
          setSecondValue([])
        }
        if (!valir) {
          setSecondValue(opt?.find(elem => elem?.value === field?.value?._id))
          setValir(true)
        }
      })
    }
    if (!value?.value) {
      setOptiosSecondSelect(undefined)
      setSecondValue([])
    }
    // if (valir) {
    //   helpers.setValue({
    //     title: undefined,
    //     typeElement: undefined,
    //     _id: undefined,
    //   })
    // }
  }, [value])

  const onChangeHandler = (secondValue) => {
    setSecondValue(secondValue)
    helpers.setValue({
      title: secondValue?.label,
      typeElement: value?.value,
      _id: secondValue?.value
    })
    console.log("actualizazo registro en InputDouvledSelect")
  }
  useEffect(() => {
    console.log(80000, "field", field.value)
  }, [field])

  return (
    <div className='w-full flex gap-2'>
      <div className='w-[50%]'>
        <InputSelect
          value={value}
          options={params?.options}
          onChange={setValue}
        //defaultValue={params?.options && params?.options[params?.options?.findIndex(elem => elem?.value === field?.value?.typeElement)]} 
        />
      </div>
      <div className='w-[50%]'>
        <InputSelect
          value={secondValue}
          options={optiosSecondSelect}
          onChange={onChangeHandler}
        //defaultValue={optiosSecondSelect && optiosSecondSelect[0]} 
        />
      </div>
    </div>

  )
}