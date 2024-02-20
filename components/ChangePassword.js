import { useRef, useState } from "react"
import { Eye, EyeSlash } from "../icons"
import { fetchApi, queries } from "../utils/Fetching"
import { useToast } from "../hooks/useToast"

export const ChangePasssword = ({ dataValues }) => {
  const toast = useToast()
  const [viewInput, setViewInput] = useState(false)
  const [passwordView, setPasswordView] = useState(false)
  const refInput = useRef(null)
  const handleChange = () => {
    try {
      console.log(refInput.current.value)
      fetchApi({
        query: queries.updateUser,
        variables: {
          args: {
            uid: dataValues?.uid,
            password: refInput.current.value
          },
        },
        type: "json"
      }).then(() =>
        toast("success", "Contraseña cambiada con éxito")
      )
      setViewInput(false)
    } catch (error) {
      console.log(error)
    }
  }


  return (
    <div>
      <br />
      {!viewInput
        ? <div onClick={() => setViewInput(true)} className="w-40 h-8 bg-green-300 m-auto rounded-lg flex items-center justify-center hover:bg-green-500 cursor-pointer text-sm">Cambiar Password</div>
        : <div className="flex space-x-2" >
          <input ref={refInput} type={!passwordView ? "password" : "text"} className="w-36 h-[38px] rounded-lg border-[1px] border-gray-300 text-sm" />
          <div className="relative">
            < div onClick={() => { setPasswordView(!passwordView) }} className="absolute cursor-pointer inset-y-0 m-auto w-4 h-4 text-gray-500 -translate-x-8" >
              {!passwordView ? <Eye /> : <EyeSlash />}
            </div >
          </div>
          <div onClick={handleChange} className="flex-1 h-8 bg-green-300 m-auto rounded-lg flex items-center justify-center hover:bg-green-500 cursor-pointer text-sm">Guardar</div>
        </div>
      }
    </div>
  )
}