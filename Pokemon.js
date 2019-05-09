import React from 'react';
import { Text, View, Image } from 'react-native';
import Model from './Model';

export default class Pokemon extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {},
            hunger: 100,
            cleanliness: 100,
            fun: 100,
            alive: true
        };
    }

    componentDidMount() {
        Model.getPokemonById(this.props.id).then((data) => {
            this.setState({data: data});
        });

        this._interval = setInterval(() => {
            if (this.state.alive) {
                if (this.state.hunger <= 0 ||
                    this.state.cleanliness <= 0 ||
                    this.state.fun <= 0)
                {
                    this.setState({
                        hunger: 0,
                        cleanliness: 0,
                        fun: 0,
                        alive: false
                    });
                }
                else {
                    this.setState({
                        hunger: this.state.hunger - 1,
                        cleanliness: this.state.cleanliness - 1,
                        fun: this.state.fun - 1
                    });
                }
            }
        }, 250);
    }

    componentWillUnmount() {
        clearInterval(this._interval);
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.id !== prevProps.id) {
            Model.getPokemonById(this.props.id).then((data) => {
                this.setState({
                    data: data,
                    hunger: 100,
                    cleanliness: 100,
                    fun: 100,
                    alive: true
                });
            });
        }

        if (prevState.alive != this.state.alive) {
            if (this.props.onAliveChange) {
                this.props.onAliveChange(this.state.alive, prevState.alive);
            };
        }
    }

    render() {
        let imageUri = "http://pokestadium.com/sprites/xy/" + this.state.data.name + ".gif";
        let name = this.state.data.name;
        if (name) {
            name = name.charAt(0).toUpperCase() + name.slice(1);
        }

        if (!this.state.alive) {
            name = name + " [DEAD]";
        }

        return <View style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
        }}>
            <Image source={{uri: imageUri}} style={{width: 200, height: 200, resizeMode: "contain"}}/>
            <Text style={{fontSize: 24}}>{name}</Text>
            <Text style={{fontSize: 18}}>Hunger: {this.state.hunger}</Text>
            <Text style={{fontSize: 18}}>Cleanliness: {this.state.cleanliness}</Text>
            <Text style={{fontSize: 18}}>Fun: {this.state.fun}</Text>
        </View>;
    }
}
