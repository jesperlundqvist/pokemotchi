import React from 'react';
import { Text, View, Image, AsyncStorage, Button, TouchableHighlight, ImageBackground } from 'react-native';
import Model from './Model';
import Sponge from './Sponge';

const remote = 'https://pbs.twimg.com/media/DVMT-6OXcAE2rZY.jpg';

export default class Arena extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            myPokemon: {},
            theirPokemon: {},
            count: 0

        };

    }

    componentDidMount() {
        Model.getPokemonById(this.props.myId).then((data) => {
            this.setState({ myPokemon: data });
        });

        Model.getPokemonById(this.props.theirId).then((data) => {
            this.setState({ theirPokemon: data });
        });
    }

    componentWillUnmount() {
    }

    onPress = () => {
        this.setState({
            count: this.state.count + 1
        })
        console.log(this.state.count)

        if (this.state.count == 20)
            this.props.onVictory()

    }


    render() {
        const resizeMode = 'center';
        let myImageUri = "http://pokestadium.com/sprites/xy/back/" + this.state.myPokemon.name + ".gif";
        let theirImageUri = "http://pokestadium.com/sprites/xy/" + this.state.theirPokemon.name + ".gif";

        return (
            <View style={{
                paddingTop: 175
            }}>
                <TouchableHighlight style={{ alignSelf: 'flex-end' }} onPress={this.onPress}><Image source={{ uri: theirImageUri }} style={{ width: 125, height: 125, resizeMode: "contain" }} /></TouchableHighlight>
                <Image source={{ uri: myImageUri }} style={{ width: 250, height: 250, resizeMode: "contain", alignSelf: 'flex-start' }} />
            </View>
        )
    }
}
