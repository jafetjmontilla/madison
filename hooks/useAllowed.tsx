import { AppContextProvider } from "../context/AppContext"
import { AuthContextProvider } from "../context/AuthContext"

export const useAllowed = () => {
  const { user } = AuthContextProvider()
  const { itemSchema } = AppContextProvider()
  enum types {
    crear,
    leer,
    actualizar,
    eliminar,
    imprimir,
    decargar,
    cargar
  }
  const rights = user?.rights?.permissions?.reduce((acc, item) => {
    // console.log(8883, itemSchema?.groups)
    // console.log(8884, item.group)
    if (itemSchema?.groups?.includes(item?.group)) {
      acc.push(...item.permissions)
    }
    return acc
  }, [])

  const rightsFilter = rights?.filter((value, index, self) => {
    return self.indexOf(value) === index;
  })
  console.log(rightsFilter)
  const isAllowed = (permission: keyof typeof types): boolean => {
    console.log(permission)
    if (rightsFilter?.includes("all")) return true
    return rightsFilter?.includes(permission)
  }

  return [isAllowed]
}