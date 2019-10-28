const test = require('ava')
const sinon = require('sinon')
const plugin = require('../plugin')

test('adds the proper npm module and runs pod install (RN >= 0.60.0)', async t => {
    const APP_PATH = `${process.cwd()}/stubs/after-60`
    const TEST_PATH = `${APP_PATH}/ios`
    // spy on few things so we know they're called
    const addModule = sinon.spy()
    const run = sinon.spy()
    const exists = sinon.spy()
    const copy = sinon.spy()
    const generate = sinon.spy()
    const confirm = sinon.spy()
    const patchInFile = sinon.spy()

    // mock an Ignite toolbox
    const toolbox = {
        ignite: { addModule, patchInFile },
        system: { run },
        filesystem: { exists, copy },
        template: { generate },
        prompt: { confirm },
        test: { APP_PATH }
    }

    await plugin.add(toolbox)

    t.true(addModule.calledWith('@react-native-community/netinfo'))
    t.deepEqual(run.getCalls()[0].args, ['pod install', { cwd: TEST_PATH }])
})

test('adds the proper npm module, links and runs pod install (RN < 0.60.0)', async t => {
    const APP_PATH = `${process.cwd()}/stubs/before-60`
    const TEST_PATH = `${APP_PATH}/ios`
    // spy on few things so we know they're called
    const addModule = sinon.spy()
    const run = sinon.spy()
    const exists = sinon.spy()
    const copy = sinon.spy()
    const generate = sinon.spy()
    const confirm = sinon.spy()
    const patchInFile = sinon.spy()

    // mock an Ignite toolbox
    const toolbox = {
        ignite: { addModule, patchInFile },
        system: { run },
        filesystem: { exists, copy },
        template: { generate },
        prompt: { confirm },
        test: { APP_PATH }
    }

    await plugin.add(toolbox)

    t.true(addModule.calledWith('@react-native-community/netinfo', { link: true }))
    t.deepEqual(run.getCalls()[0].args, ['pod install', { cwd: TEST_PATH }])
})
