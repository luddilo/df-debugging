import { call } from "./call"
import { v4 } from "uuid"
import { sleep } from "./helpers"

export async function checkAlive(agent) {
  let response: string | undefined = undefined

  console.log("Verifying that Agent is ready")

  const sessionId = v4()

  let count = 0
  // Check every 1 seconds if our agent is ready
  while (!response || response !== "ALIVE") {
    console.log("===\nALIVE-checking [attempt " + ++count + "]")

    response = await call({
      googleCredentials: agent.googleCredentials,
      message: "alive check",
      contexts: [
        {
          name: `projects/${agent.googleCredentials.project_id}/agent/sessions/${sessionId}/contexts/aliveCheck`,
          lifespanCount: 1,
        },
      ],
      sessionId,
    })

    console.log(response)

    await sleep(1000)
  }

  console.log("=====\nAgent is READY after " + count  + " attemts")
}
