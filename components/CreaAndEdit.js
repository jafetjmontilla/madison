
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
    if (initialValues[target.name] !== target.value) {
      console.log("cambio", target.value)
    }
  }
  useEffect(() => {
    if (stage?.action == "creaAndEdit") {
      console.log(stage.payload)
      const varSchema = BodyStaticAPP.filter(elem => elem?.title == component)[0]
      setSchema(varSchema?.schema)
      if (stage?.payload) {
        setInitialValues(stage?.payload)
        setValir(true)
      } else {
        setInitialValues(varSchema?.schema.map(elem => {
          return { [`${elem.accessor}`]: "" }
        }))
        setValir(true)

      }
    }
  }, [stage])

  console.log(1001, initialValues)
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
                  {stage.payload ? "editar registro" : "crear registro"}
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
                      <InputField type={elem.type} label={elem.Header} name={elem.accessor} isSelect={elem?.ref} onBlur={(e) => { handleOnBlur(e.target) }} />
                    </div>
                  )
                })}
              </div>
            </div>
            <div className={`bg-gray-300 flex h-20 items-center ${stage.payload ? "justify-start" : "justify-end"}`}>

              <ButtonBasic
                className={`m-4 ${!stage.payload ? "bg-green-500 hover:bg-green-600 w-36" : "bg-red-500 hover:bg-red-700 w-48 h-6"}`}
                onClick={
                  () => {
                    // setLoading(true)
                    setStage(stage.action == "viewTable" ? { action: "creaAndEdit" } : { action: "viewTable" })
                    toast("success", "result")
                  }
                }
                caption={
                  stage.payload ?
                    <div className="flex gap-2 text-sm"><IconDelete className="w-5 h-5" /> eliminar registro</div>
                    : <div className="flex gap-2"><PlusIcon className="w-6 h-6" /> agregar otro</div>
                }
              />

            </div>
          </div>
        </div>
      </Formik>}
    </>
  );
};

