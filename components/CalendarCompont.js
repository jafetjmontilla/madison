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
import { ModalReprogramar } from './ModalReprogramar'
import { title } from 'process'

const options = [
  { value: "pendiente", label: "pendiente", views: ["pendiente", "reprogramada", "ejecución", "pausada", "realizada"] },
  { value: "reprogramada", label: "reprogramada", views: ["pendiente", "reprogramada", "ejecución", "pausada", "realizada"] },
  { value: "ejecución", label: "en ejecución", views: ["pendiente", "reprogramada", "ejecución", "pausada", "realizada"] },
  { value: "pausada", label: "pausada", views: ["pendiente", "reprogramada", "ejecución", "pausada", "realizada"] },
  { value: "realizada", label: "ejecutada", views: ["pendiente", "reprogramada", "ejecución", "pausada", "realizada", "supervisada"] },
  { value: "supervisada", label: "supervisada", views: ["realizada", "supervisada"] },
  { value: "eliminada", label: "eliminada", views: ["pendiente", "reprogramada", "ejecución", "pausada", "realizada", "supervisada"] },
]

const getEvent = (elem, view, viewCalendar) => {
  // const ds = elem?.start?.split("T")[0].split("-").map(elem => parseInt(elem))
  // const ts = elem?.start?.split("T")[1].split(":").map(elem => parseInt(elem))
  let ds = null
  let de = null
  let allDay = true
  if (view === "realizada") {
    const d = new Date(elem.start).getTime()
    ds = new Date(elem.start)
    de = new Date(elem.start)
    allDay = viewCalendar?.state !== "agenda"
  } else {
    ds = new Date(elem.start)
    de = new Date(elem.start)
  }
  //console.log(ds, de)
  return {
    id: elem?._id,
    title: `(${elem?.property?.father?.tag}) ${elem?.property?.title}`.toUpperCase(),
    // start: new Date(ds[0], ds[1] - 1, ds[2]),
    // end: new Date(ds[0], ds[1] - 1, ds[2] + 1),
    start: ds,
    end: de,
    property: elem?.property,
    allDay,
    task: elem
  }
}

const localizer = momentLocalizer(moment)

export const CalendarCompont = (props) => {
  const { user } = AuthContextProvider()
  const [events, setEvents] = useState()
  const [showEditProperty, setShowEditProperty] = useState({ status: false, payload: null })
  const [showModal, setShowModal] = useState({ status: false, payload: null })
  const [property, setProperty] = useState({})
  const [TaskID, setTaskID] = useState()
  const [calEvent, setCalEvent] = useState()
  const clickRef = useRef(null)
  const toast = useToast()
  const [view, setView] = useState("pendiente")
  const [viewCalendar, setViewCalendar] = useState({ oldState: "", state: "" })
  const [viewProperty, setViewProperty] = useState({ status: false })
  const [changeNote, setChangeNote] = useState(false)
  const [confirmation, setConfirmation] = useState({ state: false, value: false, elem: {}, handleDelete: () => { } })

  useEffect(() => {
    const rootelement = document.getElementById("rootelement")
    const child = document.getElementById("child")
    if (rootelement) {
      rootelement?.appendChild(child)
    }
  }, [])

  useEffect(() => {
    if (viewCalendar.state === "agenda" || viewCalendar.oldState === "agenda") {
      fetchApi({
        query: queries.getTasks,
        variables: {
          args: { state: view }
        },
      }).then((result) => {
        console.log(viewCalendar)
        setEvents(result?.results?.map(elem => getEvent(elem, view, viewCalendar)))
      })
    }
  }, [viewCalendar.state])

  useEffect(() => {
    fetchApi({
      query: queries.getTasks,
      variables: {
        args: { state: view }
      },
    }).then((result) => {
      setEvents(result?.results?.map(elem => getEvent(elem, view, viewCalendar)))
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
          args: { _id: calEvent?.property?._id, status: false }
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

  useEffect(() => {
    if (!showModal?.state) {
      if (showModal?.payload?.start) {
        fetchApi({
          query: queries.updateTasks,
          variables: {
            args: {
              _id: TaskID,
              state: showModal?.payload?.action,
              start: showModal?.payload?.start,
              userExecutor: user?.uid,
              nameExecutor: user?.name,
              executed: showModal?.payload?.action === "realizada"
            }
          }
        }).then((resp) => {
          calEvent.task.state = "reprogramada"
          calEvent?.task?.states?.push({ state: "reprogramada", user: user?.uid, name: user?.name })
          setCalEvent({ ...calEvent })
          toast("success", `marcada como ${showModal?.payload?.label}`)
        })
      }
    }
  }, [showModal])

  const handleChangeState = (value) => {
    try {
      if (["realizada", "reprogramada",].includes(value.value)) {
        setShowModal({ state: true, payload: { start: calEvent?.start, action: value.value, label: value?.label } })
        return
      }
      fetchApi({
        query: queries.updateTasks,
        variables: {
          args: {
            _id: TaskID,
            state: value?.value,
            userExecutor: user?.uid,
            nameExecutor: user?.name,
            executed: value?.value === "realizada"
          }
        }
      }).then((resp) => {
        calEvent.task.state = value?.value
        calEvent?.task?.states?.push({ state: value?.value, user: user?.uid, name: user?.name })
        setCalEvent({ ...calEvent })
        toast("success", `marcada como ${value?.label}`)
      })
    } catch (error) {
      console.log(error)
    }
  }

  const handleDelete = async (elem) => {
    await fetchApi({
      query: queries.deleteMedition,
      variables: {
        args: {
          _id: elem._id,
          father: calEvent.task._id
        }
      }
    })
    const f1 = calEvent?.task?.meditions?.findIndex(el => el._id === elem._id)
    calEvent?.task?.meditions?.splice(f1, 1)
    setCalEvent({ ...calEvent })
  }

  return (
    <div className="w-[calc(100%-0px)] h-[calc(100%-0px)] overflow-auto flex gap-4">
      <div id="child" className="w-full">
        {confirmation.state &&
          <ConfirmationDelete confirmation={confirmation} setConfirmation={setConfirmation} />
        }
        {showModal.state &&
          <ModalReprogramar setShowModal={setShowModal} showModal={showModal} />
        }
      </div>
      <div className='absolute flex rounded-t-lg w-[828px] h-10 -translate-y-8 truncate text-sm'>
        <div className='bg-gray-100 w-10 h-10' />
        <div className={`w-[140px] h-8 absolute flex justify-center items-center rounded-t-lg ${view === "pendiente" ? "z-10 font-semibold text-gray-700 bg-gray-100" : "bg-gray-300 hover:bg-gray-400"}  cursor-pointer left-[0px]`}
          onClick={() => setView("pendiente")}>
          <span className='uppercase'>pendientes</span>
        </div>
        <div className={`w-[140px] h-8 absolute flex justify-center items-center rounded-t-lg ${view === "reprogramada" ? "z-10 font-semibold text-gray-700 bg-gray-100" : "bg-gray-300 hover:bg-gray-400"}  cursor-pointer left-[138px]`}
          onClick={() => { setView("reprogramada") }}>
          <span className='uppercase'>reprogramadas</span>
        </div>
        <div className={`w-[140px] h-8 absolute flex justify-center items-center rounded-t-lg ${view === "ejecución" ? "z-10 font-semibold text-gray-700 bg-gray-100" : "bg-gray-300 hover:bg-gray-400"}  cursor-pointer left-[276px]`}
          onClick={() => setView("ejecución")}>
          <span className='uppercase'>en ejecución</span>
        </div>
        <div className={`w-[140px] h-8 absolute flex justify-center items-center rounded-t-lg ${view === "pausada" ? "z-10 font-semibold text-gray-700 bg-gray-100" : "bg-gray-300 hover:bg-gray-400"}  cursor-pointer left-[414px]`}
          onClick={() => setView("pausada")}>
          <span className='uppercase'>pausadas</span>
        </div>
        <div className={`w-[140px] h-8 absolute flex justify-center items-center rounded-t-lg ${view === "realizada" ? "z-10 font-semibold text-gray-700 bg-gray-100" : "bg-gray-300 hover:bg-gray-400"}  cursor-pointer left-[552px]`}
          onClick={() => setView("realizada")}>
          <span className='uppercase'>ejecutadas</span>
        </div>
        <div className={`w-[140px] h-8 absolute flex justify-center items-center rounded-t-lg ${view === "supervisada" ? "z-10 font-semibold text-gray-700 bg-gray-100" : "bg-gray-300 hover:bg-gray-400"}  cursor-pointer left-[690px]`}
          onClick={() => setView("supervisada")}>
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
        onView={(view) => {
          console.log(145, view)
          setViewCalendar(old => {
            const asd = { oldState: old.state, state: view }
            return { ...asd }
          })
          if (["day", "week"].includes(view)) {
            setTimeout(() => {
              const element = document.getElementsByClassName("rbc-time-content")[0]
              element.remove()
            }, 1);
            setTimeout(() => {
              const elementHeader = document.getElementsByClassName("rbc-time-header")[0]
              elementHeader.setAttribute("class", "rbc-time-header rbc-overflowing flex-1 overflow-auto")
              console.log(145, elementHeader)
            }, 100);
          }
          //day
          //rbc-time-header rbc-overflowing > flex-1 overflow-auto
          //rbc-time-content
          //week
          //rbc-time-header rbc-overflowing > flex-1 overflow-auto
          //rbc-time-content > hidden

        }}
        eventPropGetter={(event, start, end, isSelected) => {
          return {
            style: { fontSize: 12 }
          }
        }}
        events={events?.map(elem => {
          if (elem.task.state === "reprogramada") {
            elem.title = <div className='bg-green-600 w-full h-full rounded-sm'>{elem.title}</div>
            return elem
          }
          return elem

        })}
        //startAccessor="start" 
        //endAccessor="end"
        onSelectEvent={handleSelectEvent}
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
              <label className='text-xs'>Estado de la tarea</label>
              <InputSelect
                options={options.filter(elem => elem.views.includes(view))}
                // defaultValue={undefined}
                isClearable={false}
                onChange={(value) => {
                  handleChangeState(value)
                }}
                value={options?.find(elem => elem.value === calEvent?.task?.state)} />
            </div>
            <div className="w-16 h-[100%] flex justify-end">
              <span className="hidden md:flex mr-5 mb-2 text-2xl text-gray-500 cursor-pointer hover:scale-110" onClick={() => {
                if (view !== calEvent?.task?.state) {
                  setEvents(old => {
                    const f1 = old?.findIndex(elem => elem.id === calEvent?.task?._id)
                    old.splice(f1, 1)
                    return [...old]
                  })
                }
                setViewProperty({ status: false })
                setShowEditProperty({ status: false })
              }}>X</span>
            </div>
          </div>
          <span className='uppercase text-lg font-medium ml-3'>{calEvent?.task?.property?.title}</span>
          <div id="task" className='bg-white flex flex-col h-full w-[800px] rounded-xl *border-gray-300 *border-[1px] py-2 px-3 text-gray-800 uppercase space-y-4 overflow-y-scroll'>
            <div className='flex flex-col'>
              <label className="capitalize text-xs font-semibold">descripción</label>
              <span className=''>{calEvent?.task?.property?.description}</span>
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
                        <div className='col-span-1 space-x-1 grid grid-cols-2'>
                          <span className='w-full text-end'>{elem?.value}</span>
                          <span className='text-center' >{meditions?.find(el => el?.title === elem?.title)?.unit}</span>
                        </div>
                        <span className='ml-6 col-span-3'>{new Date(elem?.createdAt)?.toLocaleString()}</span>
                        <div className='col-span-1'>
                          <AiTwotoneDelete
                            onClick={() => setConfirmation({ state: true, handleDelete: () => handleDelete(elem) })}
                            className="w-5 h-5 cursor-pointer" />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

            </div>
            <div
              onBlur={async () => {
                if (changeNote) {
                  await fetchApi({
                    query: queries.updateTasks,
                    variables: {
                      args: {
                        _id: calEvent?.task?._id,
                        note: calEvent?.task?.note
                      }
                    }
                  })
                  setChangeNote(false)
                }
              }}
              className='flex flex-col'>
              <label className="capitalize text-xs font-semibold">observaciones</label>
              <Textarea value={calEvent?.task?.note}
                setValue={(value) => {
                  calEvent.task.note = value
                  setCalEvent({ ...calEvent })
                  !changeNote && setChangeNote(true)
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
            {(() => {
              const v1 = ["pendiente", "reprogramada", "ejecución", "pausada"].includes(view)
              return (
                <div className={`flex items-center ${v1 ? "cursor-pointer" : "text-gray-300"} space-x-2`}
                  onClick={() => {
                    if (v1) {
                      setViewProperty({ status: !viewProperty.status })
                      goToTheTnd()
                    }
                  }}>
                  <IoIosArrowDown className={`w-4 h-4 ${!viewProperty.status && "-rotate-90"}`} />
                  <span className="uppercase">editar propiedad</span>
                </div>
              )
            })()
            }
            {viewProperty.status && <div className='rounded-xl border-gray-200 border-[1px]'>
              <CreaAndEditProperties params={property} setShowAdd={setViewProperty} />
            </div>}
          </div>
        </div>
      </div>}
    </div>
  )
}
