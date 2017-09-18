import assert from 'chai/chai'
import 'steal-mocha'
import { ViewModel } from './alerts'
import hub from '~/utils/event-hub'

// ViewModel unit tests
describe('components/alerts', function () {
  it('should add and remvoe Hub alerts', function (done) {
    const vm = new ViewModel()
    let counter = 0

    // Always unbind
    const addHandler = (ev, alerts) => {
      if (counter === 0) {
        counter++
        assert.equal(alerts.length, 1)
        assert.ok(alerts[0].hasOwnProperty('id'))
        assert.ok(alerts[0].hasOwnProperty('kind'))
      } else {
        assert.equal(alerts.length, 0, 'Alerts should be empty')
        vm.off('alerts', addHandler)
        done()
      }
      // vm.off('alerts', addHandler)
      // vm.on('alerts', removeHandler)
      // vm.dispatch({type: 'remove', id: alerts[0].id})
    }

    // const removeHandler = (ev, alerts) => {
    //   debugger
    //   assert.equal(alerts.length, 0, 'Alerts should be empty')
    //   vm.off('alerts', removeHandler)
    //   done()
    // }

    vm.on('alerts', addHandler)
    hub.dispatch({type: 'alert'})
    vm.dispatch({type: 'remove', id: vm.alerts[0].id})
  })

  it('should automatically create a remove action with autohide', function (done) {
    const vm = new ViewModel()

    // Always unbind
    const handler = ev => {
      // TODO: for some reason event streams are screwed up and we receive `no-op` here from the previous test.
      if (ev.type === 'no-op') {
        return
      }
      assert.equal(ev.type, 'remove')
      vm.autoHideStream.offValue(handler)
      done()
    }

    vm.autoHideStream.onValue(handler)
    hub.dispatch({ type: 'alert', displayInterval: 100 })
  })

  it('should ignore falsy or Infinity with autohide', function (done) {
    let counter = 0
    const vm = new ViewModel()

    const handler = ev => {
      // TODO: for some reason event streams are screwed up and we receive `remove` here from the previous test.
      if (ev.type !== 'no-op') {
        return
      }
      counter++
      assert.equal(ev.type, 'no-op')
    }

    // Always unbind
    setTimeout(() => {
      vm.autoHideStream.offValue(handler)
      assert.equal(counter, 5)
      done()
    }, 300)

    vm.autoHideStream.onValue(handler)
    hub.dispatch({ type: 'alert', displayInterval: 0 })
    hub.dispatch({ type: 'alert', displayInterval: null })
    hub.dispatch({ type: 'alert', displayInterval: undefined })
    hub.dispatch({ type: 'alert', displayInterval: '' })
    hub.dispatch({ type: 'alert', displayInterval: Infinity })
  })
})
