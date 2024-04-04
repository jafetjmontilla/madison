import { useEffect, useState } from "react"
import { InputSelectNew } from "./InputsProperty/InputSelectNew"
import { fetchApi, queries } from "../utils/Fetching"
import { Formik, useFormikContext } from "formik";
import { AppContextProvider } from "../context/AppContext";
import { schemaCoordinations } from "../utils/schemaCoordinations.js"
import * as yup from 'yup'
import { InputNew } from "./InputsProperty/InputNew";
import { ButtonBasic } from "./ButtonBasic";
import { FaCheck } from "react-icons/fa"
import { useToast } from '../hooks/useToast';
import { TextareaNew } from "./InputsProperty/TextareaNew";

const variations = (newArr, oldArr) => {
  const z1 = newArr.filter(elem => oldArr.findIndex(el => el == elem) == -1)
  const z2 = oldArr.filter(elem => newArr.findIndex(el => el == elem) == -1)
  return [...z1, ...z2]
}

const optionsCharacteristics = [
  { title: "alto (m)" },
  { title: "amperaje (a)" },
  { title: "amperimetro" },
  { title: "ancho (m)" },
  { title: "capacidad" },
  { title: "conexion" },
  { title: "corriente nominal (a) rpm" },
  { title: "datos adjuntos" },
  { title: "diametro" },
  { title: "espesor de lamina" },
  { title: "estopera" },
  { title: "factor de potencia" },
  { title: "frame" },
  { title: "frecuencia (hz)" },
  { title: "funcion" },
  { title: "hrs de servicio" },
  { title: "ip" },
  { title: "largo (m)" },
  { title: "lubricante" },
  { title: "marca" },
  { title: "material" },
  { title: "modelo" },
  { title: "observaciones" },
  { title: "peso(kg)" },
  { title: "potencia (hp)" },
  { title: "rodamiento del." },
  { title: "rodamiento tra." },
  { title: "rpm" },
  { title: "serial" },
  { title: "tipo" },
  { title: "ubicacion" },
  { title: "voltaje nominal (v)" },
]

export const CreaAndEditCharacteristics = ({ father, params, showAdd, setShowAdd, setDataComponenentes }) => {
  const toast = useToast()
  const { stage, setStage } = AppContextProvider()
  const [values, setValues] = useState()
  const [errors, setErrors] = useState()
  const [optionsCharacteristicsNew, setOptionsCharacteristicsNew] = useState()
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    if (!isMounted) {
      setIsMounted(true)
    }
    return () => {
      if (isMounted) {

      }
    }
  }, [isMounted])

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
          const data = await fetchApi({
            query: queries.createCharacteristics,
            variables: {
              args: {
                elementID: father?._id ? father?._id : stage?.payload?._id,
                ...values
              },
            },
            type: "json"
          })
          if (!setDataComponenentes) {
            stage?.payload?.characteristics?.push(data?.results[0])
            setStage({ ...stage })
          }
          if (setDataComponenentes) {
            setDataComponenentes(old => {
              const f1 = old?.data?.findIndex(elem => elem?._id === father?._id)
              old?.data[f1]?.characteristics?.push(data?.results[0])
              return { ...old }
            })
          }
          setShowAdd({ status: false })

        }



        if (params) {
          delete values?.father
          const data = await fetchApi({
            query: queries.updateCharacteristics,
            variables: {
              args: { elementID: father?._id ? father?._id : stage?.payload?._id, ...values },
            },
            type: "json"
          })
          if (!setDataComponenentes) {
            const f1 = stage?.payload?.characteristics?.findIndex(elem => elem?._id === data?._id)
            stage?.payload?.characteristics?.splice(f1, 1, data)
            setStage({ ...stage })
          }
          if (setDataComponenentes) {
            setDataComponenentes(old => {
              const f1 = old?.data?.findIndex(elem => elem?._id === father?._id)
              const f2 = old.data[f1].characteristics.findIndex(elem => elem._id === data?._id)
              old.data[f1].characteristics.splice(f2, 1, data)
              return { ...old }
            })
          }
          setShowAdd({ status: false, payload: data })
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
  useEffect(() => {
    if (!optionsCharacteristicsNew && values?.title !== undefined) {
      if (stage?.payload?.characteristics?.length) {
        const options = stage.payload.characteristics.map(elem => elem.title)
        const optionsCharacteristicsOld = options.filter(elem => elem !== values?.title)
        const optionsDiferent = variations(optionsCharacteristics.map(elem => elem.title), optionsCharacteristicsOld)
        setOptionsCharacteristicsNew(optionsDiferent)
      }
      else {
        setOptionsCharacteristicsNew(optionsCharacteristics.map(elem => elem.title))
      }
    }
  }, [values?.title])

  useEffect(() => {
    if (isMounted) {
      const div = document.getElementById('formIdCharacteristics')
      if (div) {
        const elements = div.querySelectorAll('input, textarea, span, label')
        elements.forEach((el) => {
          el.readOnly = showAdd?.action === "view"; // Para campos de entrada
          el.disabled = showAdd?.action === "view"; // Para select y botón
          el.style.cursor = showAdd?.action === "view" ? "default" : ""
        });
      }
    }
  }, [showAdd?.action, isMounted])

  return (
    <Formik
      initialValues={params ? params : initialValues}
      validationSchema={validationSchema}
    >
      {({ resetForm }) => {
        return (
          <div id="formIdCharacteristics" className='w-full grid grid-cols-6 gap-2 *border-[1px] *border-gray-300 *rounded-lg px-4'>
            <AutoSubmitToken setErrors={setErrors} setValues={setValues} />
            <div className="col-span-4">
              {["equipment", "component", "part"].includes(stage?.payload?.typeElement)
                ? showAdd?.action === "view"
                  ? <InputNew name="title" label="nombre" />
                  : <InputSelectNew name="title" label="nombre" options={optionsCharacteristicsNew?.map((elem) => { return { value: elem, label: elem } })} />
                : <InputNew name="title" label="nombre" />}
            </div>
            <div className="col-span-2">
              {showAdd?.action === "view"
                ? <InputNew name="coordination" label="coordinacion" />
                : <InputSelectNew name="coordination" label="coordinacion" options={schemaCoordinations?.map((elem) => { return { value: elem.title, label: elem.title } })} />
              }
            </div>
            <div className="col-span-6">
              <TextareaNew name="description" label="descripción" />
            </div>
            <div className={`${showAdd?.action === "view" ? "hidden" : "flex"} col-span-6 justify-end items-end`}>
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