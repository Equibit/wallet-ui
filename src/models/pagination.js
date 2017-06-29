import DefineMap from 'can-define/map/map'

export default DefineMap.extend({
  skip: 'number',
  limit: 'number',
  total: 'number',
  get params () {
    return {
      '$skip': this.skip,
      '$limit': this.limit
    }
  }
})
