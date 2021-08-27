const core = require('@actions/core');
const simpleOctokit = require('simple-octokit');
const fs = require('fs');

const fetch_repo_info_with_topics = async (octokit, repository) => {
  const html_url = repository.html_url;
  const description = repository.description;

  const owner = repository.owner.login;
  const repo = repository.name;
  const topics = await octokit.repos.getAllTopics({ owner, repo });

  return {
    name: repo,
    url: html_url,
    description,
    topics: topics.data.names
  };
};

const fetch_repo_info_with_language = (octokit, repository) => {
  const html_url = repository.html_url;
  const description = repository.description;
  const repo = repository.name;
  const language = repository.language;

  return {
    name: repo,
    url: html_url,
    description,
    language
  };
};

// take so many times...
const fetch_starred_repos_with_topics = async (octokit, username) => {
  let result = [];
  for await (const response of octokit.activity.listReposStarredByUser.all({ username })) {
    for (const repo of response.data) {
      try {
        const repo_info = await fetch_repo_info_with_topics(octokit, repo);
        result.push(repo_info);
        console.log(`[DONE] ${repo.name}`);
      } catch (error) {
        continue;
      }
    }
  }
  return result;
};

const fetch_starred_repos_with_language = async (octokit, username) => {
  let result = [];
  for await (const response of octokit.activity.listReposStarredByUser.all({ username })) {
    for (const repo of response.data) {
      try {
        const repo_info = fetch_repo_info_with_language(octokit, repo);
        result.push(repo_info);
        console.log(`[DONE] ${repo.name}`);
      } catch (error) {
        continue;
      }
    }
  }
  return result;
};

const upsert = (map, key, value) => {
  if (map.has(key)) {
    let obj = map.get(key);
    obj.push(value);
    map.set(key, obj);
  } else {
    map.set(key, [value]);
  }
};

const sorted_map_keys = (map) => {
  let keys = [];
  for (const key of map.keys()) {
    keys.push(key);
  }
  return keys.sort((a, b) => { 
    if (a > b) return 1;
    if (a < b) return -1;
    return 0;
  });
}

const convert_maps_to_toc_markdown = (map) => {
  let sorted_keys = sorted_map_keys(map);
  let toc = ['## Contents\n'];
  for (const key of sorted_keys) {
    const group = `- [${key}](#${key})`;
    toc.push(group);
  }
  return toc.join('\n');
};

const convert_group_to_h2_markdown = (group_key, group_value) => {
  let toc = [`## ${group_key}\n`];
  for (const repo of group_value) {
    const group = `- [${repo.name}](${repo.url}) - ${repo.description}`;
    toc.push(group);
  }
  return toc.join('\n');
}

(async () => {
  try {
    const owner = core.getInput('owner');
    const myToken = core.getInput('github-token');
    const groupBy = core.getInput('group-by');
    const octokit = simpleOctokit(myToken);

    // const response = await octokit.rateLimit.get();
    // console.log(JSON.stringify(response.data, null, 2));

    const topicMap = new Map();

    if (groupBy === 'topic') {
      const repos = await fetch_starred_repos_with_topics(octokit, owner);
      for (const repo of repos) {
        if (repo.topics.length == 0) {
          upsert(topicMap, 'etc', repo);
        } else {
          for (const topic of repo.topics) {
            upsert(topicMap, topic, repo);
          }
        }
      }
    } else {
      const repos = await fetch_starred_repos_with_language(octokit, owner);
      for (const repo of repos) {
        if (repo.language) {
          upsert(topicMap, repo.language, repo);
        } else {
          upsert(topicMap, 'etc', repo);
        }
      }
    }
    

    let markdown = ['<div align="center"><img width="500" height="350" src="https://raw.githubusercontent.com/skyfe79/awesome-readme-generator/main/media/logo.svg" alt="Awesome"><br><br><hr></div>\n\n'];
    const toc = convert_maps_to_toc_markdown(topicMap);
    markdown.push(toc);

    const sorted_keys = sorted_map_keys(topicMap);
    for (const group_name of sorted_keys) {
      // skip etc to append at the end
      if (group_name == 'etc') { continue; }
      const group_value = topicMap.get(group_name);
      const group = convert_group_to_h2_markdown(group_name, group_value);
      markdown.push(group);
    }

    if (topicMap.has('etc')) {
      const group_name = 'etc';
      const group_value = topicMap.get(group_name);
      const group = convert_group_to_h2_markdown(group_name, group_value);
      markdown.push(group);
    }

    const result = markdown.join("\n\n");
    fs.writeFileSync('README.md', result);

    // const readme = fs.readFileSync('README.md', 'utf-8');
    // console.log(readme);

  } catch (error) {
    core.setFailed(error.message);
  }
})();