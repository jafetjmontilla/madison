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

  const rights = user?.rights?.reduce((acc, item) => {
    if (itemSchema?.groups?.includes(item?.group)) {
      acc = [...acc, ...item.permissions]
    }
    return acc
  }, [])
  const rightsFilter = rights?.filter((value, index, self) => {
    return self.indexOf(value) === index;
  })
  const isAllowed = (permission: keyof typeof types): boolean => {
    return rightsFilter?.includes(permission)
  }

  return [isAllowed]
}