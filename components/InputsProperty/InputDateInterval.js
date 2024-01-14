import { useField } from "formik";
import Select from 'react-select'
import { useState } from "react"
import { optionsIntervals } from '../../utils/dictionaries'


export const InputDateInterval = (props) => {
  const [field, meta, helpers] = useField(props);
  const [isClearable, setIsClearable] = useState(true);
  const [isSearchable, setIsSearchable] = useState(true);
  const [isDisabled, setIsDisabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false)

  const classNames = {
    control: (state) => "!rounded-lg !border-gray-300",
    valueContainer: (state) => "",
    input: (state) => {
      document?.getElementById(state.id)?.setAttribute("class", "focus:border-transparent focus:ring-0")
    },
    indicatorSeparator: (state) => "",
    indicatorsContainer: (state) => "",
  }


  return (
    <>
      <div>
        <label className="capitalize text-xs">{props?.label}</label>
        {meta.error && <span className="text-red-500 text-xs ml-2">!requerido</span>}
      </div>
      <div className="grid grid-cols-8 gap-2">
        <input type="date"
          onChange={(e) => {
            helpers?.setValue({ ...field?.value, date: e.target.value })
          }}
          value={field?.value?.date ? field?.value?.date : ""} className={`col-span-2 h-[38px] rounded-lg border-[1px] border-gray-300 text-sm`} />

        <Select
          //ref={refSelet}
          onChange={(e) => {
            //setValue(options?.find(elem => elem?.value === value))
            helpers.setValue(e?.value)
            // setIdxOptions(options.findIndex(elem => elem.value === e?.value))
          }}
          //isOptionSelected={options[1]}
          // placeholder={
          //   "algo"
          // }
          // styles={selectStyle}
          value={field?.value ? optionsIntervals?.find(elem => elem.value === field.value) : ""}
          //defaultValue={defaultValue}
          isDisabled={isDisabled}
          isLoading={isLoading}
          isClearable={isClearable}
          isSearchable={isSearchable}
          options={optionsIntervals}
          classNames={classNames}
        />


        {/* <input type="time"
          onChange={(e) => {
            helpers?.setValue({ ...field?.value, time: e.target.value })
          }}
          value={field?.value?.time ? field?.value?.time : ""} className={`col-span-2 h-[38px] rounded-lg border-[1px] border-gray-300 text-sm `} /> */}
      </div>
    </>
  )
}