// Creating state for user info and Firebase Config
// When component mounts, internet connection is verified (or not) and displays a user message --- isConnected: False (by default)
// As component mounts, messages are retrieved from Firebase Cloud Storage, and an anonymous user is logged into the Chat

// Rest of the code retrieves, deletes, and sends messages from users to Firestore
// OnCollectionUpdate retrieves updates of new data sent to Firestore
import React from 'react';
import { StyleSheet, View, Text, KeyboardAvoidingView } from 'react-native';
import { GiftedChat, Bubble, InputToolbar } from 'react-native-gifted-chat';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import MapView from "react-native-maps";
import CustomActions from './CustomActions';

// Installing Firebase /////
const firebase = require('firebase');
require('firebase/firestore');


export default class Chat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [], 
      uid: 0, 
      user: {
        _id: '',
        name: '',
        avatar: 'https://placeimg.com/140/140/any',
      }, 
      isConnected: false, 
      image: null,
      location: null
    };

    const firebaseConfig = {
      apiKey: "AIzaSyDNygAG5HCIlWypDRBOqnABXh6h94ulTqM",
      authDomain: "hello-chat-ce52a.firebaseapp.com",
      projectId: "hello-chat-ce52a",
      storageBucket: "hello-chat-ce52a.appspot.com",
      messagingSenderId: "919301015498",
      appId: "1:919301015498:web:930d7076b1e57f510bb133",
      measurementId: "G-DM0FGBKN1G"
    };

    if (!firebase.apps.length){
    firebase.initializeApp(firebaseConfig);
  }
    //this.referenceMessages = firebase.firestore().collection('messages');
  }

  componentDidMount() {
    let { name } = this.props.route.params;
    this.props.navigation.setOptions({ title: name }); 

    // Create a reference to the active user's documents (messages)
    this.referenceMessages = firebase.firestore().collection('messages');

    // Determines user's internet connection status 
    NetInfo.fetch().then(connection => {
      if (connection.isConnected) {
        this.setState({ isConnected: true })
      } else {
        this.setState({
          isConnected: false
        })
      }
    });

    // Creates a new user for an Anonymouns account using Firebase
    this.authUnsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (!user) {
        firebase.auth().signInAnonymously();
      }
      // Adds correct data for fields in Firestore { uid, text, user.name, user.id, createdAt } for future interaction (sending messages)
      this.setState({
        uid: user.uid,
        messages: [],
        user: {
          _id: user.uid,
          name: name,
          avatar: "https://placeimg.com/140/140/any",
        }
      });
      this.referenceChatUser = firebase.firestore().collection('messages').where("uid", "==", this.state.uid);
      this.saveMessages();
      this.unsubscribe = this.referenceMessages
        .orderBy("createdAt", "desc")
        .onSnapshot(this.onCollectionUpdate);
    });

    // Retrieves messages from asyncStorage 
    this.getMessages();
  }

  async getMessages () {
    let messages = '';
    try {
      messages = await AsyncStorage.getItem('messages') || []; //Looks for messages, if none, sets to empty array 

      this.setState({
        messages: JSON.parse(messages)
      });
    } catch (error) {
      console.log(error.message);
    }
  }

  async saveMessages() {
    try {
      await AsyncStorage.setItem('messages', JSON.stringify(this.state.messages));
    } catch (error) {
      console.log(error.message);
    }
  }

  async deleteMessages() {
  try {
    await AsyncStorage.removeItem('messages');
    this.setState({
      messages: []
    })
  } catch (error) {
    console.log(error.message);
  }
}

  onCollectionUpdate = (querySnapshot) => {
    const messages = [];
    // go through each document
    querySnapshot.forEach((doc) => {
      // get the QueryDocumentSnapshot's data
      let data = doc.data();
      messages.push({
        _id: data._id,
        text: data.text,
        createdAt: data.createdAt.toDate(),
        user: {
          _id: data.user._id,
          name: data.user.name,
           avatar: data.user.avatar
        },
        image: data.image || null,
        location: data.location || null,
      });
    });
     this.setState({
      messages,
    });
  }

  // Handles adding a message to Firestore db
  addMessage() {
    const message = this.state.messages[0];
    this.referenceMessages.add({
          uid: this.state.uid,
          _id: message._id,
          text: message.text || '',
          createdAt: message.createdAt,
          user: message.user,
          image: message.image || null,
          location: message.location || null,
    });
  }
  
   componentWillUnmount() {
    this.authUnsubscribe();
    this.unsubscribe();
  }
  
  onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }), () => { //Adds message to state, calling addMessage()
        this.addMessage();
        this.saveMessages();
      }
    )
  }

  renderBubble = (props) => (
    <Bubble
      {...props}
    />
  );

  // UI Feature - Disables InputToolbar when user is offline 
  renderInputToolbar(props) {
    let { name } = this.props.route.params;
    this.props.navigation.setOptions({ title: name }); 

    if (this.state.isConnected == false) {
      this.props.navigation.setOptions({ title: `${name} is Offline` });
    } else {
      return(
        <InputToolbar
        {...props}
        />
      );
    }
  }

  // UI Feature - Creates the action (+) button
  renderCustomActions = (props) => {
    return <CustomActions {...props} />;
  };

  // This function checks whether the currentMessage has location data || if yes, a MapView is returned 
  renderCustomView(props) {
    const { currentMessage } = props;
    if (currentMessage.location) {
      return (
          <MapView
            style={{ width: 150, height: 100, borderRadius: 13, margin: 3 }}
            region={{
              latitude: currentMessage.location.latitude,
              longitude: currentMessage.location.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
          />
      );
    }
    return null;
  }

  render() {
    let { name } = this.props.route.params;
    let { bgColor } = this.props.route.params;
   
    return (
      <View style={{flex:1, justifyContent: 'center', alignItems: 'center', backgroundColor: bgColor, flexDirection: 'row' }}>
        <View style={styles.chatWrapper}>
          <GiftedChat
            renderBubble={this.renderBubble.bind(this)}
            renderActions={this.renderCustomActions.bind(this)}
            renderInputToolbar={this.renderInputToolbar.bind(this)}
            messages={this.state.messages}
            onSend={messages => this.onSend(messages)}
            renderCustomView={this.renderCustomView}
            showUserAvatar= {true}
            user={{
              _id: this.state.user._id, 
              name: name,
              avatar: this.state.user.avatar
            }}
          />
          { Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null}
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  chatWrapper: {
    flex: 1,
  }
});

