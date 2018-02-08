export function filterUniqAddr (list) {
  return list.reduce((acc, item) => {
    const key = `${item.portfolioId}-${item.index}-${item.type}-${item.isChange}`
    if (!acc.map[key]) {
      acc.map[key] = true
      acc.res.push(item)
    }
    return acc
  }, {res: [], map: {}}).res
}