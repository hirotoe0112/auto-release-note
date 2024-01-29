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
プルリクエストのタイトルおよび本文を元にして、簡単に内容をまとめてください。
まとめる際にはITについて詳しくないエンドユーザーでもわかりやすいように、技術的な表現や開発者向けの内容をできるだけ含まないようにしてください。
複数の文章になった場合、改行を含まないでください。` },
    { "role": "user", "content": `プルリクエストのタイトルは「${prTitle}、本文は「${prBody}」です。` },
  ],
  model: "gpt-3.5-turbo-1106",
  max_tokens: 300,
});

console.log(completion.choices[0]);

// Notionデータベースに登録
await NotionClient.pages.create({
  parent: {
    database_id: NotionDatabaseId
  },
  properties: {
    // These properties represent columns in the database (i.e. its schema)
    "changes": {
      type: "title",
      title: [
        {
          type: "text",
          text: { content: completion.choices[0].message.content },
        }
      ],
    },
  }
})