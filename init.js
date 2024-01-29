import OpenAI from "openai"
import { Client } from "@notionhq/client"
import 'dotenv/config'

export const OpenAiSource = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export const NotionClient = new Client({
  auth: process.env.NOTION_API_KEY
})

export const NotionDatabaseId = process.env.NOTION_DATABASE_ID