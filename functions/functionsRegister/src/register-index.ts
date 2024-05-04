/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import {onRequest} from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import { StreamChat } from "stream-chat";

const streamChat = StreamChat.getInstance(
  process.env.STREAM_API_KEY!,
  process.env.STREAM_PRIVATE_API_KEY!
);

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

export const register_ooodle_chat = onRequest({ cors: true }, async (request, response): Promise<any>  => {
  logger.info("Hello logs!", {structuredData: true});
  logger.info("param!", {params: request.body});
  //response.send("Hello from Firebase register!");

  const { id, name, image } = request.body;
  if (id == null || id === "" || name == null || name === "") {
    response.status(400).send('input params are not valid...');
    return
  }

  const existingUsers = await streamChat.queryUsers({ id });
  if (existingUsers.users.length > 0) {
    response.status(400).send("User ID taken");
    return 
  } 
  else {
    const r = await streamChat.upsertUser({ id, name, image });
    console.log("response form strema upsert:", r)
    response.status(200).send("Success register!");
    return 
  }
});
