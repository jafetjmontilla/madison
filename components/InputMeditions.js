import { InputSelect } from "./InputSelect"
import { meditions } from "../utils/schemaMeditions"
import { useEffect, useState } from "react"
import { fetchApi, queries } from "../utils/Fetching"

export const InputMeditions = ({ calEvent, setCalEvent }) => {
  const [values, setValues] = useState({ title: "", value: "" })
  const [valir, setValir] = useState(false)

  useEffect(() => {
    if (values?.title && values?.value) {
      setValir(true)
    } else {
      setValir(false)
    }
  }, [values])


  const handleSubmit = () => {
    console.log(calEvent?.property?.father?._id)
    if (valir) {
      fetchApi({
        query: queries.createMeditions,
        variables: {
          args: [{
            title: values?.title,
            value: parseFloat(values?.value),
            element: calEvent?.property?.father?._id,
            father: calEvent.task._id,
          }]
        },
      }).then((result) => {
        console.log(result.results)
        if (!calEvent?.task?.meditions) calEvent.task.meditions = []
        calEvent.task.meditions.push(result.results[0])
        setCalEvent({ ...calEvent })
        setValues({ title: "", value: "" })
      })
    }
  }

  return (
    <div>
      <div className='grid grid-cols-3 space-x-2 px-2'>
        <InputSelect
          options={meditions?.map(elem => { return { value: elem.title, label: elem.title } })}
          isClearable={true}
          onChange={(value) => {
            values.title = meditions?.find(elem => elem?.title === value?.value)?.title
            setValues({ ...values })
          }}
          value={{ value: values?.title, label: values?.title }} />
        <div className="flex items-center">
          <input type="number" value={values?.value}
            onChange={(e) => {
              values.value = (e.target.value)
              setValues({ ...values })
            }}
            className={`h-[38px] rounded-lg border-[1px] border-gray-300 text-sm flex-1 uppercase text-right`} />

          <span className="w-14 text-center text-lg">{meditions?.find(elem => elem?.title === values?.title)?.unit}</span>
        </div>
        {/* <span>{values?.date && values?.date}</span> */}
      </div>
      <div className="space-x-4 text-blue-600 font-medium my-1 px-2">
        <span onClick={handleSubmit} className={`${valir ? "hover:text-blue-800 cursor-pointer font-semibold" : "text-gray-300"}`}>guardar</span>
        <span onClick={() => { setValues({ title: "", value: "" }) }} className={`${valir ? "hover:text-blue-800 cursor-pointer font-semibold" : "text-gray-300"}`}>cancelar</span>
      </div>
    </div>
  )
}