import React from 'react';
import { SafeAreaView, View, Button } from 'react-native';
import Pokemon from './Pokemon';

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pokemonId: Math.floor(Math.random() * 10)+1,
            pokemonAlive: true
        }
    }

    render() {
        let buttons = <View>
            <Button title="Feed" onPress={() => { this.setState({hunger: this.state.hunger + 10}) }} />
            <Button title="Clean" onPress={() => { this.setState({cleanliness: this.state.cleanliness + 10}) }} />
            <Button title="Play" onPress={() => { this.setState({fun: this.state.fun + 10}) }} />
        </View>;

        if (!this.state.pokemonAlive) {
            buttons = <Button title="New Pokemon" onPress={() => {
                let newPokemon = Math.floor(Math.random() * 10)+1;

                while (newPokemon == this.state.pokemonId) {
                    newPokemon = Math.floor(Math.random() * 10)+1;
                }

                this.setState({
                    pokemonId: newPokemon
                });
            }} />
        }

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
