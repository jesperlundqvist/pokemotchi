import React from 'react';
import { Text, View, Image, AsyncStorage, Button } from 'react-native';
import Model from './Model';
import Sponge from './Sponge';


export default class Pokemon extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {},
            hunger: 100,
            cleanliness: 100,
            fun: 100,
            alive: true,
            id: "",
        };


        /*if (AsyncStorage.getItem("pokemon")) {
          this.setState({ id: AsyncStorage.getItem("pokemon") });
        }*/
    }

    componentDidMount() {
      if (this.state.id == "") {
        this.state.id = Math.floor(Math.random() * 10)+1
      }

        Model.getPokemonById(this.state.id).then((data) => {
            this.setState({data: data});
            console.log("pokemon");
            console.log(this.state.data.id);
            //Model.favPok(this.state.data);
            //AsyncStorage.setItem("pokemon", this.state.data.id)

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
        if (this.state.id !== prevState.id) {
            Model.getPokemonById(this.state.id).then((data) => {
                this.setState({
                    data: data,
                    hunger: 100,
                    cleanliness: 100,
                    fun: 100,
                    alive: true,
                });
            });
        }

        /*if (prevState.alive != this.state.alive) {
            if (this.props.onAliveChange) {
                this.props.onAliveChange(this.state.alive, prevState.alive);
            };
        }*/

      /*  if (!this.state.alive) {
          this.setState ({id: Math.floor(Math.random() * 10)+1})
        }*/


    }

    render() {
        let imageUri = "http://pokestadium.com/sprites/xy/" + this.state.data.name + ".gif";
        let name = this.state.data.name;
        if (name) {
            name = name.charAt(0).toUpperCase() + name.slice(1);
        }

        let buttons = <View>
            <Button title="Feed" onPress={() => { this.setState({hunger: this.state.hunger + 10}) }} />
            <Button title="Clean" onPress={() => { this.setState({cleanliness: this.state.cleanliness + 10}) }} />
            <Button title="Play" onPress={() => { this.setState({fun: this.state.fun + 10}) }} />
        </View>;

        if (!this.state.alive) {
          buttons = <Button title="New Pokemon" onPress={() => {
            this.setState ({ id: (Math.floor(Math.random() * 10)+1) });
            AsyncStorage.setItem("pokemon", this.state.id);
          }} />
          name = name + " [DEAD]";
        }

        return <View style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
        }}>
            <Image source={{uri: imageUri}} style={{width: 200, height: 200, resizeMode: "contain"}}/>
            <Text style={{fontSize: 24}}>{name}</Text>
            <Text style={{fontSize: 18}}>Hunger: {Math.round(this.state.hunger)}</Text>
            <Text style={{fontSize: 18}}>Cleanliness: {Math.round(this.state.cleanliness)}</Text>
            <Text style={{fontSize: 18}}>Fun: {Math.round(this.state.fun)}</Text>
            <Sponge onClean={() => {this.setState({cleanliness: this.state.cleanliness + 0.2})}}/>
        </View>;
    }
}
