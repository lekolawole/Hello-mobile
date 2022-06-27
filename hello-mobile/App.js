import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, Button, Alert, ScrollView } from 'react-native';
import React, { Component } from 'react';

import Screen1 from './components/Screen1';
import Screen2 from './components/Screen2';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Create the navigator
const Stack = createStackNavigator();

export default class HelloWorld extends Component {
  constructor(props) {
    super(props);
    this.state = { text: '' };
  }

  alertMyText (input = []) {
    Alert.alert(input.text);
  }

  render() {
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName='Screen1'>
          <Stack.Screen
            name='Screen1'
            component={Screen1}
          />
          <Stack.Screen
            name='Screen2'
            component={Screen2}
          />
        </Stack.Navigator>
        {/* <View style={styles.container}>
        <Text>Hello, World!</Text>
        <Text>You Wrote: {this.state.text}</Text>
        <TextInput
          style={{ height: 40, borderColor: 'gray', borderWidth: 1}} 
          onChangeText={(text) => this.setState({ text })}
          value={this.state.text}
          placeholder='Type here...'
          />
          <Button 
            onPress={() => {
              this.alertMyText({text: this.state.text});
            }}
            title='Send'
          />
        <ScrollView>
          <Text style={{ fontSize: 150 }}>This text is so big and you have to scroll</Text>
        </ScrollView>
          <StatusBar style="auto" />
        </View> */}
      </NavigationContainer>
      

    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    // flexDirection:'column'
  }, 
  // textbox: {
  //   height: 40,
  //   borderColor: 'gray',
  //   borderWidth: 1
  // },
  // box2: {
  //   flex: 80,
  //   width: 190,
  //   backgroundColor: 'blue'
  // },
  // box3: {
  //   flex: 50,
  //   width: 80,
  //   backgroundColor: 'green'
  // }
});
