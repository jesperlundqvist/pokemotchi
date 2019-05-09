import React from 'react';
import { Text, View, Image } from 'react-native';
import Model from './Model';

export default class Pokemon extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {}
        };
    }

    componentDidMount() {
        Model.getPokemonById(this.props.id).then((data) => {
            this.setState({data: data});
        });
    }

    componentDidUpdate(prevProps) {
        if (this.props.id !== prevProps.id) {
            Model.getPokemonById(this.props.id).then((data) => {
                this.setState({data: data});
            });
        }
    }

    render() {
        let imageUri = "http://pokestadium.com/sprites/xy/" + this.state.data.name + ".gif";
        let name = this.state.data.name;
        if (name) {
            name = name.charAt(0).toUpperCase() + name.slice(1);
        }

        if (!this.props.alive) {
            name = name + " [DEAD]";
        }

        return <View style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
        }}>
            <Image source={{uri: imageUri}} style={{width: 200, height: 200, resizeMode: "contain"}}/>
            <Text style={{fontSize: 24}}>{name}</Text>
            <Text style={{fontSize: 18}}>Hunger: {this.props.hunger}</Text>
            <Text style={{fontSize: 18}}>Cleanliness: {this.props.cleanliness}</Text>
            <Text style={{fontSize: 18}}>Fun: {this.props.fun}</Text>
        </View>;
    }
}
