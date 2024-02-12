import { IconDelete } from "../icons"
import { ButtonBasic } from "./ButtonBasic"

export const ConfirmationDelete = ({ confirmation, setConfirmation, handleDelete, tag, email }) => {

  return (
    <div>
      <div className="w-full h-full top-0 left-0 opacity-50 bg-gray-900 absolute z-20" />
      <div className="w-[calc(100%-30px)] absolute z-30 flex justify-center top-40">
        <div className="bg-white w-[400px] *h-[280px] rounded-2xl p-8">
          <span className="text-2xl">Eliminar registro</span>
          {(tag || email)
            ? <>
              <p className="leading-4 my-2 text-sm font-semibold text-gray-600">Eliminará todos los otros elementos, propiedades y características que son parte de este elemento.</p>
              <p className="leading-4 my-2">Para eliminar <span className="font-semibold">{tag || email}</span>{`, escriba el ${tag && "tag" || email && "correo"} para confirmar.`}</p>
              <input type="text" onChange={(e) => {
                setConfirmation({
                  ...confirmation,
                  state: true,
                  value: tag ? e.target.value === tag : e.target.value === email
                })
              }} className="h-[38px] rounded-lg border-[1px] border-gray-300 text-sm w-[100%] my-4" placeholder={`Escriba el ${tag ? "tag" : "correo"}`} />
            </>
            : <p className="leading-4 my-2 text-sm font-semibold text-gray-600 mb-10">Una vez eliminado, desaparecerá definitivamente.</p>
          }
          <div className="flex justify-between">
            <ButtonBasic
              className={`bg-white border-[1px] border-gray-300 hover:drop-shadow-lg w-20 h-[26px] text-sm`}
              onClick={() => setConfirmation({ ...confirmation, state: false, value: false })}
              caption={
                <div className="text-black flex gap-2 text-sm">cancelar</div>
              }
            />
            <ButtonBasic
              className={` ${confirmation.value || (!tag && !email) ? "bg-red-500 hover:bg-red-700" : "bg-red-100 cursor-not-allowed"} w-20 h-[26px] text-sm`}
              onClick={() => {
                if (confirmation.value) {
                  handleDelete()
                  setConfirmation({ ...confirmation, state: false, value: false })
                }
                if (!tag && !email) {
                  confirmation?.handleDelete()
                  setConfirmation({ ...confirmation, state: false, value: false })
                }
              }}
              caption={
                <div className="flex gap-2 text-sm"><IconDelete className="w-5 h-5" /> eliminar</div>
              }
            />
          </div>
        </div>
      </div>
    </div>
  )
}