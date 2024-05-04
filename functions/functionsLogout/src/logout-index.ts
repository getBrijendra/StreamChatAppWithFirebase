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

const TOKEN_USER_ID_MAP = new Map<string, string>();

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

export const logout_ooodle_chat = onRequest({ cors: true }, async (request, response): Promise<any> => {
  logger.info("Hello logs!", {structuredData: true});
  logger.info("params!", {params: request.body});
  //response.send("Hello from Firebase logout!");

  const token = request.body.token;
    if (token == null || token === "") return response.status(400).send('user token is null');

    const id = TOKEN_USER_ID_MAP.get(token);
    if (id == null) return response.status(400).send('user id sent is null');

    await streamChat.revokeUserToken(id, new Date());
    TOKEN_USER_ID_MAP.delete(token);
    return response.status(200).send('logout successful!');
});
