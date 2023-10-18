import { FormControlLabel, Radio, RadioGroup } from "@mui/material"
import { useField } from "formik";

export const InputRadioGroup = (props) => {
  const [field, meta, helpers] = useField(props);

  return (
    <>
      <div>
        <label className="capitalize text-xs">{props?.label}</label>
        {meta.error && <span className="text-red-500 text-xs ml-2">!requerido</span>}
      </div>
      <RadioGroup
        aria-labelledby="demo-controlled-radio-buttons-group"
        name="controlled-radio-buttons-group"
        value={field?.value}
        onChange={(e) => {
          helpers?.setValue(e.target.value)
        }}
        className={`h-[38px] rounded-lg border-[1px] border-gray-300 text-sm w-[100%] pl-4`}
        row
      >
        <FormControlLabel value="periódica" control={<Radio size="small" />} label={<span className="text-sm font-display capitalize">periódica</span>} />
        <FormControlLabel value="única" control={<Radio size="small" />} label={<span className="text-sm font-display capitalize">única</span>} />
      </RadioGroup>
    </>
  )
}