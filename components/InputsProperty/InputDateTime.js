import { useField } from "formik";

export const InputDateTime = (props) => {
  const [field, meta, helpers] = useField(props);

  return (
    <>
      <div>
        <label className="capitalize text-xs">{props?.label}</label>
        {meta.error && <span className="text-red-500 text-xs ml-2">!requerido</span>}
      </div>
      <div className="grid grid-cols-8 gap-2">
        <input type="date"
          onChange={(e) => {
            console.log(e.target.value)
            helpers?.setValue({ ...field?.value, date: e.target.value })
          }}
          value={field?.value?.date ? field?.value?.date : ""} className={`col-span-2 h-[38px] rounded-lg border-[1px] border-gray-300 text-sm`} />
        <input type="time"
          onChange={(e) => {
            helpers?.setValue({ ...field?.value, time: e.target.value })
          }}
          value={field?.value?.time ? field?.value?.time : ""} className={`col-span-2 h-[38px] rounded-lg border-[1px] border-gray-300 text-sm `} />
      </div>
    </>
  )
}