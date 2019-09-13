const test = require('ava')
const sinon = require('sinon')
const plugin = require('../plugin')

test('removes Netinfo', async t => {
  const removeModule = sinon.spy()

  const toolbox = {
    ignite: { removeModule }
  }

  await plugin.remove(toolbox)

  t.true(removeModule.calledWith('react-native-MODULENAME', { unlink: true }))
})
