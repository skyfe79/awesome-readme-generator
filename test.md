ncc: Version 0.29.0
ncc: Compiling file index.js into CJS
 34kB  dist/licenses.txt
249kB  dist/index.js
283kB  [743ms] - ncc 0.29.0
[main.yml/Generate Awesome Readme.md from starred repos.] 🚀  Start image=nektos/act-environments-ubuntu:18.04
[main.yml/Generate Awesome Readme.md from starred repos.]   🐳  docker run image=nektos/act-environments-ubuntu:18.04 platform= entrypoint=["/usr/bin/tail" "-f" "/dev/null"] cmd=[]
[main.yml/Generate Awesome Readme.md from starred repos.]   🐳  docker exec cmd=[mkdir -m 0777 -p /var/run/act] user=root
[main.yml/Generate Awesome Readme.md from starred repos.]   🐳  docker cp src=/Users/burt/github/skyfe79/awesome-readme-generator/. dst=/Users/burt/github/skyfe79/awesome-readme-generator
[main.yml/Generate Awesome Readme.md from starred repos.]   🐳  docker exec cmd=[mkdir -p /Users/burt/github/skyfe79/awesome-readme-generator] user=
[main.yml/Generate Awesome Readme.md from starred repos.] ⭐  Run checkout
[main.yml/Generate Awesome Readme.md from starred repos.]   ✅  Success - checkout
[main.yml/Generate Awesome Readme.md from starred repos.] ⭐  Run Fetch starred respos and generate Readme.md markdowns
[main.yml/Generate Awesome Readme.md from starred repos.]   🐳  docker exec cmd=[node /Users/burt/github/skyfe79/awesome-readme-generator/dist/index.js] user=
[main.yml/Generate Awesome Readme.md from starred repos.]   | [DONE] geopattern
[main.yml/Generate Awesome Readme.md from starred repos.]   | [DONE] prettymaps
[main.yml/Generate Awesome Readme.md from starred repos.]   | [DONE] WKWebViewJavascriptBridge
[main.yml/Generate Awesome Readme.md from starred repos.]   | [DONE] EasyTipView
[main.yml/Generate Awesome Readme.md from starred repos.]   ❗  ::error::key.replaceAll is not a function
[main.yml/Generate Awesome Readme.md from starred repos.]   ❌  Failure - Fetch starred respos and generate Readme.md markdowns
