import { Alert } from 'react-native';
import React, { Component } from 'react';

import Start from './components/Start';
import Chat from './components/Chat';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Create the navigator
const Stack = createStackNavigator();

export default class HelloWorld extends Component {

  alertMyText (input = []) {
    Alert.alert(input.text);
  }

  render() {
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName='Start'>
          <Stack.Screen
            name='Start'
            component={Start}
          />
          <Stack.Screen
            name='Chat'
            component={Chat}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}

