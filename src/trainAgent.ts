const dialogflow = require("dialogflow")
import Axios from "axios"

import { getConfig, setTimestamp, getDialogflowAccessToken } from "./helpers"

export const trainAgent = async (agent: any) => {
  setTimestamp(`Training agent ${agent.projectId}`)

  const client = new dialogflow.v2.AgentsClient(getConfig(agent.googleCredentials))

  
  try {
    await Axios.post(
      `https://dialogflow.googleapis.com/v2/projects/${agent.projectId}/agent:train`,
      {
        parent: client.projectPath(agent.projectId),
      },
      {
        headers: {
          authorization: "Bearer " + await getDialogflowAccessToken(agent.googleCredentials),
        },
      }
    )

    setTimestamp(`Agent ${agent.projectId} trained successfully`)
  } catch (err) {
    throw err
  }
}
