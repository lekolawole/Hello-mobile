import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { useActionSheet } from '@expo/react-native-action-sheet';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import MapView from 'react-native-maps';
import * as firebase from "firebase";
import "firebase/firestore";

export default function CustomActions(props) {
  const { showActionSheetWithOptions } = useActionSheet();
  const [image, setImage] = useState(null);
  const [location, setLocation] = useState(null);

  const pickImage = async () => {
   const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);

    // If permission is granted, open user photo library
    if(status === 'granted') {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
      }).catch(error => console.log(error));

      if (!result.cancelled) {
        const newImage = result;
        setImage(newImage);
        const imageUrl = await uploadImageFetch(result.uri);
        props.onSend({ image: imageUrl }); // Sends GiftedChat message
      }
    }
  }

  const captureImage = async () => {
   const { status } = await Permissions.askAsync(Permissions.CAMERA);

    if(status === 'granted') {
      let result = await ImagePicker.launchCameraAsync({
        mediaTypes: 'Images',
      }).catch(error => console.log(error));

      if (!result.cancelled) {
        const newImage = result;
        setImage(newImage);
        const imageUrl = await uploadImageFetch(result.uri);
        props.onSend({ image: imageUrl }); // Sends GiftedChat message
      }
    }
  }

  const getLocation = async () => {
    const { status } = await Permissions.askAsync(Permissions.LOCATION);
    if(status === 'granted') {
      let result = await Location.getCurrentPositionAsync({})
       .catch((error) => {
          console.error(error);
        });

      if (result) {
        const myLocation = result;
        setLocation(myLocation);
        props.onSend({ // Sends GiftedChat message
          location: {
            latitude: result.coords.latitude,
            longitude: result.coords.longitude,
          }
        });
      } 
    } 
  }

  // Convert Image to blob to store in Firestore
  const uploadImageFetch = async (uri) => {
    // Creates new XHTML Request
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function (e) {
        console.log(e);
        reject(new TypeError("Network request failed"));
      };
      xhr.responseType = "blob";
      xhr.open("GET", uri, true);
      xhr.send(null);
    });

    const imageNameBefore = uri.split("/");
    const imageName = imageNameBefore[imageNameBefore.length - 1];

    // Creates new blob in storage 
    const ref = firebase.storage().ref().child(`images/${imageName}`);
    const snapshot = await ref.put(blob);

    blob.close();
    // Creates reference to storage 
    return await snapshot.ref.getDownloadURL();
  }

  // Expo ActionSheet
  const onActionPress = () => {
    const options = ['Choose From Library', 'Take Picture', 'Send Location', 'Cancel'];
    const cancelButtonIndex = options.length - 1;
    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
      },
      async (buttonIndex) => {
        switch (buttonIndex) {
          case 0:
            console.log('user wants to pick an image');
            return pickImage();;
          case 1:
            console.log('user wants to take a photo');
            return captureImage();
          case 2:
            console.log('user wants to get their location');
          return getLocation();
        }
      },
    );
  };

  // Handles sharing location by sending a MapView
  const renderCustomView = (props) => {
    const { currentMessage } = props;
    if (currentMessage.location) {
        return (
            <MapView
                style={{
                    width: 150,
                    height: 100,
                    borderRadius: 13,
                    margin: 3
                }}
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

  return (
     <TouchableOpacity
        style={[styles.container]}
        onPress={onActionPress}
        renderCustomView={renderCustomView}
        accessibilityLabel='More options'
        accessibilityHint='Let’s you choose to send an image or your geolocation.'
      >
       <View style={[styles.wrapper, props.wrapperStyle]}>
         <Text style={[styles.iconText, props.iconTextStyle]}>+</Text>
       </View>
     </TouchableOpacity>
  )
}


const styles = StyleSheet.create({
 container: {
   width: 26,
   height: 26,
   marginLeft: 10,
   marginBottom: 10,
 },
 wrapper: {
   borderRadius: 13,
   borderColor: '#b2b2b2',
   borderWidth: 2,
   flex: 1,
 },
 iconText: {
   color: '#b2b2b2',
   fontWeight: 'bold',
   fontSize: 16,
   backgroundColor: 'transparent',
   textAlign: 'center',
 },
});

CustomActions.contextTypes = {
 actionSheet: PropTypes.func,
};