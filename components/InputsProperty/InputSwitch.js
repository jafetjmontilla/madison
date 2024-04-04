import { useField } from "formik";
import { FormControlLabel, Switch } from "@mui/material";
import { useEffect, useState } from "react";

export const InputSwitch = (props) => {
  const [field, meta, helpers] = useField(props);
  const [valirDefaultChecked, setValirDefaultChecked] = useState(false)

  useEffect(() => {
    if (!valirDefaultChecked) {
      setValirDefaultChecked(true)
    }
  }, [])


  return (
    <>
      <div>
        <br />
        {meta.error && <span className="text-red-500 text-xs ml-2">!requerido</span>}
      </div>
      <div className={`w-full h-[38px] rounded-lg border-[1px] border-gray-300 text-sm p-0 flex justify-center`} >
        <FormControlLabel
          control={
            <Switch defaultChecked={true} value={!valirDefaultChecked && field.value}
              onClick={(e) => { helpers.setValue(e.target._valueTracker.getValue() === "true") }}
            />
          }
          label={<div className="capitalize text-xs font-display">{props.label}</div>} />
      </div>
    </>
  )
}