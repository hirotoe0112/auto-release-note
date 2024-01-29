import { OpenAiSource } from "./openai-init.js";
import fs from 'fs';

// GitHub Actionsが提供する環境変数からイベント情報を読み込む
const eventPath = process.env.GITHUB_EVENT_PATH;
const eventData = JSON.parse(fs.readFileSync(eventPath, 'utf8'));

// プルリクエストの情報を取得
const prTitle = eventData.pull_request.title;
const prBody = eventData.pull_request.body;

const completion = await OpenAiSource.chat.completions.create({
  messages: [
    { "role": "system", "content": "プルリクエストのタイトルおよび本文を元にして、リリースノートを作成してください。リリースノートはITについて詳しくないエンドユーザーでもわかりやすいように、技術的な表現や開発者向けの内容をできるだけ含まないようにしてください。" },
    { "role": "user", "content": `バージョンは「${process.env.npm_package_version}」、プルリクエストのタイトルは「${prTitle}、本文は「${prBody}」です。` },
  ],
  model: "gpt-3.5-turbo-1106",
  max_tokens: 300,
});

console.log(completion.choices[0]);