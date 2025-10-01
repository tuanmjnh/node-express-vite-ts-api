import { config } from 'dotenv'
console.log('Environment:', process.env.NODE_ENV)
export const dotenvConfig = async () => await config({ path: process.env.NODE_ENV == 'production' ? '.env' : `.env.${process.env.NODE_ENV || 'development'}` })