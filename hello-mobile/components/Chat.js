import React from 'react';
import { StyleSheet, View, Text, KeyboardAvoidingView } from 'react-native';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';


export default class Chat extends React.Component {
  constructor() {
    super();
    this.state = {
      messages: []
    }
  }

  componentDidMount() {
    this.setState({
      messages: [
        {
          _id: 1,
          text: 'Hello developer',
          createdAt: new Date(),
          user: {
            _id: 2,
            name: 'React Native',
            avatar: 'https://placeimg.com/140/140/any',
          },
        },
        {
          _id: 2,
          text: 'This is a system message',
          createdAt: new Date(),
          system: true,
        },
      ],
    })
  }

  onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }))
  }

  renderBubble = (props) => (
    <Bubble
      {...props}
      // renderTime={() => <Text>Time</Text>}
      // renderTicks={() => <Text>Ticks</Text>}
      // containerStyle={{
      //   left: { borderColor: 'teal', borderWidth: 8 },
      //   right: {},
      // }}
      // wrapperStyle={{
      //   left: { borderColor: 'tomato', borderWidth: 4 },
      //   right: {},
      // }}
      // bottomContainerStyle={{
      //   left: { borderColor: 'purple', borderWidth: 4 },
      //   right: {},
      // }}
      // tickStyle={{}}
      // usernameStyle={{ color: 'tomato', fontWeight: '100' }}
      // containerToNextStyle={{
      //   left: { borderColor: 'navy', borderWidth: 4 },
      //   right: {},
      // }}
      containerToPreviousStyle={{
        left: { borderColor: 'mediumorchid', borderWidth: 4 },
        right: {},
      }}
    />
  );
  render() {
    let { name } = this.props.route.params;
    const { messages } = this.state;
    let { bgColor } = this.props.route.params;
    this.props.navigation.setOptions({ title: name }); 

    return (
      <View style={{flex:1, justifyContent: 'center', alignItems: 'center', backgroundColor: bgColor, flexDirection: 'row' }}>
        {/* <Text style={styles.welcomeMessage}>Hello, {name}</Text> */}
        <View style={styles.chatWrapper}>
          <GiftedChat
            renderBubble={this.renderBubble.bind(this)}
            
            messages={this.state.messages}
            onSend={messages => this.onSend(messages)}
            user={{
              _id: 1,
            }}
          />
          { Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null}
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  welcomeMessage: {
    fontSize: 24,
    color: '#fff'
  },
  chatWrapper: {
    flex: 1,
    // flexDirection: 'row'
  }
});

