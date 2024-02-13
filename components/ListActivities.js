import { InputSelect } from "./InputSelect"
import { meditions } from "../utils/schemaMeditions"
import { useEffect, useState } from "react"
import { AuthContextProvider } from "../context/AuthContext"
import { goToTheTnd } from "./CalendarCompont"
import { Textarea } from "./Textarea"
import { AiTwotoneDelete } from "react-icons/ai"
import { fetchApi, queries } from "../utils/Fetching"

export const ListActivities = ({ calEvent, setCalEvent, item, setConfirmation }) => {
  const { user } = AuthContextProvider()
  const [values, setValues] = useState({ value: "" })
  const [showUser, setShowUser] = useState(false)

  const handleDelete = () => {
    fetchApi({
      query: queries.updateTasks,
      variables: {
        args: {
          _id: calEvent?.task?._id,
          activity: { _id: item._id }
        }
      }
    }).then((result) => {
      const f1 = calEvent.task.activities.findIndex(elem => elem._id === item._id)
      calEvent?.task?.activities?.splice(f1, 1)
      setCalEvent({ ...calEvent })
    })
  }

  return (
    <div className={`flex flex-col w-full px-2 py-1 border-t-[1px] hover:bg-gray-100 relative`}>
      {showUser && <div className="absolute z-50 flex w-64 h-16 bg-white shadow-lg rounded-md border-2 px-2 space-x-2 items-center -translate-y-full">
        <div
          className='bg-gray-300 w-10 h-10 rounded-full flex items-center justify-center text-2xl'>
          <span>
            {item?.user?.name.split(" ").map(e => e.slice(0, 1)).join("")}
          </span>
        </div>
        <div className="w-[calc(100%-50px)]">
          <div className="flex w-full flex-col text-[11px] -space-y-1.5">
            <span className="truncate">{item?.user?.name} </span>
            <span className="truncate">{item?.user?.email}</span>
            <span className="truncate">{item?.user?.position}</span>
          </div>
        </div>
      </div>}
      {user?._id === item?.user?._id && <AiTwotoneDelete
        onClick={() => setConfirmation({ state: true, handleDelete })}
        className="absolute w-5 h-5 cursor-pointer right-2 bottom-5" />}
      <div className='flex space-x-2 items-start flex-1'>
        <div
          onMouseOver={() => setShowUser(true)}
          onMouseOut={() => setShowUser(false)}
          className='bg-gray-300 w-8 h-8 rounded-full mt-1 flex items-center justify-center cursor-pointer'>
          {item?.user.name.split(" ").map(e => e.slice(0, 1)).join("")}
        </div>
        <p className='bg-blue-100* p-2 flex-1 normal-case whitespace-pre-line'>{item?.comment}</p>
      </div>
      <span className='justify-end text-[11px] -mt-2 font-medium flex-1 flex right-0 *-translate-x-full'>
        {new Date().toLocaleString()}
      </span>
    </div>
  )
}