import React from 'react';
import { StyleSheet, View, Text, KeyboardAvoidingView } from 'react-native';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';


export default class Chat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: []
    }
  }

  componentDidMount() {
    //Sets state for messages as user enters Chat
    let { name } = this.props.route.params;
    this.setState({
      messages: [
        {
          _id: 1,
          text: `Hello ${name}`,
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
  chatWrapper: {
    flex: 1,
  }
});

