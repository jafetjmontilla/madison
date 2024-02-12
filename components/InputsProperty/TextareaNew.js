import { useField } from "formik";
import { Textarea } from "../Textarea"

export const TextareaNew = (props) => {
  const [field, meta, helpers] = useField(props);

  return (
    <Textarea value={field?.value} meta={meta} setValue={helpers?.setValue} />
  )
}