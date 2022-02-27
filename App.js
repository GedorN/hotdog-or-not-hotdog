import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Button,
  PermissionsAndroid,
  ActivityIndicator
} from 'react-native';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import * as mobilenet from '@tensorflow-models/mobilenet';
import '@tensorflow/tfjs-react-native';
import * as tf from '@tensorflow/tfjs';
import { fetch, decodeJpeg } from '@tensorflow/tfjs-react-native';


export default function App() {
  const [result, setResult] = useState(0);
  const [loading, setLoading] = useState(0);

  async function openCamera() {
    console.log('aloha')
    let cameraGranted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA,
      {
        title: 'Spotted Camera Permission',
        message:
          'Spotted needs access to your camera ' +
          'so you can take awesome pictures ;)',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    if (cameraGranted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('You can use the camera');
      const options = {
        mediaType: 'photo',
        includeBase64: true
        // saveToPhotos: true
      };
      launchCamera(options, async response => {
        if (response.didCancel) {
        } else if (response.errorCode) {
          console.log('ImagePicker Error: ', response.errorCode);
        } else if (response.customButton) {
          console.log('User tapped custom button: ', response.customButton);
        } else {
          const image = response.assets[0]
          const imageUri = image.uri;
          console.log('O que eu tenho: ', image)
          console.log('embaixo: ', imageUri)

          try {
          await tf.ready();
          console.log('Tá ready')
          //   // Load mobilenet.
          const model = await mobilenet.load();
          console.log('venci essa porra')
            
          // Get a reference to the bundled asset and convert it to a tensor
          const imgBuffer = tf.util.encodeString(image.base64, 'base64').buffer;
          console.log('testa ai')
          const raw = new Uint8Array(imgBuffer)  
          const imageTensor = decodeJpeg(raw);

            // const imageAssetPath = Image.resolveAssetSource(image);
            // const response = await fetch(imageUri, {}, { isBinary: true });
            // console.log('volta o que aqui? ', response)
            // const imageData = await response.arrayBuffer();
            // const imageTensor = decodeJpeg(imageData);
            // console.log('image tensro: ', imageTensor);
            const prediction = await model.classify(imageTensor);
            console.log('SENHOR: ', prediction)

          } catch (e) {
            console.log('tem erro: ', e);
          }

          // const imageAssetPath = Image.resolveAssetSource(image);
          // const response = await fetch(imageAssetPath.uri, {}, { isBinary: true });
          // const imageData = await response.arrayBuffer();

        }
      });
    }
  }
  async function openCamera() {
    console.log('aloha')
    let cameraGranted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      {
        title: 'Spotted Camera Permission',
        message:
          'Spotted needs access to your camera ' +
          'so you can take awesome pictures ;)',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    if (cameraGranted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('You can use the camera');
      const options = {
        mediaType: 'photo',
        includeBase64: true
        // saveToPhotos: true
      };
      launchImageLibrary(options, async response => {
        if (response.didCancel) {
        } else if (response.errorCode) {
          console.log('ImagePicker Error: ', response.errorCode);
        } else if (response.customButton) {
          console.log('User tapped custom button: ', response.customButton);
        } else {
          setLoading(1);
          const image = response.assets[0]
          const imageUri = image.uri;
          console.log('O que eu tenho: ', image)
          console.log('embaixo: ', imageUri)

          try {
          await tf.ready();
          console.log('Tá ready')
          //   // Load mobilenet.
          const model = await mobilenet.load();
          console.log('venci essa porra')
            
          // Get a reference to the bundled asset and convert it to a tensor
          const imgBuffer = tf.util.encodeString(image.base64, 'base64').buffer;
          console.log('testa ai')
          const raw = new Uint8Array(imgBuffer)  
          const imageTensor = decodeJpeg(raw);

            // const imageAssetPath = Image.resolveAssetSource(image);
            // const response = await fetch(imageUri, {}, { isBinary: true });
            // console.log('volta o que aqui? ', response)
            // const imageData = await response.arrayBuffer();
            // const imageTensor = decodeJpeg(imageData);
            // console.log('image tensro: ', imageTensor);
            const prediction = await model.classify(imageTensor);
            console.log('SENHOR: ', prediction)
            processResult(prediction)

          } catch (e) {
            console.log('tem erro: ', e);
          }

          // const imageAssetPath = Image.resolveAssetSource(image);
          // const response = await fetch(imageAssetPath.uri, {}, { isBinary: true });
          // const imageData = await response.arrayBuffer();

        }
      });
    }
  }

  async function processResult(result) {
    if (result[0].className.includes('hotdog')) {
      console.log('é hot dog')
      setResult(1);
    } else {
      console.log('Não é hot dog')
      setResult(2);
    }
    setLoading(0);
  }
  return (
    <View style={styles.container}>
      {
        loading === 1 &&
        <ActivityIndicator size="large" color="red" />
      }
      {
        loading === 0 &&
        <View>
          <View>
            <Button
              onPress={openCamera}
              title="TAKE PICTURE"
              color="#FF0000"
              accessibilityLabel="Learn more about this purple button"
            />
          </View>
          <View style={{ marginTop: 15 }}>
            <Button
              onPress={openCamera}
              title="GET IMAGE"
              color="#FF0000"
              accessibilityLabel="Learn more about this purple button"
            />
          </View>
          <View style={{ marginTop: 25 }}>
            {
              result === 1 &&
              <View>
                <Text style={{color: 'white', fontWeight: 'bold'}}>É HOTDOG</Text>
              </View>
            }
            {
              result === 2 &&
              <View>
                <Text style={{color: 'white', fontWeight: 'bold'}}>NÃO É HOTDOG</Text>
              </View>
            }
          </View>
        </View>
      }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'blue',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
