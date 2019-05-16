import React from 'react';
import { SafeAreaView, View, Button, TextInput} from 'react-native';
import {createStackNavigator, createAppContainer} from 'react-navigation'
import Pokemon from './Pokemon';


export default class Homescreen extends React.Component {
    static navigationOptions = {
      title: 'Welcome'
    };

    constructor(props) {
        super(props);
        this.state = {
            pokemonId: Math.floor(Math.random() * 100)+1,
            pokemonAlive: true
        }
    }

    render() {

        const {navigate} = this.props.navigation;

        console.log('skickar in i fight')
        console.log(this.state.pokemonId)
        let buttons = <View>
            <Button title="Fight" onPress={() => navigate('Fight', {username: "Lovi", pokemon: this.state.pokemonId})}/>
        </View>;

        /*if (!this.state.pokemonAlive) {
            buttons = <Button title="New Pokemon" onPress={() => {
                let newPokemon = Math.floor(Math.random() * 10)+1;

                while (newPokemon == this.state.pokemonId) {
                    newPokemon = Math.floor(Math.random() * 10)+1;
                }

                this.setState({
                    pokemonId: newPokemon
                });
            }} />
        }*/

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
