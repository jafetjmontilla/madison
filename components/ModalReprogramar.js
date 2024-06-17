import { useEffect, useState } from "react"
import { IconDelete } from "../icons"
import { ButtonBasic } from "./ButtonBasic"

export const ModalReprogramar = ({ confirmation, setConfirmation, showModal, setShowModal, handle, tag, email }) => {
  const d = new Date(showModal?.payload?.start)
  const [values, setValues] = useState({
    date: `${d.getFullYear()}-${(d.getMonth() + 1) < 10 ? `0${d.getMonth() + 1}` : d.getMonth() + 1}-${d.getDate() < 10 ? `0${d.getDate()}` : d.getDate()}`, time: `${d.getHours() < 10 ? `0${d.getHours()}` : d.getHours()}:${d.getMinutes() < 10 ? `0${d.getMinutes()}` : d.getMinutes()}`
  })

  return (
    <div>
      <div className="w-full h-full top-0 left-0 opacity-50 bg-gray-900 absolute z-20" />
      <div className="w-[calc(100%-30px)] absolute z-30 flex justify-center top-40">
        <div className="bg-white w-[400px] *h-[280px] rounded-2xl p-8">
          <span className="text-2xl">Ingrese la nueva fecha</span>
          <div className={`mx-20 my-6 grid gap-2 grid-cols-6`}>
            <input type="date"
              onChange={(e) => {
                const payload = { ...showModal?.payload, date: e.target.value }
                setValues({ ...values, date: e.target.value })
              }}
              value={values?.date ? values?.date : ""} className={`col-span-6 h-[38px] rounded-lg border-[1px] border-gray-300 text-sm`} />
            {/* <input type="time"
              onChange={(e) => {
                const payload = { ...showModal?.payload, time: e.target.value }
                setShowModal({ ...showModal, payload })
              }}
              value={showModal?.payload?.time ? showModal?.payload?.time : ""} className={`col-span-5 h-[38px] rounded-lg border-[1px] border-gray-300 text-sm `} /> */}
          </div>
          <div className="flex justify-between">
            <ButtonBasic
              className={`bg-white border-[1px] border-gray-300 hover:drop-shadow-lg w-20 h-[26px] text-sm`}
              onClick={() => setShowModal({ state: false, payload: null })}
              caption={
                <div className="text-black flex gap-2 text-sm">cancelar</div>
              }
            />
            <ButtonBasic
              className={` ${confirmation?.value || (!tag && !email) ? "bg-green-500 hover:bg-green-600" : "bg-green-100 cursor-not-allowed"} w-20 h-[26px] text-sm`}
              onClick={() => { setShowModal({ state: false, payload: { ...showModal?.payload, start: new Date(`${values.date}:${values.time}`) } }) }}
              caption={
                <div className="flex gap-2 text-sm"> Guardar</div>
              }
            />
          </div>
        </div>
      </div>
    </div>
  )
}