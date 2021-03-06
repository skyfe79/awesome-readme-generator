# awesome-readme-generator

Generate Awesome Readme.md from your Github starred repos ;)

## Example

### Generate Awesome README.md by language

- [Awesome](https://github.com/skyfe79/Awesome/blob/main/README.md)

### Generate Awesome README.md by topics

- [Awesome by topics](https://github.com/skyfe79/Awesome/blob/main/README-BY-TOPICS.md)

## Usage

This is workflow example:

```yml
name: "Generate Awesome Readme.md"
on:
  schedule:
    - cron: '0 23 * * 0'
  workflow_dispatch:
    
jobs:
  generate_awesome_readme_job:
    runs-on: ubuntu-latest
    name: Generate Awesome Readme.md from starred repos.
    steps:
      - name: checkout
        uses: actions/checkout@v1
      - name: Fetch starred respos and generate Readme.md markdowns
        uses: skyfe79/awesome-readme-generator@v1.0
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
          owner: 'skyfe79'
          group-by: 'language'
      - name: Commit files
        run: |
          git config --local user.email "skyfe79@gmail.com"
          git config --local user.name "sungcheol kim"
          git add .
          git commit -m "Add changes"
      - name: Push changes
        uses: ad-m/github-push-action@master
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          branch: ${{ github.ref }}
```

## Inputs

```
github-token:
  description: 'github token'
  required: true
owner:
  description: 'owner name'
  required: true
group-by:
  description: 'Group repos by language or topics.'
  default: 'language'
  required: true
```

`Caution:` If you generate README.md by topics, it takes so many times and Github API limits(or Quota) because it requests repo's topics one by one.