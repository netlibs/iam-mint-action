const homedir = require('os').homedir();
const fs = require('fs');
const core = require('@actions/core');
const github = require('@actions/github');
const fetch = require('node-fetch');

const awsDir = `${homedir}/.aws`;

async function main() {

  const token = core.getInput('token');
  const actor = core.getInput('actor');
  const endpoint = core.getInput('endpoint');
  const project = core.getInput('project');
  const region = core.getInput('region');
  const profile = core.getInput('profile');

  if (!fs.existsSync(awsDir)){
    fs.mkdirSync(awsDir);
  }

  await fs.promises.writeFile(`${awsDir}/config`, `[${profile}]\nregion=${region}\n`);

  const res = await fetch(endpoint, { 
    method: 'post', 
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ token, project, actor })
  });

  if (res.status != 200) 
    throw new Error(`failed to mint token`);

  const body = await res.json();

  const credentials = body.credentials;
  credentials.Version = 1;
  
  let credProc;
  let credStr = JSON.stringify(credentials);
  if (process.platform === 'win32') {
    let credStr64 = (new Buffer.from(credStr)).toString('base64');
    credProc = `"C:\\Program Files\\PowerShell\\7\\pwsh.EXE" -command "[System.Text.Encoding]::ASCII.GetString([System.Convert]::FromBase64String('${credStr64}'))"`;
  } else {
    credProc = `/bin/echo '${credStr}'`;
  }

  await fs.promises.writeFile(`${awsDir}/credentials`, `[${profile}]\ncredential_process = ${cmd}\n`);

  core.setSecret(credentials.SecretAccessKey);
  core.setSecret(credentials.SessionToken);

}

main().catch(e => core.setFailed(e.message));


