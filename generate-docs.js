import { OpenAiSource } from "./openai-init.js";
import fs from 'fs';

// GitHub Actionsが提供する環境変数からイベント情報を読み込む
const eventPath = process.env.GITHUB_EVENT_PATH;
const eventData = JSON.parse(fs.readFileSync(eventPath, 'utf8'));

// プルリクエストの情報を取得
const prTitle = eventData.pull_request.title;
const prBody = eventData.pull_request.body;

// ここで取得した情報を利用してドキュメントを生成するなどの処理を行う
const completion = await OpenAiSource.chat.completions.create({
  messages: [
    { "role": "system", "content": "プルリクエストのタイトルおよび本文から、エンドユーザー向けに最適化されたリリースノートを生成してください。技術的な表現や開発者向けの内容が含まれる場合がありますが、エンドユーザーが読んでもわかりやすい文章にしてください。" },
    { "role": "user", "content": `プルリクエストのタイトルは「${prTitle}、本文は「${prBody}」です。` },
  ],
  model: "gpt-3.5-turbo-1106",
  max_tokens: 150,
});

console.log(completion.choices[0]);