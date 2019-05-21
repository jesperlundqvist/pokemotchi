import React from 'react';
import { SafeAreaView, View, Button, TextInput, Text, ImageBackground, StatusBar, FormLabel } from 'react-native';
import { TouchableOpacity } from 'react-native'
import { createStackNavigator, createAppContainer } from 'react-navigation';
import { MaterialCommunityIcons, Entypo } from '@expo/vector-icons';
import Pokemon from './Pokemon';
import { Haptic } from 'expo';


export default class Start extends React.Component {
  static navigationOptions = {
    title: 'Welcome',
  };
    constructor(props) {
        super(props);
        this.state = { text: "" };
    }

    componentDidMount() {

    }

    pickUserName () {
      
    }

    render() {
      const { navigate } = this.props.navigation;
      let startText = "What username do you want?"

      let start = 
      <View>
        <TouchableOpacity style={{ padding: 15 }} activeOpacity={0.5} onPress={() => {
          navigate('Home', { username: this.state.text})
        }}>
        <Text style={{ paddingHorizontal: 15, color: "black", fontSize: 20 }}>Get started!</Text>
        </TouchableOpacity>

      </View>;

        return <View style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
        }}>
        
        
        <TextInput
          style={{height: 40, borderColor: 'gray', borderWidth: 1}}
          onChangeText={(text) => this.setState({text})}
          value={this.state.text}
        />
        


        {start}

        </View>;
    }
  }
