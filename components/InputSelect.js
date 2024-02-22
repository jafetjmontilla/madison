import { useEffect, useRef, useState } from 'react';
import Select from 'react-select'
import { AppContextProvider } from '../context/AppContext';
import { fetchApi, queries } from '../utils/Fetching';

export const InputSelect = ({ options, onChange, value, isClearable = true }) => {


  const [isSearchable, setIsSearchable] = useState(true);
  const [isDisabled, setIsDisabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false)

  const classNames = {
    control: (state) => "!rounded-lg !border-gray-300",
    valueContainer: (state) => "",
    input: (state) => {
      document?.getElementById(state.id)?.setAttribute("class", "bg-red-500 focus:border-transparent focus:ring-0")
    },
    indicatorSeparator: (state) => "",
    indicatorsContainer: (state) => "",
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
      // styles={selectStyle}
      value={value}
      //defaultValue={defaultValue}
      isDisabled={isDisabled}
      isLoading={isLoading}
      isClearable={isClearable}
      isSearchable={isSearchable}
      options={options}
      classNames={classNames}
      className='uppercase'
    />
  )
}