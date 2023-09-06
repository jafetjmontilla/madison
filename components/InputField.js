
import React from 'react'
import { Field, useField } from "formik";
import { useEffect, useRef, useState } from "react";
import Select from 'react-select'
import { BodyStaticAPP } from "../utils/schemas";
import { fetchApi } from '../utils/Fetching';
import { AppContextProvider } from '../context/AppContext';
import { Checkbox } from '@mui/material';

export const InputField = ({ elem: params, isSelect, ...props }) => {
  const { stage, setData, itemSchema } = AppContextProvider()
  const [field, meta, helpers] = useField(props);
  const [isClearable, setIsClearable] = useState(true);
  const [isSearchable, setIsSearchable] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false)
  const refSelet = useRef(null)
  const [isMounted, setIsMounted] = useState(false)
  const [options, setOptions] = useState()

  useEffect(() => {
    if (!isMounted) {
      setIsMounted(true)
    }
    return () => {
      if (isMounted) {
        setIsMounted(false)
      }
    }
  }, [isMounted])

  useEffect(() => {
    if (!isMounted) {
      if (params.type === "datetime-local") {
        field.value = field?.value?.slice(0, 16)
      }
      if (params.type === "checkbox") {
        fetchApi({
          query: params?.getOptions,
          variables: {
            args: {},
            sort: {},
            limit: 0,
            skip: 0,
          },
          type: "json"
        }).then(result => {
          setOptions(result.results.map(elem => {
            return { ...elem, checked: field?.value?.includes(elem.title) }
          }))
        })
        //console.log(field.value)
      }
    }

  }, [params, isMounted])


  useEffect(() => {
    if (!!isSelect && isMounted) {
      //table, accessor
      const query = BodyStaticAPP.find(elem => elem.slug == `/${isSelect?.table}`).getData
      fetchApi({
        query: BodyStaticAPP.find(elem => elem.slug == `/${isSelect?.table}`).getData,
        variables: {
          args: {},
          sort: {},
          limit: 0,
          skip: 0,
        },
        type: "json"
      }).then(result => {
        const options = result.results?.map(elem => {
          return { value: elem?.tag, label: elem?.title }
        })
        // console.log(options)
        setOptions(options)
      })

    }
  }, [isMounted])

  const selectStyle = {
    control: (provided, state) => ({
      ...provided,
      backgroundColor: 'transparent',
      borderColor: "rgb(209 213 219)",
      cursor: "pointer",
      selected: "none",
      borderRadius: "6px",
      height: '30px',
      minHeight: '30px',
      boxShadow: state.isFocused ? null : null
    }),
    valueContainer: (provided, state) => ({
      ...provided,
      height: '30px',
      padding: '0 4px'
    }),

    input: (provided, state) => ({
      ...provided,
      margin: '0px',
    }),
    indicatorSeparator: state => ({
      display: 'none',
    }),
    indicatorsContainer: (provided, state) => ({
      ...provided,
      height: '30px',
    }),
  }

  useEffect(() => {
    console.log(555111000, "cambio _id", field?.name)
    if (field?.name === "_id") {
      console.log("entro", stage?.payload?._id)
      helpers.setValue(stage?.payload?._id)
    }
  }, [stage?.payload?._id])


  const onChangeHandler = async (e) => {
    const asd = options.map(elem => {
      return elem.title === e.target.name ? { ...elem, checked: e.target.checked } : elem
    })
    setOptions(asd)
    const asdReduce = asd.reduce((acc, item) => {
      if (item.checked) {
        acc.push(item.title)
      }
      return acc
    }, [])
    setData((old) => {
      old.results.splice(stage.dataIndex, 1, { ...old.results[stage.dataIndex], [field.name]: asdReduce })
      return { ...old, results: old.results }
    })
    await fetchApi({
      query: itemSchema.updateEntry,
      variables: {
        args: { _id: stage.payload?._id, [field.name]: asdReduce },
      },
      type: "json"
    })
    console.log("actualizazo registro")
  }

  return (
    <div className='relatiw-full text-xs relative'>
      {
        (() => {

          if (["id", "text", "number", "datetime-local", "date"].includes(params?.type)) {
            return <input {...field}  {...props} type={params?.type} disabled={["id"].includes(params?.type) || (!stage?.payload && !params?.required) || (stage?.payload && params?.readOnly)} className={`h-[30px] rounded-[6px] border-[1px] border-gray-300 text-sm w-[100%] ${stage?.payload && params?.readOnly && "cursor-not-allowed"}`} />
          }

          if (params?.type == "checkbox") {
            return (
              <div className='flex w-full'>
                <div className='w-full grid md:grid-cols-4 lg:grid-cols-6' >
                  {options?.map((elem, idx) => {
                    return (
                      <label key={idx} className={`text-sm uppercase items-center col-span-2 ${!stage?.payload && !params?.required ? "" : "cursor-pointer"}`}>
                        <Checkbox id={idx} type="checkbox" defaultChecked={elem.checked} name={elem.title} onClick={(e) => onChangeHandler(e)} disabled={!stage?.payload && !params?.required} />
                        {elem?.title}
                      </label>
                    )
                  })}
                </div>
              </div>
            )
          }

          if (params?.type == "select") {
            return <div>
              {options && <Select
                ref={refSelet}
                onChange={(e) => {
                  // setIdxOptions(options.findIndex(elem => elem.value === e?.value))
                  // setValue(e?.value)
                }}
                //isOptionSelected={options[1]}
                // placeholder={
                //   "algo"
                // }
                styles={selectStyle}
                defaultValue={() => {
                  //console.log(field)
                  options.find(elem => {
                    return elem?.Header === field.value
                  })
                }}
                isDisabled={isDisabled}
                isLoading={isLoading}
                isClearable={isClearable}
                isSearchable={true}
                options={options}
                classNames={"w-full"}
              />}
            </div>
          }
        })()
      }
      {/* {meta.touched && meta.error && <span>{`${elem?.Header} ${meta.error} `}</span>} */}

    </div>

  );
}
