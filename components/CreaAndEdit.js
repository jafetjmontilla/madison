
import { useEffect, useRef, useState } from "react";
import { useMounted } from "../hooks/useMounted";
import { LoadingContextProvider } from "../context/LoadingContext";
import { AppContextProvider } from "../context/AppContext";
import { ButtonBasic } from "./ButtonBasic";
import { IconDelete, PlusIcon } from "../icons";
import { useToast } from '../hooks/useToast';
import { CSSTransition } from "react-transition-group";
import { Formik, useFormikContext } from "formik";
import { InputField } from "./InputField";
import * as yup from 'yup'
import { fetchApi } from "../utils/Fetching";
import { tagsGroups } from "../utils/schemaCoordinations";


export const CreaAndEdit = () => {
  const { stage, setStage, setData, itemSchema } = AppContextProvider()
  const toast = useToast()
  const [schema, setSchema] = useState()
  const [dataValues, setDataValues] = useState()
  const [initialValues, setInitialValues] = useState()
  const [requiredValues, setRequiredValues] = useState()
  const [edition] = useState(!!stage?.payload)
  const [values, setValues] = useState()
  const [errors, setErrors] = useState()


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
        //setLoading(false)
      }
    }
  }, [isMounted])

  const handleOnClick = () => {
    setStage({ ...stage, action: "viewTable" })
  }
  const handleOnBlur = async (accesor) => {
    try {
      const keysErrors = Object.keys(errors)
      if (!keysErrors.length && stage?.payload) {
        if (`${dataValues[accesor]}` != values[accesor]) {
          const asd = typeof values[accesor] !== "object" ? null : [...values[accesor]?.map(elem => elem?._id)]
          setData((old) => {
            old.results.splice(stage.dataIndex, 1, { ...old.results[stage.dataIndex], [accesor]: values[accesor] })
            return { ...old, results: old.results }
          })
          await fetchApi({
            query: itemSchema.updateEntry,
            variables: {
              args: {
                _id: stage.payload._id,
                [accesor]: typeof values[accesor] !== "object" ? values[accesor] : [...values[accesor]?.map(elem => elem?._id)],
              },
            },
            type: "json"
          })
          console.log("actualizazo registro en CreaAndEdit", dataValues)
          return
        }
        return
      }

      let valir = true
      Object.entries(requiredValues).forEach(([key, value]) => {
        if (key == accesor && values[accesor] != "") requiredValues[`${key}`] = values[accesor]
        if (!requiredValues[`${key}`]) return valir = false
      });
      if (valir) {
        ///////guarda nuevo registro
        const resp = await fetchApi({
          query: itemSchema.createEntry,
          variables: {
            args: {
              ...requiredValues,
              ...itemSchema?.dataVariables
            },
          },
          type: "json"
        })
        if (resp) {
          setData((old) => {
            old?.results?.splice(0, 0, { ...requiredValues, _id: resp?.results[0]?._id })
            return { total: old.total + 1, results: old?.results }
          })
          setStage({ ...stage, payload: { ...stage.payload, ...requiredValues, _id: resp?.results[0]?._id }, dataIndex: 0 })
          console.log("*guardo nuevo registro", { ...requiredValues, _id: resp?.results[0]?._id })
        }
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handlerDelete = async () => {
    // setLoading(true)
    await fetchApi({
      query: itemSchema.updateEntry,
      variables: {
        args: { _id: stage.payload._id, status: false },
      },
      type: "json"
    })
    setData((old) => {
      old.results.splice(stage.dataIndex, 1)
      return { total: old.total - 1, results: old.results }
    })
    setStage(stage.action == "viewTable" ? { action: "creaAndEdit" } : { action: "viewTable" })
    toast("success", "result")
  }

  useEffect(() => {
    if (stage?.action == "creaAndEdit") {
      const varSchema = itemSchema
      setSchema(varSchema?.schema)
      if (stage?.payload) {
        setDataValues(stage?.payload)
        setValir(true)
      } else {
        const values = varSchema?.schema?.reduce((acc, item) => {
          acc.initialValues = { ...acc.initialValues, [`${item.accessor}`]: "" }
          if (item?.required) acc.requiredValues = { ...acc.requiredValues, [`${item.accessor}`]: null }
          return acc
        }, { initialValues: {}, requiredValues: {} })
        setDataValues(values?.initialValues)
        setInitialValues({ ...values?.initialValues })
        setRequiredValues(values?.requiredValues)
        setValir(true)
      }
    }
  }, [stage])

  const schemaReduce = schema?.reduce((acc, item) => {
    let asd = {}
    if (item.required) {
      asd = {
        [`${item.accessor}`]: yup[`${"string"}`]().test((value) => item.accessor !== "password" ? !!value : !stage?.payload ? !!value : true)
      }
    }
    return { ...acc, ...asd }
  }, {})
  const validationSchema = yup.object().shape(schemaReduce)

  return (
    <>
      {valir && <Formik
        initialValues={initialValues ? initialValues : dataValues}
        validationSchema={validationSchema}

      >
        {({ resetForm }) => {
          return (

            <div className="bg-gray-200 bg-opacity-50 flex items-center justify-center w-[100%] h-[calc(90%-54px)] absolute z-10">

              <AutoSubmitToken setErrors={setErrors} setValues={setValues} />
              <div className="bg-white w-full h-[100%] md:w-[800px] md:h-[105%] md:translate-y-[-20px] rounded-lg shadow-lg truncate">
                <div className="bg-gray-300 flex w-[100%] h-20 ">
                  <div className="w-[25%] h-[100%] flex justify-start items-center">
                    <span className="ml-4 text-xl uppercase font-semibold text-gray-700 ">
                      {edition ? `editar ${itemSchema?.title}` : `crear ${itemSchema?.title}`}
                    </span>
                  </div>
                  <div className="w-[50%] h-[100%] flex justify-center items-center">
                  </div>
                  <div className="w-[25%] h-[100%] flex justify-end">
                    <span className="hidden md:flex mr-5 mt-3 text-2xl text-gray-500 cursor-pointer hover:scale-110" onClick={handleOnClick}>X</span>
                  </div>
                </div>
                <div className="h-[calc(100%-160px)] overflow-y-scroll">
                  <div className="gap-2 grid grid-cols-3 p-4">
                    {schema?.map((elem, idx) => {

                      return (elem.accessor !== "password" && stage.payload) || (!stage.payload) ? (
                        <div key={idx} className={`
                          ${elem?.size == 1 && "col-span-1"} 
                          ${elem?.size == 2 && "col-span-2"} 
                          ${elem?.size == 3 && "col-span-3"} 
                        `}>

                          <InputField elem={elem} name={elem.accessor} isSelect={elem?.ref} onBlur={() => { handleOnBlur(elem.accessor) }} />
                        </div>
                      ) : <></>
                    })}
                  </div>
                </div>
                <div className={`bg-gray-300 flex h-20 items-center justify-between`}>
                  <CSSTransition
                    in={!!stage.payload}
                    //nodeRef={nodeRef}
                    classNames="alert"
                    unmountOnExit
                    onEnter={() => { }} //al comienzo de la transición
                    timeout={300} //tiempo para demontar el componente
                    onExited={() => { }} //al desmontar el componente
                  >
                    <div className={`${!stage.payload && "hidden"} flex w-full h-full items-center justify-between`}>
                      <ButtonBasic
                        className={` m-4 ${!true ? "bg-green-500 hover:bg-green-600 w-36" : "bg-red-500 hover:bg-red-700 w-48 h-6"} text-sm`}
                        onClick={handlerDelete}
                        caption={
                          <div className="flex gap-2 text-sm"><IconDelete className="w-5 h-5" /> eliminar registro</div>
                        }
                      />
                      {initialValues
                        ? <ButtonBasic
                          className={`m-4 ${!false ? "bg-green-500 hover:bg-green-600 w-36" : "bg-red-500 hover:bg-red-700 w-48 h-6"} text-sm`}
                          onClick={() => {
                            setStage({ action: "creaAndEdit" })
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
      </Formik>}
    </>
  );
};

const AutoSubmitToken = ({ setErrors, setValues }) => {
  const { values, errors } = useFormikContext();

  useEffect(() => {
    setErrors(errors)
  }, [errors]);

  useEffect(() => {
    setValues(values)
  }, [values]);

  return null;
};