const spawn = require("spawndamnit")

async function runSpawn(command, args) {
    // log the output of the command in terminal
    const spawnOptions = { stdio: 'inherit' }

    let result = await spawn(command, args, spawnOptions)
    if (result.code !== 0) {
        throw new Error(`${args.join(' ')} failed`)
    }
}


module.exports = {
    organization: '@glagh',
    folderNameToPackageName: {
        'contracts': 'commons-contracts',
        'configs': 'commons-sdk'
    },
    runSpawn
}
