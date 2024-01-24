import { OpenAiSource } from "./openai-init.js";
import fs from 'fs';

// GitHub Actionsが提供する環境変数からイベント情報を読み込む
const eventPath = process.env.GITHUB_EVENT_PATH;
console.log(eventPath)
const eventData = JSON.parse(fs.readFileSync(eventPath, 'utf8'));
console.log(eventData)

// プルリクエストの情報を取得
const prTitle = eventData.pull_request.title;
console.log(prTitle)
//console.log(process.env.PR_TITLE)
//console.log(process.env.PR_BODY)
const prBody = eventData.pull_request.body;
console.log(prBody)
//const commits = eventData.commits.map(commit => commit.message);
//console.log(commits)

// ここで取得した情報を利用してドキュメントを生成するなどの処理を行う
