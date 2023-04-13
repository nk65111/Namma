// import AsyncStorage from '@react-native-async-storage/async-storage';
// import messaging from '@react-native-firebase/messaging';
// import { useNavigation } from '@react-navigation/native';
// import PushNotification from 'react-native-push-notification';

// export async function requestUserPermission() {
//   const authStatus = await messaging().requestPermission();
//   const enabled =
//     authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
//     authStatus === messaging.AuthorizationStatus.PROVISIONAL;

//   if (enabled) {
//     console.log('Authorization status:', authStatus);
//     getFCMToken()
//   }
// }

// const getFCMToken = async () => {
//   let checkToken = await AsyncStorage.getItem('fcmToken')
//   // console.log('old token ', checkToken)
//   if (!checkToken) {
//     try {
//       const fcmToken = await messaging().getToken();
//       // console.log('fcm token generated', fcmToken);
//       if (fcmToken) {
//         await AsyncStorage.setItem('fcmToken', fcmToken)
//       }
//     } catch (error) {
//       console.log(error)
//     }
//   }
// }

// export const notificationListener = async () => {

//   messaging().onNotificationOpenedApp(remoteMessage => {
//     if (remoteMessage) {
//       console.log(
//         'Notification caused app to open from background state:',
//         remoteMessage?.notification,
//       );
//       if (remoteMessage?.notification?.android?.clickAction == "chat") {
//         useNavigation().navigate("Chatme")
//       }
//     }
//     // navigation.navigate(remoteMessage.data.type);
//   });

//   messaging().onMessage(remoteMessage => {
//     console.log('notification in foreground', remoteMessage?.notification)
//     PushNotification.localNotification({ channelId: 'rekindle', title: remoteMessage?.notification?.title, message: remoteMessage?.notification?.body });
//   })

//   // Check whether an initial notification is available
//   messaging()
//     .getInitialNotification()
//     .then(remoteMessage => {
//       if (remoteMessage) {
//         console.log(
//           'Notification caused app to open from quit state:',
//           remoteMessage?.notification,
//         );
//         if (remoteMessage?.notification?.android?.clickAction == "chat") {
//           useNavigation().navigate("Chatme")
//         }
//         // setInitialRoute(remoteMessage.data.type); // e.g. "Settings"
//       }
//     });
// }


// export const sendMessage = async (title, body, token, click_action) => {

//   const message = {
//     data: {
//       title: title,
//       body: body,
//       click_action: click_action || ''
//     },
//     notification: {
//       title: title,
//       body: body,
//       click_action: click_action || ''
//     },
//     to: token
//   };

//   try {

//     const res = await fetch('https://fcm.googleapis.com/fcm/send', {
//       method: 'POST',
//       headers: {
//         "Content-Type": "application/json",
//         "Authorization": "key=" + 'AAAAXO6vats:APA91bHfgOzGmOhe_UBRFHQ8ZJ9XCO03km-kQP-cofe_PRJkwVVEooy6iT4s0mWME05mfVLIsTBZoUI--bo6WfpfLb5hQWHRfgIdz2v7FteMScbYcBWsB2u6XfslvYxDJ2ptIwR05tfv'
//       },
//       body: JSON.stringify(message),
//     })
//     const data = await res.json();
//     console.log("SEND MESSAGE", data)
//   } catch (error) {
//     console.log('meesaage error    ', error)
//   }
// }
