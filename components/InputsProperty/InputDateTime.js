import { useField } from "formik";
import { useEffect, useState } from "react";

export const InputDateTime = (props) => {
  const [field, meta, helpers] = useField(props);
  const d = new Date(field.value)
  const [values, setValues] = useState({
    date: `${d.getFullYear()}-${(d.getMonth() + 1) < 10 ? `0${d.getMonth() + 1}` : d.getMonth() + 1}-${d.getDate() < 10 ? `0${d.getDate()}` : d.getDate()}`, time: `${d.getHours() < 10 ? `0${d.getHours()}` : d.getHours()}:${d.getMinutes() < 10 ? `0${d.getMinutes()}` : d.getMinutes()}`
  })
  useEffect(() => {
    //helpers.setValue(values)
    helpers.setValue(new Date(`${values.date}:${values.time}`))
  }, [values])

  return (
    <>
      <div>
        <label className="capitalize text-xs">{props?.label}</label>
        {meta.error && <span className="text-red-500 text-xs ml-2">!requerido</span>}
      </div>
      <div className={`grid gap-2 ${props?.name === "executedAt" ? "grid-cols-5" : "grid-cols-8"}`}>
        <input type="date"
          onChange={(e) => {
            setValues({ ...values, date: e.target.value })
          }}
          value={values?.date ? values?.date : ""} className={`col-span-2 h-[38px] rounded-lg border-[1px] border-gray-300 text-sm`} />
        <input type="time"
          onChange={(e) => {
            setValues({ ...values, time: e.target.value })
          }}
          value={values?.time ? values?.time : ""} className={`col-span-2 h-[38px] rounded-lg border-[1px] border-gray-300 text-sm `} />
      </div>
    </>
  )
}