import { struct } from "pb-util"
import { isEmpty, getSessionClient } from "./helpers"

import { v4 } from "uuid"

export const call = async ({
  googleCredentials,
  sessionId,
  contexts,
  event,
  message,
}: {
  googleCredentials: any
  sessionId?: string
  contexts?: any
  event?: string
  message?: string
}): Promise<any> => {
  let attempts = 0
  const _sessionId = sessionId ? sessionId : v4()
  const sessionClient = getSessionClient(googleCredentials)
  const sessionPath = sessionClient.sessionPath(
    googleCredentials.project_id,
    _sessionId
  )
  const previousContexts = contexts
  let timestampBefore: number
  let timestampAfter: number

  let input: any = event
    ? {
        // Input for EVENTS
        session: sessionPath,
        queryInput: {
          event: {
            name: event,
            languageCode: "en",
          },
        },
      }
    : {
        // Input for MESSAGES
        session: sessionPath,
        queryInput: {
          text: {
            text: message,
            languageCode: "en",
          },
        },
        queryParams: {
          contexts: previousContexts,
        },
      }

  try {
    if (process.env.NODE_ENV == "development") {
      console.log("===== Calling Dialogflow")
    }

    attempts++
    timestampBefore = Date.now()
    let responses = (await sessionClient.detectIntent(input)).filter(Boolean) // Since sometimes, the responses array seems to have two extra, "undefined" values
    timestampAfter = Date.now()

    // If we get an error the first attempt, we do one retry. The nature of cloud functions is unfortunately that slow-starts might take enough time for dialogflow to neglect the webhook call

    let results = responses[0].queryResult

    // Retries if timed out
    while (isEmpty(results.fulfillmentMessages) && attempts < 3) {
      // Max 3 attempts
      attempts++
      if (process.env.NODE_ENV == "development") {
        console.log("===== Got error, trying again")
      }
      timestampBefore = Date.now()
      responses = await sessionClient.detectIntent(input)
      timestampAfter = Date.now()
      results = responses[0].queryResult
    }

    if (isEmpty(results.fulfillmentMessages)) {
      console.log(results)
      return "Error occured: EMPTY RESPONSE"
    } else {
      return results.fulfillmentMessages[0].text.text[0]
    }
  } catch (err) {
    console.log(err)
    return "Error occured: ERROR"
  }
}
