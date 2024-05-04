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
import { initializeApp } from "firebase/app";
import {  getFirestore, getDoc, setDoc, doc, updateDoc } from "firebase/firestore"; //, collection, addDoc, getDoc, setDoc, doc


const firebaseConfig = {
  apiKey: "AIzaSyBf6ddgVfBD-UeprIlNwCNcnuS0n4gG2Gs",
  authDomain: "chat-app-demo-bc24b.firebaseapp.com",
  databaseURL: "https://chat-app-demo-bc24b-default-rtdb.firebaseio.com",
  projectId: "chat-app-demo-bc24b",
  storageBucket: "chat-app-demo-bc24b.appspot.com",
  messagingSenderId: "747021367728",
  appId: "1:747021367728:web:2bd63a4a49ea25123cfe75",
  measurementId: "G-L1CD1F9G2S"
}
// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);


// Start writing functions
// https://firebase.google.com/docs/functions/typescript

export const stream_webhook_ooodle_chat = onRequest({ cors: true }, async (request, response) => {
  logger.info("Hello logs!", {structuredData: true});
  logger.info("Stream webhook data!", {body: request.body});


  logger.info("payload all:", request)

  const payload = request?.body //?.jsonPayload?.body

  logger.info("payload:", payload)


  // when user is created - Add users info in users collection
  // when channel is created - add channel info
  // when message is sent - update messages details
  if(payload?.type == "channel.created") {
    logger.info("channel.created: ", payload)

    let channel_id = payload?.channel_id
    let creator_user = payload?.user 
    let members = payload?.members

    // Add a new document in collection "channel" info
    await setDoc(doc(db, "channels_info", channel_id), {
      creator_user: creator_user,
      members: members
    });

  }

  // if(payload?.type == "channel.created") {
  //   logger.info("channel.created: ", payload)
  // }

  if(payload?.type == "message.new") {

    let sender_user_id =  payload?.user?.id
    const channel_id = payload?.channel_id
    logger.info('channel_id value: ', channel_id)

    let userDocRef = doc(db, "users_messages_details", sender_user_id)
    let  docSnap = await getDoc(userDocRef);
    let userDataInfo = docSnap.data()
    logger.info('Before userDataInfo :',userDataInfo)
    
    if(userDataInfo == undefined) {
        await setDoc(doc(db, "users_messages_details", sender_user_id), {});
        userDocRef = doc(db, "users_messages_details", sender_user_id)
        docSnap = await getDoc(userDocRef)
        userDataInfo = docSnap.data()
        logger.info('UsefDataInfo after adding in DB test: ', userDataInfo)
    }
    logger.info('After userDataInfo :', userDataInfo)
    
    if(userDataInfo[channel_id] == undefined) {
        userDataInfo[channel_id] = 0
    }
    
    await updateDoc(userDocRef, {
        [channel_id]: userDataInfo[channel_id] + 1
    });

    // const docRef = await addDoc(collection(db, 'users_messages_details'), {
    //   type: payload?.type,
    //   channel_type: payload?.channel_type,
    //   message_id: payload?.message_id,
    //   sender_user_id: payload?.user?.id,
    //   sender_user_name: payload?.user?.name,
    //   channel_id: payload?.channel_id,
    //   channel: payload?.channel
    // })
    // logger.info("docrefid:", docRef.id)


    // let sender_user_id =  payload?.user?.id
    // const userDocRef = doc(db, "users_messages_details", sender_user_id)
    // const docSnap = await getDoc(userDocRef);
    // let userDataInfo = docSnap.data()
    // console.log('userDataInfo: ', userDataInfo)

    // const channel_id = payload?.channel_id

    // if(userDataInfo == undefined) {
    //   await setDoc(doc(db, "users_messages_details", sender_user_id), {messagesInChannels: {}});
    // }
    // const docSnap1 = await getDoc(userDocRef);
    // let userData = docSnap1.data()
    // console.log('channel_id number: ' , userData?.messagesInChannels.get(channel_id))
    // if (userData?.messagesInChannels.get(channel_id) == undefined) {
    //   console.log('reseeting count')
    //   userData.messagesInChannels[channel_id] = 0
    // }

    //   // Add a new document in collection "cities"
    // await updateDoc(userDocRef, {
    //   messagesInChannels: {
    //     [channel_id]: increment(1)
    //   }
    // });

  }  

  logger.info("hello world!", {body: request.body});
  response.send("Hello from Firebase!");
});
