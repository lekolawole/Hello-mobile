import React from 'react';
import { ImageBackground, StyleSheet, View, Text, Button, TextInput } from 'react-native';
import { color } from 'react-native-reanimated';

export default class Start extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      name: '',
    };
  }

  render() {
    return (
      <ImageBackground style={{ width: '100%', height: '100%' }} source={require('../assets/BackgroundImage.png')}>
        <View style={styles.container}>
          <Text style={styles.title}>Hello Chat!</Text>
          <View style={styles.TextWrapper}>
            <TextInput 
            style={styles.textInput}
            onChangeText={(text) => this.setState({ name: text })}
            value={this.state.name}
            placeholder='Enter your name'
            />
            <Text style={styles.TextSettings}>Choose Background Color:</Text>
            <View style={styles.button}>
              <Button
              title="Start Chatting"
              onPress={() => this.props.navigation.navigate('Chat', { name: this.state.name })}
            />
            </View>
          </View>
        </View>
      </ImageBackground>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }, 
  TextWrapper: {
    width: '88%',
    backgroundColor: '#fff',
    height: '44%',
    alignItems: 'left',
    paddingVertical: 20,
    paddingHorizontal: 15,
    borderRadius: 3,
  },
  TextSettings: {
    fontWeight: '300',
    color: '#757083',
    opacity: '100%',
    fontSize: 16,
    marginBottom: 100
  },
  textInput: {
    marginBottom: 40,
    height: 60,
    width: '100%',
    fontSize: 16,
    borderColor: 'gray',
    borderWidth: 2,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 3,
    opacity: '50%',
    fontWeight: '300',
    color: '#757083'
  },
  title: {
    fontSize: 45,
    color: '#fff',
    height: 275
  },
  button: {
    marginLeft: 100,
    backgroundColor: '#757083',
    color: '#FFFFFF'
  }
});