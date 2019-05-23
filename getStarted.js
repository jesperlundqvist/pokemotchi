import React from 'react';
import { SafeAreaView, View, Button, TextInput, Text, ImageBackground, StatusBar, FormLabel, Image } from 'react-native';
import { TouchableOpacity } from 'react-native'
import { createStackNavigator, createAppContainer } from 'react-navigation';
import { MaterialCommunityIcons, Entypo } from '@expo/vector-icons';
import Pokemon from './Pokemon';
import { Haptic } from 'expo';


export default class Start extends React.Component {
  static navigationOptions = {
    title: 'Welcome',
    headerTransparent: true,
    headerTintColor: "transparent",

  };
  constructor(props) {
    super(props);
    this.state = { text: "" };
  }


  render() {
    const { navigate } = this.props.navigation;
    let startText = "What username do you want?"

    let start =
      <View>
        <TouchableOpacity style={{}} activeOpacity={0.5} onPress={() => {
          navigate('Home', { username: this.state.text })
        }}>
          <Text style={{ paddingHorizontal: 15, color: "deepskyblue", fontSize: 20 }}>Sign in</Text>
        </TouchableOpacity>

      </View>;

    return (
      <ImageBackground
        style={{
          backgroundColor: '#ccc',
          flex: 1,
          position: 'absolute',
          width: '100%',
          height: '100%',
          justifyContent: 'center',
        }}
        source={{ uri: "http://miniwallist.com/wp-content/uploads/2016/07/pokemon-go-pokeball-mobile-wallpaper-minimalist-2160x3840.jpg" }}
      >
        <View style={{
          flex: 1,
          alignItems: 'center',
        }}>

          <Image style={{ width: 300, height: 300, resizeMode: "contain" }} source={{ uri: "https://fontmeme.com/permalink/190522/b394043e2419f9781e8e5c25b69fd896.png" }} />
          <TextInput
            style={{ height: 40, width: 200, borderColor: 'gray', borderWidth: 2, fontSize: 20, backgroundColor: "white" }}
            onChangeText={(new_input) => {
              this.setState({ text: new_input })
            }}
            value={this.state.text} maxLength={13} placeholder="Enter username" onSubmitEditing={(event) => {
              console.log("inside started: ", event.nativeEvent.text)
              console.log("from state: ", this.state.text)
              navigate('Home', { username: event.nativeEvent.text })
            }}
          />

          {start}

        </View>
        </ImageBackground>)
  }
}
