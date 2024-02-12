import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
require('moment/locale/es.js')
import "react-big-calendar/lib/css/react-big-calendar.css"
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { fetchApi, queries } from '../utils/Fetching'
import { CreaAndEditProperties } from './CreaAndEditProperties'
import { ButtonBasic } from './ButtonBasic'
import { AuthContextProvider } from '../context/AuthContext'
import { useToast } from "../hooks/useToast";
import { InputSelect } from './InputSelect'
import { IoIosArrowDown } from 'react-icons/io'
import { Textarea } from './Textarea'
import { InputMeditions } from './InputMeditions'
import { InputActivities } from './InputActivities'
import { ListActivities } from './ListActivities'
import { meditions } from '../utils/schemaMeditions'
import { AiTwotoneDelete } from 'react-icons/ai'
import { ConfirmationDelete } from './ConfirmationDelete'

const options = [
  { value: "pendiente", label: "pendiente" },
  { value: "ejecución", label: "en ejecución" },
  { value: "pausada", label: "pausada" },
  { value: "realizada", label: "realizada" },
  { value: "supervisada", label: "supervisada" },
]

const getEvent = (elem) => {
  const ds = elem?.start?.split("T")[0].split("-").map(elem => parseInt(elem))
  return {
    id: elem?._id,
    title: elem?.property?.title,
    start: new Date(ds[0], ds[1] - 1, ds[2]),
    end: new Date(ds[0], ds[1] - 1, ds[2] + 1),
    property: elem?.property,
    allDay: true,
    task: elem
  }
}

const localizer = momentLocalizer(moment)

export const CalendarCompont = (props) => {
  const { user } = AuthContextProvider()
  const [events, setEvents] = useState()
  const [showEditProperty, setShowEditProperty] = useState({ status: false, payload: null })
  const [property, setProperty] = useState({})
  const [TaskID, setTaskID] = useState()
  const [calEvent, setCalEvent] = useState()
  const clickRef = useRef(null)
  const toast = useToast()
  const [view, setView] = useState("pendientes")
  const [viewProperty, setViewProperty] = useState({ status: false })
  const [confirmation, setConfirmation] = useState({ state: false, value: false, elem: {}, handleDelete: () => { } })

  useEffect(() => {
    const rootelement = document.getElementById("rootelement")
    const child = document.getElementById("child")
    if (rootelement) {
      rootelement?.appendChild(child)
    }
  }, [])

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

  const goToTheTnd = () => {
    const d = document.getElementById("task")
    setTimeout(() => {
      d.scrollTop = d.scrollHeight
    }, 50);
  }

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
        calEvent.task.property = resp?.results[0]
        setCalEvent(calEvent)
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
        setViewProperty({ status: false })
        setShowEditProperty({ status: false })
        toast("success", "marcada como ejecutada")
      })
    } catch (error) {
      console.log(error)
    }
  }

  const handleDelete = (elem) => {
    const f1 = calEvent?.task?.meditions?.findIndex(el => el.title === elem.title)
    calEvent?.task?.meditions?.splice(f1, 1)
    setCalEvent({ ...calEvent })
  }

  useEffect(() => {
    console.log(10005, calEvent?.task)
  }, [calEvent])

  return (
    <div className="w-[calc(100%-0px)] h-[calc(100%-0px)] overflow-auto flex gap-4">
      <div id="child" className="w-full">
        {confirmation.state &&
          <ConfirmationDelete confirmation={confirmation} setConfirmation={setConfirmation} />
        }
      </div>
      <div className='absolute flex rounded-t-lg w-[690px] h-10 -translate-y-8 truncate'>
        <div className='bg-gray-100 w-10 h-10' />
        <div className={`w-[140px] h-8 absolute flex justify-center items-center rounded-t-lg ${view === "pendientes" ? "z-10 font-semibold text-gray-700 bg-gray-100" : "bg-gray-300 hover:bg-gray-400"}  cursor-pointer left-[0px]`}
          onClick={() => setView("pendientes")}>
          <span className='uppercase'>pendientes</span>
        </div>
        <div className={`w-[140px] h-8 absolute flex justify-center items-center rounded-t-lg ${view === "ejecución" ? "z-10 font-semibold text-gray-700 bg-gray-100" : "bg-gray-300 hover:bg-gray-400"}  cursor-pointer left-[138px]`}
          onClick={() => setView("ejecución")}>
          <span className='uppercase'>en ejecución</span>
        </div>
        <div className={`w-[140px] h-8 absolute flex justify-center items-center rounded-t-lg ${view === "pausadas" ? "z-10 font-semibold text-gray-700 bg-gray-100" : "bg-gray-300 hover:bg-gray-400"}  cursor-pointer left-[276px]`}
          onClick={() => setView("pausadas")}>
          <span className='uppercase'>pausada</span>
        </div>
        <div className={`w-[140px] h-8 absolute flex justify-center items-center rounded-t-lg ${view === "realizadas" ? "z-10 font-semibold text-gray-700 bg-gray-100" : "bg-gray-300 hover:bg-gray-400"}  cursor-pointer left-[414px]`}
          onClick={() => setView("realizadas")}>
          <span className='uppercase'>realizadas</span>
        </div>
        <div className={`w-[140px] h-8 absolute flex justify-center items-center rounded-t-lg ${view === "supervisadas" ? "z-10 font-semibold text-gray-700 bg-gray-100" : "bg-gray-300 hover:bg-gray-400"}  cursor-pointer left-[552px]`}
          onClick={() => setView("supervisadas")}>
          <span className='uppercase'>supervisadas</span>
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
        <div className='bg-gray-200 h-[calc(100vh-100px)] p-4 pt-2 absolute rounded-xl flex flex-col space-y-2 text-sm'>



          <div className='flex h-16'>
            <div className="*bg-white flex-1 h-[100%] p-2 flex flex-col justify-start">
              <span className='uppercase text-xs'>parte de: </span>
              <span className='uppercase font-semibold'>{property?.father?.title}</span>
            </div>
            <div className="w-64 h-[100%] mt-1 text-sm">
              <label className='text-xs'>Marcar tarea como  </label>
              <InputSelect
                options={options}
                // defaultValue={undefined}
                isClearable={false}
                onChange={(value) => {
                  calEvent.task.state = value?.value
                  calEvent?.task?.states?.push({ state: value?.value, user: user?.uid, name: user?.name })
                  setCalEvent({ ...calEvent })
                }}
                value={options?.find(elem => elem.value === calEvent?.task?.state)} />
            </div>
            <div className="w-16 h-[100%] flex justify-end">
              <span className="hidden md:flex mr-5 mb-2 text-2xl text-gray-500 cursor-pointer hover:scale-110" onClick={() => {
                setViewProperty({ status: false })
                setShowEditProperty({ status: false })
              }}>X</span>
            </div>
          </div>
          <span className='uppercase text-lg font-medium ml-3'>{calEvent?.task?.property?.title}</span>
          <div id="task" className='bg-white flex flex-col h-full w-[800px] rounded-xl *border-gray-300 *border-[1px] py-2 px-3 text-gray-800 uppercase space-y-4 overflow-y-scroll'>
            <div className='flex flex-col'>
              <label className="capitalize text-xs font-semibold">descripción</label>
              <span className=''>{calEvent?.task?.property?.description} lskdasjdjas lsdj asjldjlasj djasljd jasdjlasjdj asl dj</span>
            </div>
            <div className='flex flex-col'>
              <label className="capitalize text-xs font-semibold">mediciones</label>
              <div className='border-gray-300 border-[1px] rounded-lg py-2'>
                <InputMeditions calEvent={calEvent} setCalEvent={setCalEvent} />
                <div className='flex flex-col-reverse space-y-1'>
                  {calEvent?.task?.meditions?.map((elem, idx) => {
                    return (
                      <div key={idx} className={`grid grid-cols-12 pl-4 hover:bg-gray-200 px-2 *${idx % 2 !== 0 && "bg-gray-100"}`}>
                        <span className='col-span-3'>{elem?.title}</span>
                        <div className='col-span-2 space-x-1 grid grid-cols-2'>
                          <span className='w-full text-end'>{elem?.value}</span>
                          <span className='text-center' >{meditions?.find(el => el?.title === elem?.title)?.unit}</span>
                        </div>
                        <span className='col-span-3'>{elem?.createdAt.toLocaleString()}</span>
                        <AiTwotoneDelete
                          onClick={() => setConfirmation({ state: true, handleDelete: () => handleDelete(elem) })}
                          className="w-5 h-5 cursor-pointer" />
                      </div>
                    )
                  })}
                </div>
              </div>

            </div>
            <div className='flex flex-col'>
              <label className="capitalize text-xs font-semibold">observaciones</label>
              <Textarea value={calEvent?.task?.note}
                setValue={(value) => {
                  calEvent.task.note = value
                  setCalEvent({ ...calEvent })
                }} />
            </div>
            <div className='flex flex-col'>
              <label className="capitalize text-xs font-semibold">Actividad</label>
              <div className='border-gray-300 border-[1px] rounded-lg py-2'>
                <InputActivities calEvent={calEvent} setCalEvent={setCalEvent} />
                <div className='w-[calc(100%)] flex flex-col-reverse rounded-lg'>
                  {calEvent?.task?.activities?.map((elem, idx) => {
                    return (
                      <ListActivities key={idx} calEvent={calEvent} setCalEvent={setCalEvent} item={elem} setConfirmation={setConfirmation} />
                    )
                  })}
                </div>
              </div>
            </div>
            <div className="flex items-center cursor-pointer space-x-2"
              onClick={() => {
                setViewProperty({ status: !viewProperty.status })
                goToTheTnd()
              }}>
              <IoIosArrowDown className={`w-4 h-4 ${!viewProperty.status && "-rotate-90"}`} />
              <span className="uppercase">editar propiedad</span>
            </div>
            {viewProperty.status && <div className='rounded-xl border-gray-200 border-[1px]'>
              <CreaAndEditProperties params={property} setShowAdd={setViewProperty} />
            </div>}
          </div>


          {/* <ButtonBasic
            className={`m-4 bg-green-500 hover:bg-green-600 w-48 h-8 text-sm mx-auto`}
            onClick={handleExecuted}
            caption={
              <div className="flex gap-2 text-sm">Marcar como ejecutada</div>
            }
          /> */}
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

