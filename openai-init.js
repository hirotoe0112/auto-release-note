import OpenAI from "openai"
import 'dotenv/config'

export const OpenAiSource = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})