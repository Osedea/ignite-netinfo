const test = require('ava')
const sinon = require('sinon')
const plugin = require('../plugin')

test('removes the proper npm module and runs pod install (RN >= 0.60.0)', async t => {
    const APP_PATH = `${process.cwd()}/stubs/after-60`
    const TEST_PATH = `${APP_PATH}/ios`;
    const removeModule = sinon.spy()
    const run = sinon.spy()
    const exists = sinon.spy()
    const remove = sinon.spy()
    const generate = sinon.spy()
    const confirm = sinon.spy()
    const patchInFile = sinon.spy()

    // mock an Ignite toolbox
    const toolbox = {
        ignite: { removeModule, patchInFile },
        system: { run },
        filesystem: { exists, remove },
        template: { generate },
        prompt: { confirm },
        test: { APP_PATH }
    }

    await plugin.remove(toolbox)

    t.true(removeModule.calledWith('@react-native-community/netinfo'))
    t.deepEqual(run.getCalls()[0].args, ['pod install', { cwd: TEST_PATH }])
})

test('removes the proper npm module, unlinks and runs pod install (RN < 0.60.0)', async t => {
    const APP_PATH = `${process.cwd()}/stubs/before-60`
    const TEST_PATH = `${APP_PATH}/ios`;
    const removeModule = sinon.spy()
    const run = sinon.spy()
    const exists = sinon.spy()
    const remove = sinon.spy()
    const generate = sinon.spy()
    const confirm = sinon.spy()
    const patchInFile = sinon.spy()

    // mock an Ignite toolbox
    const toolbox = {
        ignite: { removeModule, patchInFile },
        system: { run },
        filesystem: { exists, remove },
        template: { generate },
        prompt: { confirm },
        test: { APP_PATH }
    }

    await plugin.remove(toolbox)

    t.true(removeModule.calledWith('@react-native-community/netinfo', { unlink: true }))
    t.deepEqual(run.getCalls()[0].args, ['pod install', { cwd: TEST_PATH }])
})
