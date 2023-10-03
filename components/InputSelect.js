import { useEffect, useRef, useState } from 'react';
import Select from 'react-select'

export const InputSelect = ({ options, defaultValue, onChange, value }) => {
  const [isClearable, setIsClearable] = useState(true);
  const [isSearchable, setIsSearchable] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false)

  //const refSelet = useRef(null)

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
    <Select
      //ref={refSelet}
      onChange={(e) => {
        //setValue(options?.find(elem => elem?.value === value))
        onChange(options?.find(elem => elem?.value === e?.value))
        // setIdxOptions(options.findIndex(elem => elem.value === e?.value))
      }}
      //isOptionSelected={options[1]}
      // placeholder={
      //   "algo"
      // }
      styles={selectStyle}
      value={value}
      defaultValue={defaultValue}
      isDisabled={isDisabled}
      isLoading={isLoading}
      isClearable={isClearable}
      isSearchable={isSearchable}
      options={options}
      classNames={"w-full "}
    />
  )
}