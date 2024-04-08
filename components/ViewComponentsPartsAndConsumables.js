import { useEffect, useState } from "react"
import { fetchApi, queries } from "../utils/Fetching"

export const ViewComponentsPartsAndConsumables = ({ _id }) => {
  const [data, setData] = useState({})

  useEffect(() => {
    fetchApi({
      query: queries.getElements,
      variables: {
        args: { _id },
      },
      type: "json"
    }).then(result => {
      setData(result?.results[0])
    })
  }, [_id])

  return (
    <div className='w-full flex flex-col gap-2 px-4'>
      <label className="text-xs first-letter:capitalize font-medium text-gray-700">Características</label>
      <div className="w-full flex flex-col gap-1 px-4">
        {data?.characteristics?.map((elem, idx) => {
          return (
            <div key={idx} className="text-xs uppercase grid grid-cols-12">
              <span className="col-span-3" >{elem?.title}</span>
              <span className="col-span-2" >{elem?.description}</span>
            </div>
          )
        })}
      </div>
      {data?.typeElement === "component" && <>
        <label className="text-xs first-letter:capitalize font-medium text-gray-700">Partes del componente</label>
        <div className="w-full flex flex-col gap-1  px-4">
          {data?.partsMasters?.map((elem, idx) => {
            return (
              <div key={idx} >
                <div className="text-xs uppercase grid grid-cols-12">
                  <span className="col-span-2 truncate" >{elem?.codigo}</span>
                  <span className="col-span-8" >{elem?.title}</span>
                  <span className="col-span-2" >{elem?.tipo?.title}</span>
                </div>
                <div className="w-full flex flex-col gap-1  px-4">
                  {elem?.characteristics?.map((el, idx) => {
                    return (
                      <div key={idx} className="text-xs uppercase grid grid-cols-12">
                        <span className="col-span-3" >{el?.title}</span>
                        <span className="col-span-2" >{el?.description}</span>
                      </div>
                    )
                  })}
                </div>
              </div>

            )
          })}
        </div>
      </>}
    </div>
  )
}