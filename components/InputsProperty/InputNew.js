import { useField } from "formik";

export const InputNew = (props) => {
  const [field, meta, helpers] = useField(props);

  return (
    <>
      <div>
        <label className="capitalize text-xs">{props?.label}</label>
        {meta.error && <span className="text-red-500 text-xs ml-2">!requerido</span>}
      </div>
      <input type="text" value={field?.value} onChange={(e) => { helpers?.setValue(e.target.value) }} className={`h-[38px] rounded-lg border-[1px] border-gray-300 text-sm w-[100%] uppercase`} />
    </>
  )
}