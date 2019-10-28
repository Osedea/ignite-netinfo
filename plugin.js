// Ignite CLI plugin for Netinfo
// ----------------------------------------------------------------------------

const NPM_MODULE_NAME = '@react-native-community/netinfo'

const PLUGIN_PATH = __dirname

const add = async function (toolbox) {
    const { ignite } = toolbox
    let APP_PATH = process.cwd()

    if (process.env.NODE_ENV === 'ignite-test') {
        APP_PATH = toolbox.test.APP_PATH;
    }

    const appProps = require(`${APP_PATH}/ignite/ignite.json`)
    const packageJSON = require(`${APP_PATH}/package.json`)

    if (packageJSON.dependencies['react-native'] >= '0.60.0') {
        await ignite.addModule(NPM_MODULE_NAME)
    } else {
        await ignite.addModule(NPM_MODULE_NAME, { link: true })
    }

    await toolbox.system.run('pod install', { cwd: `${APP_PATH}/ios` })

    if (!toolbox.filesystem.exists(`${APP_PATH}/app/helpers/network`)) {
        await toolbox.template.generate({
            template: `${PLUGIN_PATH}/templates/netinfo-helper.js.ejs`,
            target: `app/helpers/network.js`,
            props: appProps,
        })
    }

    if (!toolbox.filesystem.exists(`${APP_PATH}/app/services/Network`)) {
        let wantsReduxService = false;

        if (appProps.boilerplate !== "osedea-react-native-boilerplate") {
            wantsReduxService = await toolbox.prompt.confirm('Do you want the Network redux service?');
        } else {
            wantsReduxService = true;
        }

        if (wantsReduxService) {
            toolbox.filesystem.copy(`${PLUGIN_PATH}/templates/redux`, `${APP_PATH}/app/services/Network`);

            if (appProps.boilerplate === "osedea-react-native-boilerplate") {
                ignite.patchInFile(`${APP_PATH}/app/reducers.tsx`, {
                    insert: `import NetworkReducer from '${appProps.appName}/app/services/Network/reducer';\n`,
                    before: `export default combineReducers({`
                });
                ignite.patchInFile(`${APP_PATH}/app/reducers.tsx`, {
                    insert: `    Network: NetworkReducer.reducer,\n`,
                    after: `export default combineReducers({`
                });
                ignite.patchInFile(`${APP_PATH}/app/index.tsx`, {
                    insert: `import { setupConnectivityChangeHandling } from './helpers/network';\n\nsetupConnectivityChangeHandling();\n`,
                    before: `class Root extends Component {`
                });
                ignite.patchInFile(`${APP_PATH}/android/build.gradle`, {
                    insert: `        androidXCore = "1.0.2"`,
                    after: `targetSdkVersion = 28`
                });
            }
        }
    }
}

/**
 * Remove yourself from the project.
 */
const remove = async function (toolbox) {
    // Learn more about toolbox: https://infinitered.github.io/gluegun/#/toolbox-api.md
    const { ignite } = toolbox
    let APP_PATH = process.cwd()

    if (process.env.NODE_ENV === 'ignite-test') {
        APP_PATH = toolbox.test.APP_PATH;
    }

    const appProps = require(`${APP_PATH}/ignite/ignite.json`)
    const packageJSON = require(`${APP_PATH}/package.json`)

    if (packageJSON.dependencies['react-native'] >= '0.60.0') {
        await ignite.removeModule(NPM_MODULE_NAME)
    } else {
        await ignite.removeModule(NPM_MODULE_NAME, { unlink: true })
    }

    await toolbox.system.run('pod install', { cwd: `${APP_PATH}/ios` })

    const removeNetinfo = await toolbox.prompt.confirm(
        'Do you want to remove app/helpers/network.js?'
    )

    if (removeNetinfo) {
        toolbox.filesystem.remove(`${APP_PATH}/app/ignite-netinfo`);
    }

    if (appProps.boilerplate === "osedea-react-native-boilerplate") {
        ignite.patchInFile(`${APP_PATH}/app/reducers.tsx`, {
            delete: `import NetworkReducer from '${appProps.appName}/app/services/Network/reducer';\n`
        });
        ignite.patchInFile(`${APP_PATH}/app/reducers.tsx`, {
            delete: `    Network: NetworkReducer.reducer,\n`
        });
        ignite.patchInFile(`${APP_PATH}/app/index.tsx`, {
            delete: `import { setupConnectivityChangeHandling } from './helpers/network';\n\nsetupConnectivityChangeHandling();\n`,
        });
    }
}

// Required in all Ignite CLI plugins
module.exports = { add, remove }

