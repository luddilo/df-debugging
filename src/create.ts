
import {
    createEntitiesClient,
    createEntityTypes,
    deleteAllEntities,
  } from "./crudEntities"
  import {
    createIntents,
    createIntentsClient,
    deleteAllIntents,
  } from "./crudIntents"
  import { trainAgent } from "./trainAgent"
  import { setTimestamp } from "./helpers"
  

  const intents = require("../INTENTS.json")
  const entities = require("../ENTITIES.json")
  
  export const create = async (agent: any) => {
    const entitiesClient = await createEntitiesClient(agent.googleCredentials)
  
    const intentsClient = await createIntentsClient(agent.googleCredentials)
  
    await deleteAllIntents({ intentsClient, projectId: agent.projectId })
    await deleteAllEntities({ entitiesClient, agent })
  
    const createPromises: Promise<any>[] = [
      createIntents(intentsClient, intents, agent),
      createEntityTypes({ entitiesClient, entities, agent }),
    ]
  
    const results = await Promise.all(createPromises)
  
    const postProcessPromises: Promise<any>[] = []
  
    postProcessPromises.push(trainAgent(agent))
  
    await Promise.all(postProcessPromises)
  
    setTimestamp("Create completed")
  }
  