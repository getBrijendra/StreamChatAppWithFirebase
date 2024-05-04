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

// const STREAM_API_KEY='fsm2c4ka2a46' 
// const STREAM_PRIVATE_API_KEY='37rs5w3bab9gekk5av55g59d8s49wspm94d7sqwvtk9euxwzed34khvh8rau6npn'
// const streamChat = StreamChat.getInstance(
//   STREAM_API_KEY,
//   STREAM_PRIVATE_API_KEY
// );

const TOKEN_USER_ID_MAP = new Map<string, string>();
// Start writing functions
// https://firebase.google.com/docs/functions/typescript

export const login_ooodle_chat = onRequest({ cors: true }, async (request, response): Promise<any> => {
  logger.info("Hello logs!", {structuredData: true});
  logger.info("req data!", {body: request.body});
  //response.send("Hello from Firebase Login!");

  const { id } = request.body;
    if (id == null || id === "") {
      response.status(400).send("user id is not null...");
      return;
    }

    const {
      users: [user],
    } = await streamChat.queryUsers({ id });
    console.log(user)
    if (user == null) {
      response.status(401).send("not able to find stream chat users...");
      return
    }

    const token = streamChat.createToken(id);
    TOKEN_USER_ID_MAP.set(token, user.id);

    response.status(200).send( {
      token,
      user: { name: user.name, id: user.id, image: user.image },
    })
    return 
});
