import React from 'react';
import { ImageBackground, StyleSheet, View, Text, Button, TextInput, Alert } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { color } from 'react-native-reanimated';
import Pressable from 'react-native/Libraries/Components/Pressable/Pressable';

export default class Start extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      name: '',
      bgColor: this.colors.default
    };
  }

  colors = {
    default: '#ffffff',
    black: '#090C08',
    purple: '#474056',
    blue: '#8A95A5',
    green: '#B9C6AE'
  }

  //Allows the user to change background to presets
  chooseBackground = (newColor) => {
    this.setState({ bgColor: newColor });
    Alert.alert('Background Changed!');
  };

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
            <Text style={styles.ChooseBackground}>Choose Background Color:</Text>
            <View style={styles.colorBlock}>
                <TouchableOpacity style={styles.bg1} title=''
                  accessible={true}
                  accessibilityRole="button"
                  onPress={() => this.chooseBackground(this.colors.black)}/>
                <TouchableOpacity style={[styles.bg1, styles.variant]} title=''
                  accessible={true}
                  accessibilityRole="button"
                  onPress={() => this.chooseBackground(this.colors.purple)}/>
                <TouchableOpacity style={[styles.bg1, styles.variant2]} title=''
                  accessible={true}
                  accessibilityRole="button"
                  onPress={() => this.chooseBackground(this.colors.blue)}/>
                <TouchableOpacity style={[styles.bg1, styles.variant3]} title=''
                  accessible={true}
                  accessibilityRole="button"
                  onPress={() => this.chooseBackground(this.colors.green)}/>
            </View>
            <View style={styles.button}>
              <Pressable
              accessible={true}
              accessibilityRole="button"
              title=""
              onPress={() => this.props.navigation.navigate('Chat', { name: this.state.name, bgColor: this.state.bgColor })}>
                <Text style={styles.buttonText}>Start Chatting</Text>
              </Pressable>
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
    backgroundColor: '#ffffff',
    height: '44%',
    paddingVertical: 20,
    paddingHorizontal: 15,
    borderRadius: 3,
  },
  ChooseBackground: {
    fontWeight: '300',
    color: '#757083',
    fontSize: 16,
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
    borderRadius: 4,
    fontWeight: '300',
    color: '#757083',
    backgroundColor: 'white'
  },
  title: {
    fontSize: 45,
    color: '#ffffff',
    height: 275
  },
  button: {
    borderRadius: 4,
    padding: 6,
    alignSelf: 'center',
    backgroundColor: '#757083',
    width: '80%'
  },
  buttonText: {
    color: '#FFFFFF',
    alignSelf: 'center',
    fontSize: 18,
    fontWeight: '600'
  },
  colorBlock: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginLeft: 20,
    marginBottom: 30,
  },
  bg1: {
    backgroundColor: '#090C08',
    width: 50,
    borderRadius: 25,
    height: 50,
    marginTop: 20,
  },
  variant: {
    backgroundColor: '#474056'
  },
  variant2: {
    backgroundColor: '#8A95A5'
  },
  variant3: {
    backgroundColor: '#B9C6AE'
  }
});