const dialogflow = require("dialogflow")

import { getConfig, setTimestamp, getDialogflowAccessToken } from "./helpers"
import Axios from "axios"

export function createIntentsClient(credentials: any) {
  return new dialogflow.v2.IntentsClient(getConfig(credentials))
}

export async function deleteAllIntents({
  intentsClient,
  projectId,
}: {
  intentsClient: any
  projectId: string
}) {
  const intents = await listIntents(intentsClient, projectId)

  if (intents && intents.length > 0) {
    setTimestamp(`Batch-deleteing all ${intents.length} intents`)

    const intentsWithOnlyNames = intents.map((intent) => {
      return {
        name: intent.name,
      }
    })
    await intentsClient.batchDeleteIntents({
      parent: intentsClient.projectAgentPath(projectId),
      intents: intentsWithOnlyNames,
    })
    setTimestamp(`${intents.length} intents deleted successfully`)
  } else {
    setTimestamp("No intents to delete.")
  }
}

export const createIntents = async (
  intentsClient: any,
  intents: any[],
  agent: any
) => {
  // The path to identify the agent that owns the created intent.
  const agentPath = intentsClient.projectAgentPath(agent.projectId)

  const createIntentsRequest = {
    languageCode: "en",
    parent: agentPath,
    intentBatchInline: { intents },
  }

  const [operation] = await intentsClient.batchUpdateIntents(
    createIntentsRequest
  )

  const result: Array<{
    intents: any[]
  }> = await operation.promise()

  // EXTRA CHECK TO MAKE SURE THE OPERATION IS INDEED COMPLETED...
  try {
    const accessToken = await getDialogflowAccessToken(
      agent.googleCredentials
    )

    const operationCheckResult = await Axios.get(
      `https://dialogflow.googleapis.com/v2/${(result as any)[2].name}`,
      {
        headers: {
          authorization: "Bearer " + accessToken,
        },
      }
    )

    if (!operationCheckResult.data.done) { // Verifying that the operation is completed
      console.log("!!!!!!!!!!! OPERATION FOR BATCH UPDATE INTENTS NOT COMPLETED...", operationCheckResult.data);
    } 
  } catch (err) {
    throw err
  }
}

async function listIntents(intentsClient: any, projectId: string) {
  // The path to identify the agent that owns the intents.
  const projectAgentPath = intentsClient.projectAgentPath(projectId)

  const request = {
    parent: projectAgentPath,
    intentView: "INTENT_VIEW_FULL",
  }

  // Send the request for listing intents.
  const [response] = await intentsClient.listIntents(request)

  // Filter out the fallback intent, and knowledge base intent
  const intents = response.filter((intent: any) => {
    return (
      intent.displayName != "Default Fallback Intent" &&
      intent.displayName.substring(0, 9) != "Knowledge"
    )
  })

  return intents
}
