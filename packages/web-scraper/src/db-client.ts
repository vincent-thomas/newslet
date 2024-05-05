import {createClient} from "@newslet/db"
import { env } from "./env"

export const db = createClient({url: env.DATABASE_URL, authToken: env.DATABASE_TOKEN})