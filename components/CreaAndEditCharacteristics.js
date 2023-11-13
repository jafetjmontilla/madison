import { useEffect, useState } from "react"
import { InputSelectNew } from "./InputsProperty/InputSelectNew"
import { fetchApi, queries } from "../utils/Fetching"
import { Formik, useField, useFormikContext } from "formik";
import { AppContextProvider } from "../context/AppContext";
import { schemaCoordinations } from "../utils/schemaCoordinations.js"
import * as yup from 'yup'
import { InputNew } from "./InputsProperty/InputNew";
import { ButtonBasic } from "./ButtonBasic";
import { FaCheck } from "react-icons/fa"
import { useToast } from '../hooks/useToast';

const variations = (newArr, oldArr) => {
  const z1 = newArr.filter(elem => oldArr.findIndex(el => el == elem) == -1)
  const z2 = oldArr.filter(elem => newArr.findIndex(el => el == elem) == -1)
  return [...z1, ...z2]
}

export const CreaAndEditCharacteristics = ({ params, setShowAdd }) => {
  const toast = useToast()
  const { stage, setStage } = AppContextProvider()
  const [values, setValues] = useState()
  const [errors, setErrors] = useState()

  const [initialValues, setInitialValues] = useState({
    coordination: "",
    title: "",
    description: "",
  })

  const validationSchema = yup.object().shape({
    coordination: yup.string().test((value) => !!value),
    title: yup.string().test((value) => !!value),
    description: yup.string().test((value) => !!value),
  });

  const handleSubmit = async () => {
    try {
      if (Object.keys(errors).length === 0) {
        if (!params) {
          const result = await fetchApi({
            query: queries.createCharacteristics,
            variables: {
              args: { elementID: stage.payload._id, ...values },
            },
            type: "json"
          })
          stage?.payload?.characteristics?.push(result?.results[0])
          setStage({ ...stage })
        }
        if (params) {
          const result = await fetchApi({
            query: queries.updateCharacteristics,
            variables: {
              args: { elementID: stage.payload._id, ...values },
            },
            type: "json"
          })
          const f1 = stage?.payload?.characteristics?.findIndex(elem => elem?._id === result?._id)
          stage?.payload?.characteristics?.splice(f1, 1, result)
          setStage({ ...stage })
          toast("success", "0002")
        }
        toast("success", "característica guardada")
        setShowAdd({ status: false })
        return
      }
      toast("error", "faltan campos requeridos");
    } catch (error) {
      console.log(error)
    }
  }

  const optionsCharacteristicsOld = stage.payload.characteristics.map(elem => elem.title)
  const optionsCharacteristics = [
    { title: "funcion", },
    { title: "capacidad", },
    { title: "marca", },
    { title: "modelo", },
    { title: "serial", },
    { title: "ubicacion", },
    { title: "largo (m)", },
    { title: "alto (m)", },
    { title: "ancho (m)", },
    { title: "potencia (hp)", },
    { title: "voltaje nominal (v)", },
    { title: "amperaje (a)", },
    { title: "corriente nominal (a) rpm", },
    { title: "frecuencia (hz)", },
    { title: "rodamiento del.", },
    { title: "rodamiento tra.", },
    { title: "estopera", },
    { title: "lubricante", },
    { title: "peso(kg)", },
    { title: "material", },
    { title: "espesor de lamina", },
    { title: "tipo", },
    { title: "hrs de servicio", },
    { title: "datos adjuntos", },
    { title: "observaciones" },
  ]
  const optionsCharacteristicsNew = variations(optionsCharacteristics.map(elem => elem.title), optionsCharacteristicsOld.filter(elem => elem !== values?.title))

  return (
    <Formik
      initialValues={params ? params : initialValues}
      validationSchema={validationSchema}
    >
      {({ resetForm }) => {
        return (
          <div className='w-full grid grid-cols-6 gap-2 *border-[1px] *border-gray-300 *rounded-lg px-4'>
            <AutoSubmitToken setErrors={setErrors} setValues={setValues} />
            <div className="col-span-4">
              {["equipment", "component", "part"].includes(stage?.payload?.typeElement)
                ? <InputSelectNew name={"title"} label="nombre" options={optionsCharacteristicsNew?.map((elem) => { return { value: elem, label: elem } })} />
                : <InputNew name="title" label="nombre" />}
            </div>
            <div className="col-span-2">
              <InputSelectNew name={"coordination"} label="coordinacion" options={schemaCoordinations?.map((elem) => { return { value: elem.title, label: elem.title } })} />
            </div>
            <div className="col-span-6">
              <InputNew name="description" label="descripcion" />
            </div>
            <div className="col-span-6 flex justify-end items-end">
              <ButtonBasic
                className={`m-4 bg-green-500 hover:bg-green-600 w-48 h-8 text-sm`}
                onClick={handleSubmit}
                caption={
                  <div className="flex gap-2 text-sm">Guardar característica<FaCheck className="w-5 h-5" /></div>
                }
              />
            </div>
          </div>
        )
      }}
    </Formik>
  )
}

const AutoSubmitToken = ({ setErrors, setValues }) => {
  const { values, errors } = useFormikContext();

  useEffect(() => {
    //console.log(100008)
    setErrors(errors)
  }, [errors]);

  useEffect(() => {
    //console.log(100009)
    setValues(values)
  }, [values]);

  return null;
};