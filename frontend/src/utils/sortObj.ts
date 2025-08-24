/**
 * 对象排序
**/
export function sortObject (unordered: any, sortArrays = false): any {
  if (!unordered || typeof unordered !== 'object') {
    return unordered
  }

  if (Array.isArray(unordered)) {
    const newArr = unordered.map(item => sortObject(item, sortArrays))
    if (sortArrays) {
      newArr.sort()
    }
    return newArr
  }

  const ordered: any = {}
  for (const key of Object.keys(unordered)
    .sort()) {
    ordered[key] = sortObject(unordered[key], sortArrays)
  }
  return ordered
}
