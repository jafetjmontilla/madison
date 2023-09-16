import { AuthContextProvider } from "../context/AuthContext"

export const useHasRole = () => {
  const { user } = AuthContextProvider()


  const hasRole = (schemaGroups: string[]): boolean => {
    if (schemaGroups?.includes("all")) return true
    return user?.groups?.some(group => schemaGroups?.includes(group))
  }

  return hasRole
}