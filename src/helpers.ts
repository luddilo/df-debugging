import { google } from "googleapis"
import dialogflow from "dialogflow"
import { struct } from "pb-util"

export function getConfig(credentials: any) {
  return {
    credentials: {
      private_key: credentials.private_key,
      client_email: credentials.client_email,
    },
  }
}

let timestamp: number = Date.now()

export const setTimestamp = (message: string) => {
  console.log(`[${Date.now() - timestamp}ms]`, message)
  timestamp = Date.now()
}

export function isEmpty(obj: Object) {
  return Object.keys(obj).length === 0
}

export const getDialogflowAccessToken = async (googleCredentials: any) => {
  // configure a JWT auth client
  try {
    let jwtClient = new google.auth.JWT(
      googleCredentials.client_email,
      undefined,
      googleCredentials.private_key,
      ["https://www.googleapis.com/auth/dialogflow"]
    )
    const credentials = await jwtClient.authorize()
    return credentials.access_token
  } catch (err) {
    throw err
  }
}

export const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms))

let sessionClient

export const getSessionClient = (googleCredentials: any) => {
  if (!sessionClient) {
    sessionClient = new dialogflow.SessionsClient({
      credentials: googleCredentials,
    })
  }
  return sessionClient
}
