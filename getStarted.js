import React from 'react';
import { SafeAreaView, View, Button, TextInput, Text, ImageBackground, StatusBar, FormLabel, Image } from 'react-native';
import { TouchableOpacity } from 'react-native'
import { createStackNavigator, createAppContainer } from 'react-navigation';
import { MaterialCommunityIcons, Entypo } from '@expo/vector-icons';
import Pokemon from './Pokemon';
import { Haptic } from 'expo';
import { AsyncStorage } from 'react-native';

export default class Start extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: "",
      RandomNumber: (Math.floor(Math.random() * 9999) + 10) };
  }

  saveUser = async (username) => {
    try {
        await (AsyncStorage.setItem("username", username))

    } catch (e) {
        console.error('Failed to save username.')
    }
  }


  render() {
    let startText = "What username do you want?"

    let start = <View>
        <TouchableOpacity style={{}} activeOpacity={0.5} onPress={() => {
          if (this.state.text == ""){
            alert("You need at least one character in your username!")
          }
          else {
          this.saveUser(this.state.text+'#'+this.state.RandomNumber.toString());
          this.props.onShow();
          }
        }}>
          <Text style={{ paddingHorizontal: 15, color: "deepskyblue", fontSize: 20 }}>Sign in</Text>
        </TouchableOpacity>

      </View>

      //"http://miniwallist.com/wp-content/uploads/2016/07/pokemon-go-pokeball-mobile-wallpaper-minimalist-2160x3840.jpg"

    return <View style={{
          flex: 1,
          alignItems: 'center',
        }}>

          <Image style={{ width: 350, height: 350, resizeMode: "contain" }} source={{ uri: "https://fontmeme.com/permalink/190522/b394043e2419f9781e8e5c25b69fd896.png" }} />
          <View style={{flexDirection: "row"}}>
          <TextInput
            style={{ height: 40, width: 200, borderColor: 'gray', borderWidth: 2, fontSize: 20, backgroundColor: "white" }}
            onChangeText={(new_input) => {
              this.setState({ text: new_input })
            }}
            value={this.state.text} maxLength={13} placeholder="Enter username" onSubmitEditing={(event) => {
              if (event.nativeEvent.text == "") {
                alert("You need at least one character in your username!")
              }
              else {
                this.saveUser(this.state.text+'#'+this.state.RandomNumber.toString());
                this.props.onShow();
              }
            }}
          />
          <Text style={{fontSize: 20, color: "lightgray", padding: 5}}>#{this.state.RandomNumber}</Text>
          </View>

          {start}

        </View>
  }
}
