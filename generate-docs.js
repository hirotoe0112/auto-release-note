import { OpenAiSource, NotionClient, NotionDatabaseId } from "./init.js";
import fs from 'fs';

// GitHub Actionsが提供する環境変数からイベント情報を読み込む
const eventPath = process.env.GITHUB_EVENT_PATH;
const eventData = JSON.parse(fs.readFileSync(eventPath, 'utf8'));

// プルリクエストの情報を取得
const prTitle = eventData.pull_request.title;
const prBody = eventData.pull_request.body;

const completion = await OpenAiSource.chat.completions.create({
  messages: [
    {
      "role": "system", "content": `
タイトルおよび本文を元にして、今回変更された内容について簡単にまとめてください。
まとめる際にはITについて詳しくないエンドユーザーでもわかりやすいように、技術的な表現や開発者向けの内容をできるだけ含まないようにしてください。
複数の文章になった場合、改行を含まないでください。` },
    { "role": "user", "content": `タイトルは「${prTitle}、本文は「${prBody}」です。` },
  ],
  model: "gpt-3.5-turbo-1106",
  max_tokens: 300,
});

console.log(completion.choices[0]);

// Notionデータベースに登録
await NotionClient.pages.create({
  parent: {
    type: "database_id",
    database_id: NotionDatabaseId
  },
  properties: {
    changes: {
      type: "title",
      title: [
        {
          text: {
            content: completion.choices[0].message.content
          },
        }
      ],
    },
  }
})