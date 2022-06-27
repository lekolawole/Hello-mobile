import React from 'react';
import { StyleSheet, View, Text} from 'react-native';


export default class Chat extends React.Component {
  render() {
    let { name } = this.props.route.params;
    let { bgColor } = this.props.route.params;
    this.props.navigation.setOptions({ title: name }); 

    return (
      <View style={{flex:1, justifyContent: 'center', alignItems: 'center', backgroundColor: bgColor }}>
        <Text style={styles.welcomeMessage}>Hello, {name}</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  welcomeMessage: {
    fontSize: 24,
    color: '#fff'
  }
})