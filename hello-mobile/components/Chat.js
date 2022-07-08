import React from 'react';
import { StyleSheet, View, Text, KeyboardAvoidingView } from 'react-native';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';

// Installing Firebase /////
const firebase = require('firebase');
require('firebase/firestore');


export default class Chat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [], 
      uid: '', 
      user: {
        _id: '',
        name: ''
      }
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

  this.referenceMessages = firebase.firestore().collection('messages');
  }

  componentDidMount() {
    let { name } = this.props.route.params;
    // create a reference to the active user's documents (shopping lists)
    this.referenceMessages = firebase.firestore().collection('messages')
    // .where("uid", "==", this.state.uid); - used for private chats

    //Creates a new user for an Anonymous account using Firebase
    this.authUnsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (!user) {
        firebase.auth().signInAnonymously();
      }
      this.setState({
        uid: user.uid,
        messages: [],
      });
      this.unsubscribe = this.referenceMessages
        .orderBy("createdAt", "desc")
        .onSnapshot(this.onCollectionUpdate);
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
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
          name: data.user.name
        }
      });
    });
     this.setState({
      messages,
    });
  }

  // Handles adding a message to Firestore
  addMessage = (message) => {
    this.referenceMessages.add({
          uid: this.state.uid,
          _id: message._id,
          text: message.text,
          createdAt: message.createdAt,
          user: message.user
    });
  }
  
  onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }),
      () => { //Adds message to state, calling addMessage()
        this.addMessage(this.state.messages[0]);
      }
    )
  }

  renderBubble = (props) => (
    // Update colors - may use later
    <Bubble
      {...props}
      // wrapperStyle={{
      //   left: {
      //     backgroundColor: 'yellow'
      //   }
      // }}
    />
  );
  render() {
    let { name } = this.props.route.params;
    const { messages } = this.state;
    let { bgColor } = this.props.route.params;
    this.props.navigation.setOptions({ title: name }); 

    return (
      <View style={{flex:1, justifyContent: 'center', alignItems: 'center', backgroundColor: bgColor, flexDirection: 'row' }}>
        <View style={styles.chatWrapper}>
          <GiftedChat
            renderBubble={this.renderBubble.bind(this)}
            
            messages={this.state.messages}
            onSend={messages => this.onSend(messages)}
            user={{
              _id: this.state.user._id, name: name
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

