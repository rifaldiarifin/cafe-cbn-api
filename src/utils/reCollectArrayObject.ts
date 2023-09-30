export const deleteFunc = (deleteValue: string[], value: object[]) => {
  const reCollect: object[] = [...value]
  for (let x = 0; x < deleteValue.length; x++) {
    const deleteIndex: string = deleteValue[x]

    const findI = reCollect.findIndex((find: any) => find.uuid === deleteIndex)
    if (findI !== -1) {
      reCollect.splice(findI, 1)
    }
  }
  return reCollect
}

export const addFunc = (addValue: object[], value: object[]) => {
  const reCollect: object[] = [...value]
  for (let x = 0; x < addValue.length; x++) {
    const addIndex: any = addValue[x]

    const findI = reCollect.find((find: any) => find.uuid === addIndex.uuid)
    if (!findI) {
      reCollect.push(addIndex)
    }
  }
  return reCollect
}
