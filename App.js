import React from 'react';
import { SafeAreaView, View, Button } from 'react-native';
import Pokemon from './Pokemon';
import {AsyncStorage} from 'react-native';


export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pokemonId: Math.floor(Math.random() * 10)+1,
            pokemonAlive: true
        }
    }

    render() {


        return (
          <SafeAreaView style={{
              flex: 1,
              flexDirection: 'column',
            }}>
            <Pokemon style={{flexGrow: 1}} id={this.state.pokemonId} onAliveChange={(alive) => this.setState({pokemonAlive: alive})} />
            <View style={{flexDirection: "row", flexShrink: 1, justifyContent: "center"}}>
                {buttons}
            </View>
          </SafeAreaView>
        );
    }
}
