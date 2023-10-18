import { AuthContextProvider } from "../context/AuthContext"

export const useHasRole = () => {
  const { user } = AuthContextProvider()


  const hasRole = (schemaGroups: string[]): boolean => {
    const userGroups = user?.groups?.map(elem => elem?.tag)
    if (schemaGroups?.includes("all")) return true
    return userGroups?.some(group => schemaGroups?.includes(group))
  }

  return hasRole
}