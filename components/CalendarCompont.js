import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
require('moment/locale/es.js')
import "react-big-calendar/lib/css/react-big-calendar.css"
import { useMemo } from 'react'

const localizer = momentLocalizer(moment)

export const CalendarCompont = (props) => {
  const formats = useMemo(() => ({
    dateFormat: 'dd',

    dayFormat: (date, localizer) =>
      localizer.format(date, 'DDD', culture),

    dayRangeHeaderFormat: ({ start, end }, culture, localizer) =>
      localizer.format(start, { date: 'short' }, culture) + ' — ' +
      localizer.format(end, { date: 'short' }, culture)
  }), [])
  return (
    <div className="*border-2 *border-gray-500 *rounded-xl w-[97%] h-[95%] overflow-auto mx-auto mt-4 flex gap-4">
      <div className='border-[1px] border-gray-300 rounded-xl w-[30%] h-full p-3 flex flex-col'>
        <span className='text-md'>Todo lo pendiente hasta hoy</span>
        <span className='text-sm ml-2 mt-4'>No hay tareas pendientes.</span>
      </div>
      <Calendar
        //formats={formats}
        localizer={localizer}
        events={[]}
        startAccessor="start"
        endAccessor="end"
        className='border-[1px] border-gray-300 rounded-xl w-[70%] p-2 text-sm'
        messages={{
          noEventsInRange: <span className='text-sm'>No hay tareas en este rango.</span>,
          next: <span className='text-sm'>sig</span>,
          previous: <span className='text-sm'>ant</span>,
          today: <span className='text-sm'>Hoy</span>,
          month: <span className='text-sm'>Mes</span>,
          week: <span className='text-sm'>Semana</span>,
          day: <span className='text-sm'>Día</span>,
          agenda: <span className='text-sm'>Agenda</span>,
        }}
      />
    </div>
  )
}