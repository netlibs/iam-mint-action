const core = require('@actions/core');
const github = require('@actions/github');

try {

  // `who-to-greet` input defined in action metadata file
  const token = core.getInput('token');
  const endpoint = core.getInput('endpoint');
  const project = core.getInput('project');

  console.log(`${token} / ${endpoint} / ${project}`);

  core.setOutput("time", time);

  // Get the JSON webhook payload for the event that triggered the workflow
  const payload = JSON.stringify(github.context.payload, undefined, 2)
  console.log(`The event payload: ${payload}`);

} catch (error) {

  core.setFailed(error.message);

}