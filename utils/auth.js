export const isAllowed = (userRights, schemaGroups, permission) => {
  console.log({ userRights, schemaGroups, permission })
  const rights = userRights?.reduce((acc, item) => {
    if (schemaGroups?.includes(item?.group)) {
      acc = [...acc, ...item.permissions]
    }
    return acc
  }, [])
  const rightsFilter = rights?.filter((value, index, self) => {
    return self.indexOf(value) === index;
  })
  console.log(rightsFilter)
  return rightsFilter?.includes(permission)
}
export const hasRole = (userGroups, schemaGroups) => {
  if (schemaGroups?.includes("all")) return true
  return userGroups?.some(group => schemaGroups?.includes(group))
}
