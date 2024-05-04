
import {onRequest} from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import { initializeApp } from "firebase/app";
import {  getFirestore, getDoc, setDoc, doc, updateDoc, increment, runTransaction, arrayUnion, collection, addDoc  } from "firebase/firestore"; //, collection, addDoc, getDoc, setDoc, doc


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

const Test = async (data) => {
  const payload = data // request?.body //?.jsonPayload?.body

  if(payload?.type == "channel.created") {
    logger.info("channel.created: ", payload)
  }

  if(payload?.type == "message.new") {

    let sender_user_id =  payload?.user?.id
    const channel_id = payload?.channel_id
    console.log('channel_id value: ', channel_id)

    let userDocRef = doc(db, "users_messages_details", sender_user_id)
    let  docSnap = await getDoc(userDocRef);
    let userDataInfo = docSnap.data()
    console.log('Before userDataInfo :',userDataInfo)
    
    if(userDataInfo == undefined) {
        await setDoc(doc(db, "users_messages_details", sender_user_id), {});
        userDocRef = doc(db, "users_messages_details", sender_user_id)
        docSnap = await getDoc(userDocRef)
        userDataInfo = docSnap.data()
    }
    console.log('After userDataInfo :', userDataInfo)
    
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


    
    
    // console.log('userDataInfo: ', userDataInfo)



    // if(userDataInfo == undefined) {
    //     const userDocRef = await addDoc(collection(db, 'users_messages_details'), {
    //         sender_user_id: sender_user_id,
    //         messagesInChannels: {}
    //     })
    //     logger.info("docrefid:", userDocRef)
    //     //userDocRef = await setDoc(doc(db, "users_messages_details", sender_user_id), {messagesInChannels: new Map()});
    // }
    // const docSnap1 = await getDoc(userDocRef);
    // let userData = docSnap1.data()
    // console.log('userData: ', userData)
    // //console.log('channel_id number: ' , userData?.messagesInChannels[channel_id])
    // if (userData?.messagesInChannels[channel_id] == undefined) {
    //     userData.messagesInChannels[channel_id] = 0
    // }
    // userData.messagesInChannels[channel_id] =  parseInt(userData.messagesInChannels[channel_id]) + 1

    // if(userData?.messagesInChannels?[channel_id] == undefined) {
    //   console.log('reseeting count')
    //   userData.messagesInChannels[channel_id] =  0
      
    // }

    //   // Add a new document in collection "cities"
    // await updateDoc(userDocRef, {
    //   messagesInChannels: {
    //     channel_id: userData?.messagesInChannels?.channel_id + 1
    //   }
    // }, { merge: true });
  }
  console.log('Done')  
  return 
};

const data = {
    "type": "message.new",
    "created_at": "2024-02-16T09:30:44.289542527Z",
    "members": [
      {
        "user": {
          "last_active": "2024-02-05T13:59:20.957805Z",
          "created_at": "2024-02-05T08:25:34.762042Z",
          "unread_channels": 1,
          "unread_count": 11,
          "banned": false,
          "channel_last_read_at": "2024-02-07T06:16:58.76373504Z",
          "id": "brijendrakumariitrgmailcom",
          "channel_unread_count": 11,
          "online": false,
          "name": "Brijendra",
          "role": "user",
          "updated_at": "2024-02-05T08:25:34.762042Z",
          "image": "",
          "total_unread_count": 11
        },
        "notifications_muted": false,
        "role": "member",
        "created_at": "2024-02-07T06:16:58.750362Z",
        "user_id": "brijendrakumariitrgmailcom",
        "channel_role": "channel_member",
        "updated_at": "2024-02-07T06:16:58.750362Z",
        "shadow_banned": false,
        "status": "member",
        "banned": false
      },
      {
        "role": "owner",
        "notifications_muted": false,
        "updated_at": "2024-02-07T06:16:58.750362Z",
        "banned": false,
        "status": "member",
        "shadow_banned": false,
        "created_at": "2024-02-07T06:16:58.750362Z",
        "user": {
          "banned": false,
          "channel_last_read_at": "2024-02-16T09:30:39.617233152Z",
          "image": "",
          "name": "Brij",
          "channel_unread_count": 0,
          "unread_channels": 0,
          "role": "user",
          "created_at": "2024-02-07T06:16:13.036285Z",
          "updated_at": "2024-02-07T06:16:13.036285Z",
          "total_unread_count": 0,
          "unread_count": 0,
          "online": true,
          "last_active": "2024-02-16T09:30:20.433783344Z",
          "id": "brijooolabscom"
        },
        "user_id": "brijooolabscom",
        "channel_role": "channel_member"
      },
      {
        "created_at": "2024-02-07T06:16:58.750362Z",
        "user": {
          "name": "white-haze-6",
          "unread_count": 18,
          "online": false,
          "unread_channels": 3,
          "image": "https://getstream.io/random_png/?id=white-haze-6&name=white-haze-6",
          "role": "user",
          "id": "white-haze-6",
          "created_at": "2024-01-23T11:51:08.886178Z",
          "banned": false,
          "channel_last_read_at": "2024-02-07T06:16:58.76373504Z",
          "last_active": "2024-01-24T09:12:05.357528Z",
          "channel_unread_count": 11,
          "updated_at": "2024-01-23T11:51:08.887667Z",
          "total_unread_count": 18
        },
        "channel_role": "channel_member",
        "updated_at": "2024-02-07T06:16:58.750362Z",
        "role": "member",
        "status": "member",
        "user_id": "white-haze-6",
        "notifications_muted": false,
        "banned": false,
        "shadow_banned": false
      },
      {
        "shadow_banned": false,
        "status": "member",
        "notifications_muted": false,
        "role": "member",
        "updated_at": "2024-02-07T06:16:58.750362Z",
        "created_at": "2024-02-07T06:16:58.750362Z",
        "user": {
          "id": "winartoawimailinatorcom",
          "name": "Winarto Wijaya",
          "updated_at": "2024-02-06T13:43:13.329001Z",
          "unread_channels": 1,
          "last_active": "2024-02-06T17:44:41.216334Z",
          "created_at": "2024-02-06T13:43:13.329001Z",
          "channel_unread_count": 11,
          "total_unread_count": 11,
          "role": "user",
          "online": false,
          "banned": false,
          "channel_last_read_at": "2024-02-07T06:16:58.76373504Z",
          "image": "",
          "unread_count": 11
        },
        "user_id": "winartoawimailinatorcom",
        "banned": false,
        "channel_role": "channel_member"
      }
    ],
    "cid": "messaging:daa6584f-d456-430c-b82d-e555f979c281",
    "watcher_count": 1,
    "user": {
      "last_active": "2024-02-16T09:30:20.433783344Z",
      "name": "Brij",
      "online": true,
      "image": "",
      "updated_at": "2024-02-07T06:16:13.036285Z",
      "banned": false,
      "role": "user",
      "created_at": "2024-02-07T06:16:13.036285Z",
      "id": "brijooolabscom1"
    },
    "channel": {
      "members": [
        {
          "role": "member",
          "notifications_muted": false,
          "user_id": "brijendrakumariitrgmailcom",
          "status": "member",
          "channel_role": "channel_member",
          "shadow_banned": false,
          "banned": false,
          "created_at": "2024-02-07T06:16:58.750362Z",
          "updated_at": "2024-02-07T06:16:58.750362Z",
          "user": {
            "banned": false,
            "updated_at": "2024-02-05T08:25:34.762042Z",
            "created_at": "2024-02-05T08:25:34.762042Z",
            "online": false,
            "name": "Brijendra",
            "role": "user",
            "last_active": "2024-02-05T13:59:20.957805Z",
            "id": "brijendrakumariitrgmailcom",
            "image": ""
          }
        },
        {
          "user_id": "brijooolabscom",
          "banned": false,
          "role": "owner",
          "updated_at": "2024-02-07T06:16:58.750362Z",
          "shadow_banned": false,
          "notifications_muted": false,
          "created_at": "2024-02-07T06:16:58.750362Z",
          "user": {
            "image": "",
            "created_at": "2024-02-07T06:16:13.036285Z",
            "last_active": "2024-02-16T09:30:20.433783344Z",
            "online": true,
            "role": "user",
            "banned": false,
            "updated_at": "2024-02-07T06:16:13.036285Z",
            "name": "Brij",
            "id": "brijooolabscom"
          },
          "status": "member",
          "channel_role": "channel_member"
        },
        {
          "updated_at": "2024-02-07T06:16:58.750362Z",
          "notifications_muted": false,
          "created_at": "2024-02-07T06:16:58.750362Z",
          "banned": false,
          "role": "member",
          "user": {
            "name": "white-haze-6",
            "image": "https://getstream.io/random_png/?id=white-haze-6&name=white-haze-6",
            "last_active": "2024-01-24T09:12:05.357528Z",
            "online": false,
            "created_at": "2024-01-23T11:51:08.886178Z",
            "banned": false,
            "role": "user",
            "updated_at": "2024-01-23T11:51:08.887667Z",
            "id": "white-haze-6"
          },
          "channel_role": "channel_member",
          "status": "member",
          "shadow_banned": false,
          "user_id": "white-haze-6"
        },
        {
          "user": {
            "created_at": "2024-02-06T13:43:13.329001Z",
            "name": "Winarto Wijaya",
            "last_active": "2024-02-06T17:44:41.216334Z",
            "id": "winartoawimailinatorcom",
            "online": false,
            "role": "user",
            "image": "",
            "banned": false,
            "updated_at": "2024-02-06T13:43:13.329001Z"
          },
          "notifications_muted": false,
          "role": "member",
          "shadow_banned": false,
          "created_at": "2024-02-07T06:16:58.750362Z",
          "user_id": "winartoawimailinatorcom",
          "channel_role": "channel_member",
          "banned": false,
          "status": "member",
          "updated_at": "2024-02-07T06:16:58.750362Z"
        }
      ],
      "name": "ooomgmtgroup",
      "last_message_at": "2024-02-16T09:30:44.277905Z",
      "config": {
        "connect_events": true,
        "automod_behavior": "flag",
        "uploads": true,
        "reactions": true,
        "automod": "disabled",
        "search": true,
        "quotes": true,
        "typing_events": true,
        "reminders": false,
        "custom_events": true,
        "message_retention": "infinite",
        "commands": [
          {
            "args": "[text]",
            "set": "fun_set",
            "name": "giphy",
            "description": "Post a random gif to the channel"
          }
        ],
        "read_events": true,
        "max_message_length": 5000,
        "created_at": "2024-02-15T09:29:20.081195791Z",
        "mark_messages_pending": false,
        "updated_at": "2024-02-15T09:29:20.081199491Z",
        "mutes": true,
        "replies": true,
        "name": "messaging",
        "push_notifications": true,
        "url_enrichment": true
      },
      "cid": "messaging:daa6584f-d456-430c-b82d-e555f979c280",
      "member_count": 4,
      "updated_at": "2024-02-07T06:16:58.743642Z",
      "image": "",
      "disabled": false,
      "id": "daa6584f-d456-430c-b82d-e555f979c280",
      "frozen": false,
      "created_by": {
        "updated_at": "2024-02-07T06:16:13.036285Z",
        "role": "user",
        "id": "brijooolabscom",
        "image": "",
        "online": true,
        "last_active": "2024-02-16T09:30:20.433783344Z",
        "name": "Brij",
        "created_at": "2024-02-07T06:16:13.036285Z",
        "banned": false
      },
      "created_at": "2024-02-07T06:16:58.743642Z",
      "type": "messaging"
    },
    "channel_type": "messaging",
    "channel_id": "daa6584f-d456-430c-b82d-e555f979c284",
    "message_id": "brijooolabscom-yWF-1eqvz2f3EDIbOaDWo",
    "message": {
      "cid": "messaging:daa6584f-d456-430c-b82d-e555f979c280",
      "updated_at": "2024-02-16T09:30:44.277905Z",
      "type": "regular",
      "silent": false,
      "own_reactions": [],
      "html": "<p>kay re</p>\n",
      "pinned": false,
      "created_at": "2024-02-16T09:30:44.277905Z",
      "shadowed": false,
      "pinned_by": null,
      "attachments": [],
      "text": "kay re",
      "user": {
        "online": true,
        "banned": false,
        "role": "user",
        "name": "Brij",
        "updated_at": "2024-02-07T06:16:13.036285Z",
        "image": "",
        "id": "brijooolabscom",
        "created_at": "2024-02-07T06:16:13.036285Z",
        "last_active": "2024-02-16T09:30:20.433783344Z"
      },
      "id": "brijooolabscom-yWF-1eqvz2f3EDIbOaDWo",
      "pin_expires": null,
      "reaction_counts": {},
      "mentioned_users": [],
      "reaction_scores": {},
      "deleted_reply_count": 0,
      "reply_count": 0,
      "latest_reactions": [],
      "pinned_at": null
    },
    "request_info": {
      "sdk": "stream-chat-react-10.5.0-stream-chat-javascript-client-browser-8.2.1",
      "type": "client",
      "ip": "106.208.146.113",
      "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36"
    }
  }




Test(data)

console.log('Complete')