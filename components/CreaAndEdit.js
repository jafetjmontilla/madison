
import { useEffect, useRef, useState } from "react";
import MUIDataTable from "mui-datatables";
import { useMounted } from "../hooks/useMounted";
import { LoadingContextProvider } from "../context/LoadingContext";
import { AppContextProvider } from "../context/AppContext";
import { ButtonBasic } from "./ButtonBasic";
import { IconDelete, PlusIcon } from "../icons";
import { useToast } from '../hooks/useToast';
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { BodyStaticAPP } from "../utils/schemas";
import { Formik } from "formik";
import { InputField } from "./InputField";
import * as yup from 'yup'


export const CreaAndEdit = () => {
  const nodeRef = useRef(null);
  const { stage, setStage, component, properties } = AppContextProvider()
  const toast = useToast()
  const [schema, setSchema] = useState()
  const [initialValues, setInitialValues] = useState()
  const [requiredValues, setRequiredValues] = useState()
  const [edition] = useState(!!stage?.payload)



  const { setLoading } = LoadingContextProvider()
  const [isMounted, setIsMounted] = useState(false)
  const [valir, setValir] = useState(false)
  useMounted()
  useEffect(() => {
    if (!isMounted) {
      setIsMounted(true)
    }
    return () => {
      if (isMounted) {
        setLoading(false)
      }
    }
  }, [isMounted])

  const handleOnClick = () => {
    setStage({ ...stage, action: "viewTable" })
  }
  const handleOnBlur = (target) => {
    const qwe = { ...target }
    if (qwe.value == "") target.value = null
    if (!target.value && schema.find(elem => elem.accessor == target.name).required) {
      toast("error", "este campo es requerido")
      document.getElementById(target.name).focus();
      return
    }
    if (`${initialValues[target.name]}` != target.value) {
      console.log("cambio")
      if (stage?.payload) {
        initialValues[target.name] = target.value
        console.log("actualizazo registro")
        return
      }
      let valir = true
      Object.entries(requiredValues).forEach(([key, value]) => {
        if (key == target.name && target.value != "") requiredValues[`${key}`] = target.value
        if (!requiredValues[`${key}`]) return valir = false

        //if (!value) return false
      });
      if (valir) {
        setStage({ ...stage, payload: { ...stage.payload, ...requiredValues } })
        console.log("guardo nuevo registro", requiredValues)
      }
    }
  }
  useEffect(() => {
    if (stage?.action == "creaAndEdit") {
      const varSchema = BodyStaticAPP.filter(elem => elem?.title == component)[0]
      setSchema(varSchema?.schema)
      if (stage?.payload) {
        setInitialValues(stage?.payload)
        setValir(true)
      } else {
        const values = varSchema?.schema.reduce((acc, item) => {
          acc.initialValues = { ...acc.initialValues, [`${item.accessor}`]: null }
          if (item?.required) acc.requiredValues = { ...acc.requiredValues, [`${item.accessor}`]: null }
          return acc
        }, { initialValues: {}, requiredValues: {} })
        setInitialValues(values.initialValues)
        setRequiredValues(values.requiredValues)
        setValir(true)
      }
    }
  }, [stage])

  const validationSchema = yup.object().shape({
    _id: yup[`${"string"}`]().required("msgAuto_id"),
    title: yup.number().integer("msgAuto_title"),
  })

  return (
    <>
      {valir && <Formik
        // onSubmit={onSubmit}

        initialValues={initialValues}
        validationSchema={validationSchema}
      //innerRef={ref}
      >
        <div className="bg-gray-200 bg-opacity-50 flex items-center justify-center w-[100%] h-[90%] absolute z-10">
          <div className="bg-white w-full h-[100%] md:w-4/5 md:h-5/6 rounded-lg shadow-lg truncate">
            <div className="bg-gray-300 flex w-[100%] h-20 ">
              <div className="w-[25%] h-[100%] flex justify-start items-center">
                <span className="ml-4 text-xl uppercase font-semibold text-gray-700 ">
                  {edition ? "editar registro" : "crear registro"}
                </span>
              </div>
              <div className="w-[50%] h-[100%] flex justify-center items-center">
              </div>
              <div className="w-[25%] h-[100%] flex justify-end">
                <span className="hidden md:flex mr-5 mt-3 text-2xl text-gray-500 cursor-pointer hover:scale-110" onClick={handleOnClick}>X</span>
              </div>
            </div>
            <div className="h-[calc(100%-160px)] overflow-auto">
              <div className="gap-2 grid grid-cols-3 p-4">
                {schema?.map((elem, idx) => {
                  return (
                    <div key={idx} className={`
                    ${elem?.size == 1 && "col-span-1"} 
                    ${elem?.size == 2 && "col-span-2"} 
                    ${elem?.size == 3 && "col-span-3"} 
                  `}>
                      <label className="uppercase text-xs">{elem.Header}</label>
                      <InputField type={elem.type} label={elem.Header} name={elem.accessor} id={elem.accessor} isSelect={elem?.ref} required={elem?.required} onBlur={(e,) => { handleOnBlur(e.target) }} />
                    </div>
                  )
                })}
              </div>
            </div>
            {/* <div className={`bg-gray-300 flex h-20 items-center ${edition ? "justify-start" : "justify-end"}`}>

              <ButtonBasic
                className={`m-4 ${!edition ? "bg-green-500 hover:bg-green-600 w-36" : "bg-red-500 hover:bg-red-700 w-48 h-6"}`}
                onClick={
                  () => {
                    // setLoading(true)
                    setStage(stage.action == "viewTable" ? { action: "creaAndEdit" } : { action: "viewTable" })
                    toast("success", "result")
                  }
                }
                caption={
                  edition ?
                    <div className="flex gap-2 text-sm"><IconDelete className="w-5 h-5" /> eliminar registro</div>
                    : <div className="flex gap-2"><PlusIcon className="w-6 h-6" /> agregar otro</div>
                }
              />

            </div> */}
            <div className={`bg-gray-300 flex h-20 items-center justify-between`}>
              <CSSTransition
                in={stage.payload}
                //nodeRef={nodeRef}
                classNames="alert"
                unmountOnExit
                onEnter={() => { }} //al comienzo de la transición
                timeout={300} //tiempo para demontar el componente
                onExited={() => { }} //al desmontar el componente
              >
                <div className={`${!stage.payload && "hidden"} flex w-full h-full items-center justify-between`}>
                  <ButtonBasic
                    className={` m-4 ${!true ? "bg-green-500 hover:bg-green-600 w-36" : "bg-red-500 hover:bg-red-700 w-48 h-6"}`}
                    onClick={
                      () => {
                        // setLoading(true)
                        setStage(stage.action == "viewTable" ? { action: "creaAndEdit" } : { action: "viewTable" })
                        toast("success", "result")
                      }
                    }
                    caption={
                      true ?
                        <div className="flex gap-2 text-sm"><IconDelete className="w-5 h-5" /> eliminar registro</div>
                        : <div className="flex gap-2"><PlusIcon className="w-6 h-6" /> agregar otro</div>
                    }
                  />
                  <ButtonBasic
                    className={`m-4 ${!false ? "bg-green-500 hover:bg-green-600 w-36" : "bg-red-500 hover:bg-red-700 w-48 h-6"}`}
                    onClick={
                      () => {
                        // setLoading(true)
                        setStage(stage.action == "viewTable" ? { action: "creaAndEdit" } : { action: "viewTable" })
                        toast("success", "result")
                      }
                    }
                    caption={
                      false ?
                        <div className="flex gap-2 text-sm"><IconDelete className="w-5 h-5" /> eliminar registro</div>
                        : <div className="flex gap-2"><PlusIcon className="w-6 h-6" /> agregar otro</div>
                    }
                  />
                </div>
              </CSSTransition>

            </div>
          </div>
        </div>
      </Formik>}
    </>
  );
};

