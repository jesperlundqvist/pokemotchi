import React from 'react';
import { Text, View, Image, Button, TouchableOpacity, TouchableHighlight, Platform } from 'react-native';
import Model from './Model';
import Sponge from './Sponge';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AsyncStorage } from 'react-native';
import Food from './Food';
import Toy from './Toy';
import { Haptic, Audio } from 'expo';

export default class Pokemon extends React.Component {
    constructor(props) {
        super(props);
        this.whenDeadUpdate = this.whenDeadUpdate.bind(this);
        this.state = {
            data: {},
            hunger: 100,
            cleanliness: 100,
            fun: 100,
            alive: true,
            id: "x",
            update: "",
        };
    }

    componentDidMount() {
        //AsyncStorage.clear();
        //console.log(typeof this.state.id);
        //this.print()

        let promise1 = new Promise((resolved, unresolved) => {

            resolved(this.load());

        })
        promise1.then(() =>
            console.log(this.state.id))
            .then(() =>
                Model.getPokemonById(this.state.id).then((data) => {
                    this.setState({ data: data });
                })
            );

        this._interval = setInterval(() => {
            if (this.state.alive) {
                if (this.state.hunger <= 0 ||
                    this.state.cleanliness <= 0 ||
                    this.state.fun <= 0) {
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

                  if (this.state.hunger == 75) {
                    this.savePokStats(this.state);
                  }

                  if (this.state.hunger == 50) {
                    this.savePokStats(this.state);
                  }

                }
            }
        }, 150);

        this.print();
    }

    //hej hshs hj jfld

    componentDidUpdate(prevProps, prevState) {

        //om state.update inte är lika med det update i state som var innan setState kördes
        if (this.state.update !== prevState.update) {
            console.log("i componentDidUpdate");
            console.log(this.state.id);
            Model.getPokemonById(this.state.id).then((data) => {
                this.setState({
                    data: data,
                    hunger: 100,
                    cleanliness: 100,
                    fun: 100,
                    alive: true,
                    update: ""
                });
            })
        }
    }

    randomId() {
        this.setState({ id: Math.floor(Math.random() * 100) + 1 })
        this.save(this.state.id);
    }

    print = async () => {
        AsyncStorage.getAllKeys((err, keys) => {
            AsyncStorage.multiGet(keys, (err, stores) => {
                stores.map((result, i, store) => {
                    // get at each store's key/value so you can work with it
                    let key = store[i][0];
                    let value = store[i][1];
                    console.log("nycklar: ")
                    console.log(key);
                    console.log("värden: ")
                    console.log(value);
                });
            });
        });
    }

    load = async () => {
        const id = await AsyncStorage.getItem("pokemonID");
        const hunger = await (AsyncStorage.getItem("pokemonHunger"));
        const clean = await (AsyncStorage.getItem("pokemonClean"));
        const fun = await (AsyncStorage.getItem("pokemonFun"));
        const alive = await (AsyncStorage.getItem("pokemonAlive"))


        if (id == "x" || id == null) {
            this.randomId();

        } else {
            this.setState({ id: id })
            //this.state.is = id;
            this.save(this.state.id);
        }

        if (hunger !== null) {
            this.setState({
                hunger: hunger,
                cleanliness: clean,
                fun: fun,
                alive: alive,
            })
        } else {
          this.setState({
              hunger: 100,
              cleanliness: 100,
              fun: 100,
              alive: true,
          });
        }

        return "resolved"
    }


    save = async (id) => {
        let stringID = String(id);
        try {
            await (AsyncStorage.setItem("pokemonID", stringID))
            this.setState({ id: stringID })

        } catch (e) {
            console.error('Failed to save id.')
        }
    }


    savePokStats = async (state) => {
        let hunger = String(state.hunger);
        let clean = String(state.cleanliness);
        let fun = String(state.fun);
        let alive = String(state.alive);

        try {
            await (AsyncStorage.setItem("pokemonHunger", hunger))
            await (AsyncStorage.setItem("pokemonClean", clean))
            await (AsyncStorage.setItem("pokemonFun", fun))
            await (AsyncStorage.setItem("pokemonAlive", alive))


        } catch (e) {
            console.error('Failed to save id.')
        }
    }

    async playRecording() {

        const { sound } = await Audio.Sound.createAsync({uri:'https://veekun.com/dex/media/pokemon/cries/' + String(this.state.id) + '.ogg'});
        
        await sound.playAsync();
      
       //'https://veekun.com/dex/media/pokemon/cries/1.ogg'
      
    }


    componentWillUnmount() {
        clearInterval(this._interval);
    }

    whenDeadUpdate() {
        //this.setState ({ id: (Math.floor(Math.random() * 10)+1) });
        //this.setState ({ update: "updated" });
        //this.save(this.state.id);
        this.forceUpdate();
        console.log("foreced update");
    }


    render() {
        let action = <View></View>;
        if (this.props.action == "clean") {
            action = <Sponge onClean={() => {this.setState({cleanliness: this.state.cleanliness + 0.2})}}/>
        }

        if (this.props.action == "feed") {
            action = <Food onFood={() => {this.setState({hunger: this.state.hunger + 0.2})}}/>
        }

        if (this.props.action == "play") {
            action = <Toy onFun={(speed) => {this.setState({fun: this.state.fun + 0.005 * speed})}}/>
        }

        let imageUri = "http://pokestadium.com/sprites/xy/" + this.state.data.name + ".gif";
        let name = this.state.data.name;
        if (name) {
            name = name.charAt(0).toUpperCase() + name.slice(1);
        }

        let buttons = <View style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
        }}>
            <Text style={{ fontSize: 24, paddingVertical: 20, fontWeight: "bold" }}>{name}</Text>
            <TouchableHighlight onPress={() => this.playRecording()}>
            <Image source={{ uri: imageUri }} style={{ width: 200, height: 200, resizeMode: "contain" }} />
            </TouchableHighlight>
            <Text style={{ fontSize: 18 }}>Hunger: {Math.round(this.state.hunger)}</Text>
            <Text style={{ fontSize: 18 }}>Cleanliness: {Math.round(this.state.cleanliness)}</Text>
            <Text style={{ fontSize: 18 }}>Fun: {Math.round(this.state.fun)}</Text>
        </View>;

        if (!this.state.alive) {
            buttons =
                <TouchableOpacity style={{ padding: 15, alignItems: 'center',
                justifyContent: 'center'}} activeOpacity={0.5} onPress={() => {
                    let newID = (Math.floor(Math.random() * 100) + 1);
                    this.save(newID);
                    this.savePokStats(this.state);

                    this.setState({
                        id: newID,
                        update: "updated",
                    });
                    

                    if (Platform.OS === 'ios') {
                        Haptic.selection();
                    }

                    name = name + " [DEAD]";
                }}>
                    <Text style={{ paddingHorizontal: 15, color: "black", fontSize: 20, fontWeight: "bold" }}>Your Pokémon died</Text>
                    <MaterialCommunityIcons name="egg" size={150} color="floralwhite" />
                    <Text style={{ paddingHorizontal: 15, color: "black", fontSize: 20 }}>Press to hatch a new Pokémon</Text>
                </TouchableOpacity>
        }

        return <View style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
        }}>
            {buttons}
            {action}
        </View>;
    }
}
//
