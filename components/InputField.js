
import React from 'react'
import { useField } from "formik";
import { useEffect, useRef, useState } from "react";
import Select from 'react-select'
import { BodyStaticAPP } from "../utils/schemas";
import { fetchApi } from '../utils/Fetching';
import { AppContextProvider } from '../context/AppContext';

export const InputField = ({ label, isSelect, required, ...props }) => {
  const { stage } = AppContextProvider()
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


  if (props.type === "datetime-local") {
    field.value = field?.value?.slice(0, 16)
  }

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



  return (
    <div className='relatiw-full text-xs relative'>
      {/* <span className='bg-red-500 translate-x-[100px] translate-y-[-24px] absolute'>{!required && "disabled"}</span> */}
      {["id", "text", "number", "datetime-local", "date"].includes(props?.type) &&
        <input {...field}  {...props} disabled={props?.type == "id" || (!stage?.payload && !required)} className="h-[30px] rounded-[6px] border-[1px] border-gray-300 text-sm w-[100%]" />}
      {/* {meta.touched && meta.error && <span>{`${label} ${meta.error} `}</span>} */}
      {props?.type == "select" &&
        <div>
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
                //console.log(elem.label, "||", field.value)
                return elem.label === field.value
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
    </div>

  );
}
