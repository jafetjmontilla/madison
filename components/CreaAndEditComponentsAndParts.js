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
import { TextareaNew } from "./InputsProperty/TextareaNew";
import { InputProperties } from "./InputProperties";
import { InputCharacteristics } from "./InputCharacteristics";
import { optionsComponents } from "../utils/schemaElements"
import { nanoid } from "nanoid"
import { IconDelete, IconScrewdriverWrench, IconStateMachine, PlusIcon } from "../icons";
import { CSSTransition } from "react-transition-group";
import { InputComponentsAndParts } from "./InputComponentsAndParts";



const variations = (newArr, oldArr) => {
  const z1 = newArr.filter(elem => oldArr.findIndex(el => el == elem) == -1)
  const z2 = oldArr.filter(elem => newArr.findIndex(el => el == elem) == -1)
  return [...z1, ...z2]
}

export const CreaAndEditComponentsAndParts = ({ params, showAdd, setShowAdd, dataComponentes, setDataComponenentes, setConfirmation }) => {
  const toast = useToast()
  const { stage, setStage, data, setData, barNav, setBarNav } = AppContextProvider()
  const [values, setValues] = useState()
  const [errors, setErrors] = useState()
  const [optionsParts, setOptionsParts] = useState([])
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    if (!isMounted) {
      setIsMounted(true)
    }
    return () => {
      if (isMounted) {
        console.log("desmontando")
        barNav.splice(-1)
        setBarNav([...barNav])
        setIsMounted(false)
      }
    }
  }, [isMounted])

  // useEffect(() => {
  //   fetchApi({
  //     query: queries.getElements,
  //     variables: {
  //       args: { elementID: stage.payload._id, ...values },
  //     },
  //     type: "json"
  //   }).then((results) => {

  //   })
  // }, [])

  useEffect(() => {
    if (isMounted && dataComponentes?.type?.slice(0, -2) === "part") {
      fetchApi({
        query: queries.getVariables,
        variables: {
          args: { type: "parte" }
        }
      }).then(result => {
        const asd = result?.results?.map(elem => { return { value: elem._id, label: elem.title } })
        console.log(asd)
        setOptionsParts(asd)
      })
    }
  }, [isMounted])


  const [initialValues, setInitialValues] = useState({
    title: "",
    tipo: "",
    components1: []
  })

  const validationSchema = yup.object().shape({
    title: yup.string().test((value) => !!value),
    tipo: yup.string().test((value) => !!value),
  });

  const handleOnBlur = async (accesor) => {
    try {
      const keysErrors = Object.keys(errors)
      if (!keysErrors.length && showAdd?.payload?.action === "modificando") {
        const resp = await fetchApi({
          query: queries.updateElements,
          variables: {
            args: {
              _id: values?._id,
              title: values?.title,
              tipo: values?.tipo
            },
          },
          type: "json"
        })
        setDataComponenentes(old => {
          const f1 = old.data.findIndex(elem => elem._id === values._id)
          old.data[f1] = values
          return { ...old }
        })
        setData(old => {
          const f1 = data?.results?.findIndex(elem => elem._id === values._id)
          if (f1 > -1) {
            old.results.splice(f1, 1, values)
          }
          return { ...old }
        })
        console.log("actualizado registro en CreaAndEditComponentsAndParts", values)
        return
      }

      if (!keysErrors.length && showAdd?.payload?.action === "creando") {
        const resp = await fetchApi({
          query: queries.createElements,
          variables: {
            args: {
              title: values?.title,
              tipo: values?.tipo,
              tag: (params?.accessor.slice(0, 3) + nanoid(8)).replace("-", "a").replace("_", "b"),
              typeElement: params?.accessor,
              father: dataComponentes?.father,
            }
          },
          type: "json"
        })
        const newElement = {
          ...resp?.results[0],
          characteristics: [],
          properties: [],
          father: {
            tag: stage?.payload?.tag,
            title: stage?.payload?.title,
            typeElement: stage?.payload?.typeElement,
            _id: stage?.payload?._id,
          }
        }
        barNav.splice(-1, 1, values.title)
        setBarNav([...barNav])
        setShowAdd({ status: true, payload: { action: "modificando", ...newElement }, createNew: true })
        dataComponentes.data.push(newElement)
        setDataComponenentes(dataComponentes)
        if (resp?.results[0].typeElement === stage?.payload?.typeElement) {
          setData(old => {
            old.results.push(newElement)
            return { ...old }
          })
        }
        // console.log("creado registro en CreaAndEditComponentsAndParts", values)
        return
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Formik
      initialValues={showAdd?.payload?._id ? showAdd?.payload : initialValues}
      validationSchema={validationSchema}
    >
      {({ resetForm }) => {
        return (
          <div className="w-full h-full flex rounded-lg m-4 relative " >
            <div className="absolute w-full h-full bg-gray-900 opacity-60 rounded-md -top-4 -left-4" />
            <div className="bg-white rounded-lg z-20 flex flex-col w-full h-[80%] text-sm">
              <div className="bg-gray-300 h-8 flex justify-between rounded-t-lg">
                <div className="w-[35%] h-[100%] flex flex-col  items-start">
                  <span className="ml-4 text-base uppercase font-semibold text-gray-700 ">
                    {`${showAdd?.payload?.action} ${dataComponentes?.type?.slice(0, -1)}`}
                  </span>
                  {/* <span className="ml-4 text-base uppercase font-semibold text-gray-700 -translate-y-2">
                    {`del ${stage?.payload?.tag?.slice(0, 3) !== "com" && stage?.payload?.tag?.slice(0, 3) !== "com" ? stage?.payload?.tag : ""} ${stage?.payload?.title}`}
                  </span> */}
                </div>
                <div className="w-[40%] h-[100%] flex justify-center items-center">
                </div>
                <div className="w-[25%] h-[100%] flex justify-end">
                  <span className="hidden md:flex mr-5 text-2xl text-gray-500 cursor-pointer hover:scale-110" onClick={() => { setShowAdd(false) }}>X</span>
                </div>
              </div>
              <div className="bg-gray-300 flex w-[100%] h-6 px-4 uppercase text-xs">
                / {barNav.toString().replace(/,/g, " / ")} /
              </div>
              <div className="flex-1 overflow-scroll">
                <div className='w-full grid grid-cols-6 gap-2 *border-[1px] *border-gray-300 *rounded-lg px-4'>
                  <AutoSubmitToken setErrors={setErrors} setValues={setValues} setDataComponenentes={setDataComponenentes} />
                  <div className="col-span-4" onBlur={() => { handleOnBlur() }}>
                    <InputNew name="title" label="nombre" />
                  </div>
                  <div className="col-span-2" onBlur={() => { handleOnBlur() }}>
                    <InputSelectNew name={"tipo"} label="tipo" options={
                      dataComponentes?.type?.slice(0, -2) !== "part"
                        ? optionsComponents?.map((elem) => { return { value: elem.title, label: elem.title } })
                        : optionsParts
                    } />
                  </div>
                  <div className="col-span-6">
                    <div>
                      <label className="uppercase text-xs">{"propiedades"}</label>
                      {/* {meta.error && <span className="text-red-500 text-xs ml-2">!requerido</span>} */}
                    </div>
                    <InputProperties params={showAdd?.payload} props={{ name: "properties" }} setDataComponenentes={setDataComponenentes} />
                  </div>
                  <div className="col-span-6">
                    <div>
                      <label className="uppercase text-xs">{"características"}</label>
                      {/* {meta.error && <span className="text-red-500 text-xs ml-2">!requerido</span>} */}
                    </div>
                    <InputCharacteristics params={showAdd?.payload} props={{ name: "characteristiscs" }} setDataComponenentes={setDataComponenentes} />
                  </div>
                  {dataComponentes?.type?.slice(0, -2) !== "part" && <div className="col-span-6">
                    <div>
                      <label className="uppercase text-xs">{"componentes"}</label>
                      {/* {meta.error && <span className="text-red-500 text-xs ml-2">!requerido</span>} */}
                    </div>
                    <InputComponentsAndParts
                      params={{
                        ...showAdd,
                        accessor: "component",
                        Header: "componentes",
                        icon: <IconStateMachine className="w-5 h-5 text-gray-500" />
                      }} />
                  </div>}
                  {dataComponentes?.type?.slice(0, -2) !== "part" && <div className="col-span-6">
                    <div>
                      <label className="uppercase text-xs">{"partes"}</label>
                      {/* {meta.error && <span className="text-red-500 text-xs ml-2">!requerido</span>} */}
                    </div>
                    <InputComponentsAndParts
                      params={{
                        ...showAdd,
                        accessor: "part",
                        Header: "partes",
                        icon: <IconScrewdriverWrench className="w-5 h-5 text-gray-500" />
                      }} />
                  </div>}
                  <div className="col-span-6 flex justify-end items-end">
                  </div>
                </div>
              </div>
              <div className="bg-gray-300 h-12 flex justify-between items-center rounded-b-lg">
                <CSSTransition
                  in={true}
                  //nodeRef={nodeRef}
                  classNames="alert"
                  unmountOnExit
                  onEnter={() => { }} //al comienzo de la transición
                  timeout={300} //tiempo para demontar el componente
                  onExited={() => { }} //al desmontar el componente
                >
                  <div className={`${!showAdd?.payload?._id && "hidden"} flex w-full h-full items-center justify-between`}>
                    <ButtonBasic
                      className={` m-4 ${!true ? "bg-green-500 hover:bg-green-600 w-36" : "bg-red-500 hover:bg-red-700 w-48 h-6"} text-sm`}
                      onClick={() => setConfirmation({ state: true, value: "", elem: showAdd?.payload })}
                      caption={
                        <div className="flex gap-2 text-sm"><IconDelete className="w-5 h-5" /> eliminar registro</div>
                      }
                    />
                    {showAdd?.createNew
                      ? <ButtonBasic
                        className={`m-4 ${!false ? "bg-green-500 hover:bg-green-600 w-36" : "bg-red-500 hover:bg-red-700 w-48 h-6"} text-sm`}
                        onClick={() => {
                          setShowAdd({ status: true, payload: { action: "creando" } })
                          toast("success", "result")
                          resetForm()
                        }}
                        caption={
                          <div className="flex gap-2"><PlusIcon className="w-6 h-6" /> agregar otro</div>
                        }
                      />
                      : <></>
                    }
                  </div>
                </CSSTransition>
              </div>
            </div>
          </div>
        )
      }}
    </Formik>
  )
}

const AutoSubmitToken = ({ setErrors, setValues, setDataComponenentes }) => {
  const { values, errors } = useFormikContext();

  useEffect(() => {
    // console.log(100008, errors)
    setErrors(errors)
  }, [errors]);

  useEffect(() => {
    // console.log(100009, values)
    setValues(values)
  }, [values]);

  return null;
};