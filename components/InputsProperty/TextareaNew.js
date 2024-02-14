import { useField } from "formik";
import { Textarea } from "../Textarea"

export const TextareaNew = (props) => {
  const [field, meta, helpers] = useField(props);

  return (
    <>
      <div>
        <label className="capitalize text-xs">{props?.label}</label>
        {meta.error && <span className="text-red-500 text-xs ml-2">!requerido</span>}
      </div>
      <Textarea value={field?.value} meta={meta} setValue={helpers?.setValue} />
    </>
  )
}