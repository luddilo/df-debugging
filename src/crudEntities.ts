const dialogflow = require("dialogflow")
import Axios from "axios"
import { google } from "googleapis"

import { setTimestamp } from "./helpers"

export function createEntitiesClient(credentials: any) {
  const config = {
    credentials: {
      private_key: credentials.private_key,
      client_email: credentials.client_email,
    },
  }
  return new dialogflow.EntityTypesClient(config)
}

export async function createEntityTypes({
  entitiesClient,
  agent,
  entities,
}: {
  entitiesClient: any
  agent: any
  entities: any[]
}) {
  const formattedParent = entitiesClient.projectAgentPath(agent.projectId)

  const [operation] = await entitiesClient.batchUpdateEntityTypes({
    parent: formattedParent,
    languageCode: "en",
    entityTypeBatchInline: {
      entityTypes: entities.map((entity) => {
        return {
          ...entity,
          kind: entity.type === "COMPOSITE" ? "KIND_LIST" : "KIND_MAP",
        }
      }),
    },
  })

  const [response] = await operation.promise()
  setTimestamp(`Batch created ${entities.length} entities`)
}

async function listEntityTypes(entitiesClient: any, projectId: string) {
  // The path to the agent the entity types belong to.
  const agentPath = entitiesClient.projectAgentPath(projectId)

  const request = {
    parent: agentPath,
  }

  // Call the client library to retrieve a list of all existing entity types.
  const [response] = await entitiesClient.listEntityTypes(request)

  return response
}

export async function deleteAllEntities({
  entitiesClient,
  agent
  
}: {
  entitiesClient: any
  agent: any
}) {
  const entities = await listEntityTypes(entitiesClient, agent.projectId)

  if (entities && entities.length > 0) {
    setTimestamp(
      `Batch-deleteing all ${entities.length} entities for projectId ${agent.projectId}`
    )

    // configure a JWT auth client
    let jwtClient = new google.auth.JWT(
      agent.googleCredentials.client_email,
      undefined,
      agent.googleCredentials.private_key,
      ["https://www.googleapis.com/auth/dialogflow"]
    )

    try {
      const credentials = await jwtClient.authorize()

      await Axios.post(
        `https://dialogflow.googleapis.com/v2/projects/${agent.projectId}/agent/entityTypes:batchDelete`,
        {
          parent: entitiesClient.projectAgentPath(agent.projectId),
          entityTypeNames: entities.map((entity) => entity.name),
        },
        {
          headers: {
            authorization: "Bearer " + credentials.access_token,
          },
        }
      )

      setTimestamp(`${entities.length} entities deleted successfully`)
    } catch (err) {
      throw err
    }
  } else {
    setTimestamp("No entities to delete")
  }
}
