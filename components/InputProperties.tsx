import { useEffect, useState } from "react"
import { InputSelect } from "./InputSelect"
import { fetchApi, queries } from "../utils/Fetching"
import { useField } from "formik";
import { AppContextProvider } from "../context/AppContext";

export const InputProperties = ({ params, props }) => {
  const { stage, setData, itemSchema } = AppContextProvider()
  const [field, meta, helpers] = useField(props);




  return (
    <div className='w-full flex gap-2'>
      propiedades
    </div>

  )
}