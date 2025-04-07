const core = require('@actions/core');
const github = require('@actions/github');

async function run() {
  try {
    // Get the input tag and remove 'refs/tags/' if present
    let tag = core.getInput('tag');
    tag = tag.replace(/^refs\/tags\//, '');

    // Setup Octokit with auth
    const token = process.env.GITHUB_TOKEN;
    const octokit = github.getOctokit(token);

    const { owner, repo } = github.context.repo;

    // List all releases
    const releases = await octokit.rest.repos.listReleases({
      owner,
      repo,
    });

    // Check for a release matching the tag
    const release = releases.data.find(r => r.tag_name === tag);

    if (release) {
      core.info(`✅ Release for tag "${tag}" exists: ${release.html_url}`);
    } else {
      core.setFailed(`❌ No release found for tag "${tag}".`);
    }

  } catch (error) {
    core.setFailed(`Error: ${error.message}`);
  }
}

run();