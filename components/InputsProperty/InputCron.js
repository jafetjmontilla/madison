import { useField } from "formik";
import { BsClockHistory } from "react-icons/bs";
import cronstrue from 'cronstrue';
import 'cronstrue/locales/es';
import { useEffect, useState } from "react";

export const InputCron = (props) => {
  const [field, meta, helpers] = useField(props);
  const [value, setValue] = useState(field?.value)
  const [cron, setCron] = useState([""])
  const cronOptions = [
    {
      title: "minutos",
    },
    {
      title: "horas",
    },
    {
      title: "días mes",
    },
    {
      title: "meses",
    },
    {
      title: "días semana",
    }
  ]
  const handleChange = (e, idx) => {
    setValue(old => {
      old.splice(idx, 1, e.target.value)
      return [...old]
    })
  }
  const handleBlur = (e, idx) => {
    if (e.target.value === '') {
      setValue(old => {
        old.splice(idx, 1, '*')
        return [...old]
      })
    }
  }
  useEffect(() => {
    try {
      setCron(cronstrue.toString(`${value[0]} ${value[1]} ${value[2]} ${value[3]} ${value[4]}`, { locale: "es" }))
      helpers.setValue(value)
    } catch (error) {

    }
  }, [value])


  return (
    <>
      <div>
        <label className="capitalize text-xs">{props?.label}</label>
        {meta.error && <span className="text-red-500 text-xs ml-2">!requerido</span>}
      </div>
      <div className="gap-2">
        <div type="date" className={`w-full h-[38px] rounded-lg border-[1px] border-gray-300 text-sm p-0 flex`} >
          <div className="grid grid-cols-5 w-[45%] h-[38px] gap-1 mx-1 leading-3 pt-[2px]">
            {cronOptions.map((elem, idx) => (
              <div key={idx} className="flex flex-col">
                <label className="text-[10px]">{elem?.title}</label>
                <input type="text" className="col-span-1 h-[16px] text-xs border-[1px] border-gray-300" value={value[idx]} onChange={(e) => { handleChange(e, idx) }} onBlur={(e) => { handleBlur(e, idx) }} />
              </div>
            ))}
          </div>
          <div style={{ whiteSpace: "normal" }} className="flex ml-1 w-[55%] items-center bg-gray-200 rounded-l-2xl">
            <BsClockHistory className="ml-1 w-5 h-5" />
            <p style={{}} className="w-full max-h-8 *overflow-auto text-[12px] leading-4 pl-2 line-clamp-2">{cron}</p>
          </div>
        </div>
      </div>
    </>
  )
}