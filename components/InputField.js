
import React from 'react'
import { Field, useField } from "formik";
import { useEffect, useRef, useState, FC } from "react";
import { BodyStaticAPP } from "../utils/schemas";
import { fetchApi, queries } from '../utils/Fetching';
import { AppContextProvider } from '../context/AppContext';
import { Accordion, AccordionDetails, AccordionSummary, Checkbox, Typography } from '@mui/material';
import { InputSelect } from './InputSelect';
import { InputDoubleSelect } from './inputDoubleSelect';
import { MdExpandLess } from 'react-icons/md'
import { InputProperties } from './InputProperties'
import { InputCharacteristics } from './InputCharacteristics'
import { InputParts } from './InputParts'
import { InputConsumables } from './InputConsumables'
import { InputComponents } from './InputComponents'
import { InputComponentsAndParts } from './InputComponentsAndParts'
import { ConfirmationDelete } from './ConfirmationDelete';

export const InputField = ({ elem: params, isSelect, ...props }) => {
  const refInput = useRef()
  const [rowT, setRowT] = useState()
  const { stage, setData, itemSchema } = AppContextProvider()
  const [field, meta, helpers] = useField(props);
  const [isMounted, setIsMounted] = useState(false)
  const [options, setOptions] = useState()
  const [value, setValue] = useState()
  const [confirmation, setConfirmation] = useState({ state: false, value: false, elem: {}, handleDelete: () => { } })

  useEffect(() => {
    if (!isMounted) {
      setIsMounted(true)
    }
    return () => {
      if (isMounted) {
        document.getElementById(`child-${params?.type}`).remove()
        setIsMounted(false)
      }
    }
  }, [isMounted])

  useEffect(() => {
    const rootelement = document.getElementById("rootelement")
    const child = document.getElementById(`child-${params?.type}`)
    if (rootelement) {
      rootelement?.appendChild(child)
    }
  }, [])

  useEffect(() => {
    if (isMounted) {
      if (["/setup/part", "/setup/consumable", "/setup/component"].includes(itemSchema?.slug) && params?.type == "select") {
        const getTipo = (slug)=> {
          console.log(4500000,slug)
          if (slug === "/setup/component" ) return "componente"
          if (slug === "/setup/part")  return "parte"
          if (slug === "/setup/consumable")  return "consumible"
        }
        const tipo = getTipo(itemSchema?.slug)
        console.log(4500000,tipo)
        fetchApi({
          query: queries.getVariables,
          variables: {
            args: { type: tipo },
            sort: { tag: 1 }
          }
        }).then(result => {
          const asd = result?.results?.map(elem => { return { value: elem._id, label: elem.title } })
          setOptions(asd)
          const qwe = result?.results?.find(elem => elem._id === field.value)
          if (qwe?.length) {
            setValue({ value: qwe?._id, label: qwe?.title })
          }
          params.options = asd
        })
      }
    }
  }, [isMounted])

  useEffect(() => {
    if (!isMounted) {
      if (params.type === "datetime-local") {
        field.value = field?.value?.slice(0, 16)
      }
      if (params.type === "checkbox") {
        if (params?.getOptions) {
          fetchApi({
            query: params?.getOptions,
            variables: {
              args: {},
              sort: { tag: 1 },
              limit: 0,
              skip: 0,
            },
            type: "json"
          }).then(result => {
            const ids = field?.value?.length > 0 ? field?.value?.map(elem => elem?._id) : []
            setOptions(result.results.map(elem => {
              return { ...elem, checked: ids.includes(elem._id) }
            }))
          })
        }
      }
    }
  }, [params, isMounted])

  useEffect(() => {
    if (params?.type === "select") {
      const index = params?.options.findIndex(elem => elem.value === field?.value)
      setValue((params?.options && params?.options[index]) || undefined)
      setOptions(params?.options || [])
    }

    // para revisar probanlemnte eliminar
    if (!!isSelect && isMounted) {
      console.log("para revisar probanlemnte eliminar")
      //table, accessor
      const query = BodyStaticAPP.find(elem => elem.slug == `/${isSelect?.table}`).getData
      fetchApi({
        query: BodyStaticAPP.find(elem => elem.slug == `/${isSelect?.table}`).getData,
        variables: {
          args: {},
          sort: { tag: 1 },
          limit: 0,
          skip: 0,
        },
        type: "json"
      }).then(result => {
        const options = result.results?.map(elem => {
          return { value: elem?.tag, label: elem?.title }
        })
        setOptions(options)
      })
    }
  }, [isMounted])


  useEffect(() => {
    if (field?.name === "_id") {
      helpers.setValue(stage?.payload?._id)
    }
  }, [stage?.payload?._id])

  const onChangeHandler = async (e) => {
    const arr = [...field?.value]
    if (e.target.checked) {
      arr.push({ _id: e?.target?.value, title: e?.target?.name })
    } else {
      const index = arr.findIndex(elem => elem?._id === e?.target?.value)
      delete arr.splice(index, 1)
    }
    helpers.setValue(arr)
  }

  const handleChange = (e) => {
    e.target.rows = 1
    let rowT = (refInput?.current.scrollHeight - 16) / 20
    if (rowT < 5) {
      e.target.rows = rowT
    }
    else {
      e.target.rows = 4
    }
    helpers.setValue(e.target.value)
  }

  return (
    <div className='w-full h-full'>
      <div id={`child-${params?.type}`} className="w-full">
        {confirmation.state &&
          <ConfirmationDelete confirmation={confirmation} setConfirmation={setConfirmation} />
        }
      </div>
      {params.accessor !== "_id" &&
        <div>
          <label className="uppercase text-xs">{params.Header}</label>
          {meta.error && <span className="text-red-500 text-xs ml-2">!requerido</span>}
        </div>
      }
      <div className={`${params?.type !== "id" ? "w-full text-sm *bg-red-500" : "w-[190px] absolute top-[56px] right-0 scale-[65%] md:scale-75 translate-x-8 md:translate-x-6 text-gray-500"}`} {...props}>
        {
          (() => {
            if (["id", "text", "number", "datetime-local", "date"].includes(params?.type)) {
              return (
                <input {...field} type={params?.type} disabled={["id"].includes(params?.type) || (!stage?.payload && !params?.required) || (stage?.payload && params?.readOnly)} className={`h-[38px] rounded-lg border-[1px] border-gray-300 text-sm w-[100%] ${stage?.payload && params?.readOnly && "cursor-not-allowed"} ${!["_id", "email"].includes(params?.accessor) && "uppercase"}`} />
              )
            }

            if (params?.type == "textarea") {
              return (
                <textarea
                  style={{ resize: 'none' }}
                  rows={
                    refInput?.current
                      ? (refInput?.current.scrollHeight - 16) / 20 < 5
                        ? (refInput?.current.scrollHeight - 16) / 20
                        : 4
                      : 1
                  }
                  ref={refInput}
                  {...field} type={params?.type} disabled={["id"].includes(params?.type) || (!stage?.payload && !params?.required) || (stage?.payload && params?.readOnly)} className={`rounded-lg border-[1px] border-gray-300 text-sm w-[100%] ${stage?.payload && params?.readOnly && "cursor-not-allowed"} ${!["_id", "email"].includes(params?.accessor) && "uppercase"} overflow-y-scroll`}
                  onChange={(e) => { handleChange(e) }}
                />
              )
            }

            if (params?.type == "checkbox") {
              return (
                <div className='flex w-full'>
                  <div className='w-full grid md:grid-cols-4 lg:grid-cols-6' >
                    {options?.map((elem, idx) => {
                      return (
                        <label key={idx} className={`text-sm items-center col-span-2 uppercase ${params?.subType === "group" && "flex my-2"} ${!stage?.payload && !params?.required ? "" : "cursor-pointer"}`}>
                          <Checkbox id={idx} value={elem._id} type="checkbox" defaultChecked={elem.checked} name={elem.title} onClick={(e) => onChangeHandler(e)} disabled={!stage?.payload && !params?.required} />
                          {params?.subType === "group"
                            ? <div className='flex flex-col text-xs capitalize'>
                              <span>Tag: {elem?.tag}</span>
                              <span>Grupo: {elem?.title}</span>
                              <span className='font-semibold'>Permisos: {elem?.permissions?.length ? elem?.permissions?.map(el => el?.title).toString().replace(/,/g, " ") : ""}</span>
                            </div>
                            : elem?.title
                          }
                        </label>
                      )
                    })}
                  </div>
                </div>
              )
            }

            if (params?.type == "select") {
              return (
                <InputSelect
                  options={options}
                  // defaultValue={undefined}
                  onChange={(value) => {
                    setValue(value)
                    helpers.setValue(value?.value)
                  }
                  }
                  value={value} />
              )
            }

            if (params?.type == "dobleSelect") {
              return (
                <InputDoubleSelect params={params} props={props} />
              )
            }
            if (params?.type == "properties") {
              return (
                <InputProperties props={props} setConfirmation={setConfirmation} />
              )
            }
            if (params?.type == "characteristics") {
              return (
                <InputCharacteristics props={props} setConfirmation={setConfirmation} />
              )
            }
            if (params?.type == "components") {
              return (
                <InputComponents props={props} params={params} setConfirmation={setConfirmation} />
              )
            }
            if (params?.type == "parts") {
              return (
                <InputParts props={props} params={params} setConfirmation={setConfirmation} />
              )
            }
            if (params?.type == "consumables") {
              return (
                <InputConsumables props={props} params={params} setConfirmation={setConfirmation} />
              )
            }
            if (params?.type == "componentsAndParts") {
              return (
                <InputComponentsAndParts params={params} />
              )
            }
          })()
        }
        {/* {meta.touched && meta.error && <span>{`${elem?.Header} ${meta.error} `}</span>} */}

      </div>
    </div>

  );
}
