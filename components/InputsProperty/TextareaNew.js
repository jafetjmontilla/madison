import { useField } from "formik";
import { useEffect, useRef, useState } from "react";

export const TextareaNew = (props) => {
  const [field, meta, helpers] = useField(props);
  const refInput = useRef()

  const handleChange = (e) => {
    e.target.rows = 1
    let rowT = (refInput?.current.scrollHeight - 16) / 20
    e.target.rows = rowT
    helpers.setValue(e.target.value)
  }

  return (
    <>
      <div>
        <label className="capitalize text-xs">{props?.label}</label>
        {meta.error && <span className="text-red-500 text-xs ml-2">!requerido</span>}
      </div>
      <textarea
        style={{ resize: 'none' }}
        rows={refInput?.current ? (refInput?.current.scrollHeight - 16) / 20 : 1}
        ref={refInput}
        type="text" value={field?.value}
        onChange={(e) => { handleChange(e) }}
        className={`rounded-lg border-[1px] border-gray-300 text-sm w-[100%] uppercase overflow-y-scroll`} />
    </>
  )
}