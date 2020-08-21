# How to run

1. Paste in Google credentials with DF admin role access into google_credentials.json in the root
2. `npm install`
3. `npm start`

The script will remove all intents and entities in the agent, recreate them, train the agent and finally call the agent with a special "alive check" intent that simply will reply the text "ALIVE" once it's ready. 

## Observed errors

1. Empty response:

{
  fulfillmentMessages: [],
  outputContexts: [],
  queryText: 'alive check',
  speechRecognitionConfidence: 0,
  action: '',
  parameters: { fields: {} },
  allRequiredParamsPresent: false,
  fulfillmentText: '',
  webhookSource: '',
  webhookPayload: null,
  intent: null,
  intentDetectionConfidence: 0,
  diagnosticInfo: null,
  languageCode: 'en',
  sentimentAnalysisResult: null
}

2. Error:

Error: 9 FAILED_PRECONDITION: Intent with id '7af00989-1e7e-48ce-a717-b46638b74b1c' not found among intents in environment '' for agent with id '3ca8a68a-d9f3-429c-9358-9a2c216c6c0f'.
com.google.apps.framework.request.StatusException: <eye3 title='FAILED_PRECONDITION'/> generic::FAILED_PRECONDITION: Intent with id '7af00989-1e7e-48ce-a717-b46638b74b1c' not found among intents in environment '' for agent with id '3ca8a68a-d9f3-429c-9358-9a2c216c6c0f'.
    at Object.callErrorFromStatus (/home/luddilo/dev/df-debugging/node_modules/@grpc/grpc-js/build/src/call.js:30:26)
    at Object.onReceiveStatus (/home/luddilo/dev/df-debugging/node_modules/@grpc/grpc-js/build/src/client.js:175:52)
    at Object.onReceiveStatus (/home/luddilo/dev/df-debugging/node_modules/@grpc/grpc-js/build/src/client-interceptors.js:341:141)
    at Object.onReceiveStatus (/home/luddilo/dev/df-debugging/node_modules/@grpc/grpc-js/build/src/client-interceptors.js:304:181)
    at Http2CallStream.outputStatus (/home/luddilo/dev/df-debugging/node_modules/@grpc/grpc-js/build/src/call-stream.js:116:74)
    at Http2CallStream.maybeOutputStatus (/home/luddilo/dev/df-debugging/node_modules/@grpc/grpc-js/build/src/call-stream.js:155:22)
    at Http2CallStream.endCall (/home/luddilo/dev/df-debugging/node_modules/@grpc/grpc-js/build/src/call-stream.js:141:18)
    at Http2CallStream.handleTrailers (/home/luddilo/dev/df-debugging/node_modules/@grpc/grpc-js/build/src/call-stream.js:273:14)
    at ClientHttp2Stream.emit (events.js:315:20)
    at emit (internal/http2/core.js:297:8) {
  code: 9,
  details: "Intent with id '7af00989-1e7e-48ce-a717-b46638b74b1c' not found among intents in environment '' for agent with id '3ca8a68a-d9f3-429c-9358-9a2c216c6c0f'.\n" +
    "com.google.apps.framework.request.StatusException: <eye3 title='FAILED_PRECONDITION'/> generic::FAILED_PRECONDITION: Intent with id '7af00989-1e7e-48ce-a717-b46638b74b1c' not found among intents in environment '' for agent with id '3ca8a68a-d9f3-429c-9358-9a2c216c6c0f'.",
  metadata: Metadata {
    internalRepr: Map { 'grpc-server-stats-bin' => [Array] },
    options: {}
  }
}
