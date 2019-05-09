import React from 'react';
import { SafeAreaView, View, Button } from 'react-native';
import Pokemon from './Pokemon';

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pokemonId: Math.floor(Math.random() * 10)+1,
            hunger: 100,
            cleanliness: 100,
            fun: 100
        }
    }


    componentDidMount() {
        this._interval = setInterval(() => {
            if (this.state.hunger <= 0 ||
                this.state.cleanliness <= 0 ||
                this.state.fun <= 0)
            {
                this.setState({
                    hunger: 0,
                    cleanliness: 0,
                    fun: 0
                });
            }
            else {
                this.setState({
                    hunger: this.state.hunger - 1,
                    cleanliness: this.state.cleanliness - 1,
                    fun: this.state.fun - 1
                });
            }
        }, 1000);
    }

    componentWillUnmount() {
        clearInterval(this._interval);
    }

    render() {
        return (
          <SafeAreaView style={{
              flex: 1,
              flexDirection: 'column',
            }}>
            <Pokemon style={{flexGrow: 1}} id={this.state.pokemonId}
                hunger={this.state.hunger}
                cleanliness={this.state.cleanliness}
                fun={this.state.fun}
            />
            <View style={{flexDirection: "row", flexShrink: 1, justifyContent: "center"}}>
                <Button title="Feed" onPress={() => { this.setState({hunger: this.state.hunger + 10}) }} />
                <Button title="Clean" onPress={() => { this.setState({cleanliness: this.state.cleanliness + 10}) }} />
                <Button title="Play" onPress={() => { this.setState({fun: this.state.fun + 10}) }} />
            </View>
          </SafeAreaView>
        );
    }
}
