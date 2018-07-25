/*
 Licensed to the Apache Software Foundation (ASF) under one
 or more contributor license agreements.  See the NOTICE file
 distributed with this work for additional information
 regarding copyright ownership.  The ASF licenses this file
 to you under the Apache License, Version 2.0 (the
 "License"); you may not use this file except in compliance
 with the License.  You may obtain a copy of the License at
 
 http://www.apache.org/licenses/LICENSE-2.0
 
 Unless required by applicable law or agreed to in writing,
 software distributed under the License is distributed on an
 "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 KIND, either express or implied.  See the License for the
 specific language governing permissions and limitations
 under the License.
 */


 const util = require('util');
 const path = require('path');
 const os = require('os');
 const fs = require('fs');
 const process = require('process');
 const child_process = require('child_process');
 const rimraf = util.promisify(require('rimraf'));
 const exec = util.promisify(child_process.exec);

async function test_platform(platform, version) {
    console.log(`Test Platform: ${platform}@${version}`);
    const appLinkTo = path.join(__dirname, 'test_www_assets');
    const appId = `com.cordova.plugin.ibeacon.${platform}.v${version.replace(/\./g, '_')}.testApp`;
    const appName = `IBeaconTest-${platform}-${version}`;
    const appPath = path.join(os.tmpdir(), appName);
    const pluginPath = path.join(__dirname, '..');

    try {
        console.log(`\tCreate Cordova Project`);
        const createCmd = `cordova create "${appPath}"  "${appId}" "${appName}" --link-to "${appLinkTo}"`
        const createOptions = {}
        await stepExec(createCmd, createOptions);

        console.log(`\tAdd Platform`);
        const platformCmd = `cordova platform add ${platform}@${version}`;
        const platformOpts = { cwd: appPath };
        await stepExec(platformCmd, platformOpts);
        
        console.log(`\tAdd Plugin`);
        await stepExec(`cordova plugin add "${pluginPath}"`, {cwd: appPath});
        
        console.log(`\tRun App`);
        await stepExec(`cordova run ${platform}`, {cwd: appPath});
        // todo: capture test output
    }
    catch(exception) {
        console.log(`\tException: `, JSON.stringify(exception));
    }
    finally {
        // todo: clean up test app
        console.log(`\tClean Up: ${appPath}`);
        //await rimraf(appPath);
        return 0;
    }
}

async function stepExec(command, options) {
        console.log(`\t\tCommand`, command);
        console.log(`\t\tOptions`, options);
        const result = await exec(command, options);
        console.log('\t\tStdOut\n\t\t\t', result.stdout.replace(/\n/g, "\n\t\t\t"));
        console.log('\t\tStdErr\n\t\t\t', result.stderr.replace(/\n/g, "\n\t\t\t"));
        return result;
}

function spawn(command, options) {
    let child = child_process.spawn(command, options);
    child.promise = new Promise((resolve, reject) => {
        child.on('error', reject);
        child.on('exit', code => (code === 0) ? resolve(code) : reject(code));
    });
    return child;
}


async function main() {
  await test_platform('android', '6.3.0');
  // only run ios tests on ios platform.
  if (process.platform == 'darwin') {

  }

//   checkIfBinaryIsAvailable('node');
//   checkIfBinaryIsAvailable('npm');
//   checkIfBinaryIsAvailable('cordova');
//   checkIfBinaryIsAvailable('xcodebuild');
//   createCordovaProject().then((exitCode) => addPlatforms().then((exitCode) =>
//   addPlugin().then((exitCode) => openInXCode().then((exitCode) {
//     print('Press any key to clean up the resources on the file-system.');
//     stdin.readLineSync(encoding: UTF8, retainNewlines: true);
//     print('Deleting $tmpDir recursively...');
//     tmpDir.deleteSync(recursive: true);
//     print('Test runner finished.');
//   }))));

}


// Future<int> openInXCode() {
//   print('Opening generated test project in XCode.');
//   return _runProcess('open', [xcodeProjFile.path], workingDirectory:
//   xcodeProjFile.parent.path);
// }

if (require.main === module) {
    main()
        .then((result) => { console.log('result', JSON.stringify(result)); })
        //.catch((error) => { console.log('error', JSON.stringify(error)); });
}