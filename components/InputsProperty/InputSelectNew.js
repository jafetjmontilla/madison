import { useField } from 'formik';
import { useEffect, useRef, useState } from 'react';
import Select from 'react-select'

export const InputSelectNew = ({ options, name, label }) => {
  const [field, meta, helpers] = useField(name);

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
        <label className="capitalize text-xs">{label}</label>
        {meta.error && <span className="text-red-500 text-xs ml-2">!requerido</span>}
      </div>
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
        value={field?.value ? options?.find(elem => elem.value === field.value) : ""}
        //defaultValue={defaultValue}
        isDisabled={isDisabled}
        isLoading={isLoading}
        isClearable={isClearable}
        isSearchable={isSearchable}
        options={options}
        classNames={classNames}
        className='uppercase'
      />
    </>
  )
}