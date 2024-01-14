import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
require('moment/locale/es.js')
import "react-big-calendar/lib/css/react-big-calendar.css"
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import events1 from "./events"
import { fetchApi, queries } from '../utils/Fetching'
import { CreaAndEditProperties } from './CreaAndEditProperties'
import { ButtonBasic } from './ButtonBasic'
import { FaCheck } from 'react-icons/fa'
import { AuthContextProvider } from '../context/AuthContext'
import { useToast } from "../hooks/useToast";

const getEvent = (elem) => {
  const ds = elem?.start?.split("T")[0].split("-").map(elem => parseInt(elem))
  return {
    id: elem?._id,
    title: elem?.property?.title,
    start: new Date(ds[0], ds[1] - 1, ds[2]),
    end: new Date(ds[0], ds[1] - 1, ds[2] + 1),
    property: elem?.property,
    allDay: true
  }
}

const localizer = momentLocalizer(moment)

export const CalendarCompont = (props) => {
  const { user } = AuthContextProvider()
  const [events, setEvents] = useState()
  const [showEditProperty, setShowEditProperty] = useState({ status: false, payload: null })
  const [property, setProperty] = useState({})
  const [TaskID, setTaskID] = useState()
  const clickRef = useRef(null)
  const toast = useToast()
  const [view, setView] = useState("pendientes")


  useEffect(() => {
    fetchApi({
      query: queries.getTasks,
      variables: {
        args: { executed: view === "pendientes" ? false : true }
      },
    }).then((result) => {
      setEvents(result?.results?.map(elem => getEvent(elem)))
    })
  }, [view])

  useEffect(() => {
    if (showEditProperty?.payload) {
      fetchApi({
        query: queries.getTasks,
        variables: {
          args: { _id: TaskID }
        }
      }).then((resp) => {
        setEvents(old => {
          const f1 = old?.findIndex(elem => elem.id === TaskID)
          old.splice(f1, 1, getEvent(resp?.results[0]))
          return [...old]
        })
      })
    }
  }, [showEditProperty?.payload])


  const formats = useMemo(() => ({
    dateFormat: 'dd',

    dayFormat: (date, localizer) =>
      localizer.format(date, 'DDD', culture),

    dayRangeHeaderFormat: ({ start, end }, culture, localizer) =>
      localizer.format(start, { date: 'short' }, culture) + ' — ' +
      localizer.format(end, { date: 'short' }, culture)
  }), [])

  const handleSelectEvent = useCallback((calEvent) => {
    window.clearTimeout(clickRef?.current)
    clickRef.current = window.setTimeout(() => {
      setTaskID(calEvent.id)
      fetchApi({
        query: queries.getProperties,
        variables: {
          args: { _id: calEvent?.property?._id }
        }
      }).then((resp) => {
        setProperty(resp?.results[0])
        setShowEditProperty({ status: true })
      })
    }, 250)
  }, [])

  const doubleClickEvent = useCallback((calEvent) => {
    window.clearTimeout(clickRef?.current)
    clickRef.current = window.setTimeout(() => {
      setTaskID(calEvent.id)
      console.log(calEvent, 'onDoubleClickEvent')
    }, 250)
  }, [])

  const handleExecuted = () => {
    try {
      fetchApi({
        query: queries.updateTasks,
        variables: {
          args: { _id: TaskID, userExecutor: user?.uid, executed: true }
        }
      }).then((resp) => {
        setEvents(old => {
          const f1 = old?.findIndex(elem => elem.id === TaskID)
          old.splice(f1, 1, resp ? getEvent(resp) : resp)
          return [...old]
        })
        setShowEditProperty({ status: false })
        toast("success", "marcada como ejecutada")
      })
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="w-[97%] h-[95%] overflow-auto mx-auto mt-4 flex gap-4">
      <div className='absolute bg-gray-100 flex rounded-t-lg w-[314px] h-10 -translate-y-12 -translate-x-4 truncate'>
        <div className={`w-40 h-8 absolute flex justify-center items-center ${view === "pendientes" ? "z-10 font-semibold text-gray-700 rounded-t-lg bg-gray-100" : "bg-gray-300 hover:bg-gray-400"}  cursor-pointer`}
          onClick={() => setView("pendientes")}>
          <span className='uppercase'>pendientes</span>
        </div>
        <div className={`w-40 h-8 absolute flex justify-center items-center ${view === "realizadas" ? "z-10 font-semibold text-gray-700 rounded-t-lg bg-gray-100" : "bg-gray-300 hover:bg-gray-400"}  cursor-pointer right-0`}
          onClick={() => setView("realizadas")}>
          <span className='uppercase'>realizadas</span>
        </div>
      </div>
      {/* <div className='border-[1px] border-gray-300 rounded-xl w-[30%] h-full p-3 flex flex-col'>
        <span className='text-md'>Todo lo pendiente hasta hoy</span>
        <span className='text-sm ml-2 mt-4'>No hay tareas pendientes.</span>
      </div> */}
      <Calendar
        //formats={formats}
        localizer={localizer}
        events={events}
        //startAccessor="start" 
        //endAccessor="end"
        onSelectEvent={view === "pendientes" && handleSelectEvent}
        onDoubleClickEvent={doubleClickEvent}
        // selectable
        className='border-[1px] border-gray-300 rounded-xl w-[100%] p-2 text-sm'
        messages={{
          noEventsInRange: <span className='text-sm'>No hay tareas en este rango.</span>,
          next: <span className='text-sm capitalize'>sig</span>,
          previous: <span className='text-sm capitalize'>ant</span>,
          today: <span className='text-sm capitalize'>hoy</span>,
          month: <span className='text-sm capitalize'>mes</span>,
          week: <span className='text-sm capitalize'>semana</span>,
          day: <span className='text-sm capitalize'>día</span>,
          agenda: <span className='text-sm'>Agenda</span>,
          allDay: <span className='text-sm capitalize'></span>,
          date: <span className='text-sm capitalize'>fecha</span>,
          time: <span className='text-sm capitalize'>hora</span>,
          event: <span className='text-sm capitalize'>tarea</span>,
        }}
      />
      {(showEditProperty?.status && property) && <div className='absolute w-full h-full top-0 left-0 z-10 flex justify-center items-center'>
        <div className='bg-black w-full h-full opacity-50' />
        <div className='bg-white p-4 pt-2 absolute rounded-xl'>
          <div className='flex'>
            <div className="w-[75%] h-[100%] p-2 flex flex-col justify-start">
              <span className='uppercase text-xs'>parte de: </span>
              <span className='uppercase font-semibold'>{property?.father?.title}</span>
            </div>
            <div className="w-[25%] h-[100%] flex justify-end">
              <span className="hidden md:flex mr-5 mb-2 text-2xl text-gray-500 cursor-pointer hover:scale-110" onClick={() => setShowEditProperty({ status: false })}>X</span>
            </div>
          </div>
          <div className='bg-white rounded-xl border-gray-200 border-[1px]'>
            <CreaAndEditProperties params={property} setShowAdd={setShowEditProperty} />
          </div>
          <ButtonBasic
            className={`m-4 bg-green-500 hover:bg-green-600 w-48 h-8 text-sm mx-auto`}
            onClick={handleExecuted}
            caption={
              <div className="flex gap-2 text-sm">Marcar como ejecutada</div>
            }
          />
        </div>
      </div>}
    </div>
  )
}
/*
localizer = { localizer }
events = { myEvents }
dayLayoutAlgorithm = { dayLayoutAlgorithm }
defaultDate = { defaultDate }
defaultView = { Views.WEEK }
onSelectEvent = { handleSelectEvent }
onSelectSlot = { handleSelectSlot }
selectable
scrollToTime = { scrollToTime }
*/