import { create } from "./create"
import { checkAlive } from "./aliveCheck"

const agent = {
  googleCredentials: require("../google_credentials.json"),
  projectId: "testing-region-yxkvby",
}

const run = async () => {
  await create(agent)
  await checkAlive(agent)
  console.log("done")
}

run()
