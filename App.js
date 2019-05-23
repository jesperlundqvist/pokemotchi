import React from 'react';
import { SafeAreaView, View, Button } from 'react-native';
import {createStackNavigator, createAppContainer} from 'react-navigation'
import Pokemon from './Pokemon';
import Homescreen from './Homescreen'
import Fight from './Fight'
import Info from './Info'
import Start from './getStarted'


const MainNavigator = createStackNavigator({
  Home: {screen: Homescreen},
  Fight: {screen: Fight},
  Info: {screen: Info}
});

const AppContainer = createAppContainer(MainNavigator);

export default class App extends React.Component {
  render(){
    return <AppContainer/>
  }
};
