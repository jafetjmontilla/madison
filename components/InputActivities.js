import { InputSelect } from "./InputSelect"
import { meditions } from "../utils/schemaMeditions"
import { useEffect, useState } from "react"
import { AuthContextProvider } from "../context/AuthContext"
import { goToTheTnd } from "./CalendarCompont"
import { Textarea } from "./Textarea"
import { fetchApi, queries } from "../utils/Fetching"
export const InputActivities = ({ calEvent, setCalEvent }) => {
  const { user } = AuthContextProvider()
  const [values, setValues] = useState({ value: "" })
  const [valir, setValir] = useState(false)

  useEffect(() => {
    if (values?.value) {
      setValir(true)
    } else {
      setValir(false)
    }
  }, [values])

  const handleSubmit = () => {
    if (values.value) {
      const activity = {
        comment: values.value,
        user: user?.uid,
        name: user?.name,
      }
      fetchApi({
        query: queries.updateTasks,
        variables: {
          args: {
            _id: calEvent?.task?._id,
            activity
          }
        }
      }).then((result) => {
        calEvent.task.activities.push(result?.activities.slice(- 1)[0])
        setCalEvent({ ...calEvent })
        setValues({ value: "" })
      })
    }
  }

  return (
    <div className='flex space-x-2 px-2'>
      <div className='bg-gray-300 w-8 h-8 rounded-full mt-1 flex items-center justify-center'>
        {user.name.split(" ").map(e => e.slice(0, 1)).join("")}
      </div>
      <div className='flex-1'>
        <Textarea value={values?.value}
          setValue={(value) => {
            values.value = value
            setValues({ ...values })
          }} />

        <div className="space-x-4 text-blue-600 font-medium my-1">
          <span onClick={handleSubmit} className={`${valir ? "hover:text-blue-800 cursor-pointer font-semibold" : "text-gray-300"}`}>guardar</span>
          <span onClick={() => { setValues({ value: "" }) }} className={`${valir ? "hover:text-blue-800 cursor-pointer font-semibold" : "text-gray-300"}`}>cancelar</span>
        </div>
      </div>
    </div>
  )
}