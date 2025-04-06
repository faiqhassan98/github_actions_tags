const core = require('@actions/core');
const github = require('@actions/github');
const fetch = require('node-fetch');

async function run() {
  try {
    // Get the input tag and remove 'refs/tags/' if present
    let tag = core.getInput('tag');
    tag = tag.replace(/^refs\/tags\//, ''); // Remove 'refs/tags/' prefix

    // Get the releases URL from the GitHub context
    const releasesUrl = github.context.payload.repository.releases_url.replace('{/id}', '');

    // Issue a GET request to the releases URL
    const response = await fetch(releasesUrl, {
      headers: {
        'Authorization': `token ${process.env.GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch releases: ${response.status} ${response.statusText}`);
    }

    const releases = await response.json();

    // Check if a release with the tag exists
    const release = releases.find(release => release.tag_name === tag);

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