const util = require('util');
const exec = util.promisify(require('child_process').exec);
const fs = require('fs')

const spawn = require("spawndamnit")

const organization = '@glagh'

const mapping = {
    'contracts': 'commons-contracts',
    'configs': 'commons-sdk'
}


async function run() {
    const package = 'contracts'
    const packageName = mapping[package];

    if (packageName === undefined) {
        throw new Error("package not found");
    }

    await exec("npx changeset status --output=temp.js")

    const contents = fs.readFileSync("temp.js", { encoding: 'utf8' })
    const releases = JSON.parse(contents).releases;

    const release = releases.filter(item => item.name == `${organization}/${packageName}`)

    /// Defensive assertion. SHOULD NOT BE REACHED
    if (release.length != 1) {
        throw new Error(`The status doesn't contain only 1 release for ${packageName}`)
    }

    const parts = release[0].newVersion.split('.');

    const releaseBranch = `release-${package}-v${parts[0]}.${parts[1]}`

    // const checkoutCommand = await spawn('git', ['checkout', '-b', releaseBranch])
    // if (checkoutCommand.code !== 0) {
    //     throw new Error(checkoutCommand.stderr.toString())
    // }

    // await exec('npx changeset pre enter alpha')
    await spawn("git", ["add", "."], { cwd: undefined });
    await spawn(
        "git",
        ["commit", "-m", "Start release candidate", "--allow-empty"],
        { cwd: undefined, stdio: 'inherit' }
    );

    // core.setOutput(key, value);
}

// run()


// module.exports = async ({ github, context, core }) => {

//     const package = process.env.PACKAGE;

//     await exec("npx changeset")

//     // RELEASE_BRANCH = "release-$PACKAGE"
//     // git checkout -b "$RELEASE_BRANCH"

//     // # Output branch
//     // echo "branch=$RELEASE_BRANCH" >> $GITHUB_OUTPUT

//     // # Enter in prerelease state
//     // npx changeset pre enter alpha
//     // git add .
//     // git commit -m "Start release candidate"

//     // # Push branch
//     // if ! git push origin "$RELEASE_BRANCH"; then
//     // echo "Error: Can't push $RELEASE_BRANCH."
//     // exit 1
//     // fi


//     // exec('git add .')
//     // exec('git commit -m great')
//     // exec('git push origin feature/kk')

// async function run(cwd) {
//     const gitCmd1 = await spawn("git", ["add", "."], { cwd });
//     if (gitCmd1.code !== 0) {
//         console.log("first ", gitCmd1.stderr.toString());
//     }

//     console.log(gitCmd1.stdout.toString())

//     const gitCmd2 = await spawn(
//         "git",
//         ["commit", "-m", "aweseom", "--allow-empty"],
//         { cwd, stdio: 'inherit' }
//     );


//     // if (gitCmd2.code !== 0) {
//     //     console.log("second ", gitCmd2.stderr.toString());
//     // }

//     const gitCmd3 = await spawn(
//         "git",
//         ["push", "origin", "feature/kk"],
//         { cwd, stdio: 'inherit' }
//     );

//     // if (gitCmd3.code !== 0) {
//     //     console.log("third ", gitCmd3.stderr.toString());
//     // }


// }

run()
