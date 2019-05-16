import React from 'react';
import { Text, View, Image, AsyncStorage, Button, TouchableHighlight } from 'react-native';
import Model from './Model';
import Sponge from './Sponge';


export default class Arena extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            myPokemon: {},
            theirPokemon: {}
        };
    }

    componentDidMount() {
        Model.getPokemonById(this.props.myId).then((data) => {
            this.setState({myPokemon: data});
        });

        Model.getPokemonById(this.props.theirId).then((data) => {
            this.setState({theirPokemon: data});
        });
    }

    componentWillUnmount() {
    }

    render() {
        let myImageUri = "http://pokestadium.com/sprites/xy/back/" + this.state.myPokemon.name + ".gif";
        let theirImageUri = "http://pokestadium.com/sprites/xy/" + this.state.theirPokemon.name + ".gif";

        return <View style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
        }}>
            <Image source={{uri: theirImageUri}} style={{width: 125, height: 125, resizeMode: "contain", alignSelf: 'flex-end'}}/>
            <Image source={{uri: myImageUri}} style={{width: 250, height: 250, resizeMode: "contain", alignSelf: 'flex-start'}}/>
        </View>;
    }
}
