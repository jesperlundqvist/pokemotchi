import React from 'react';
import { Text, View, Image, Button, TouchableOpacity, TouchableHighlight, Platform, ImageBackground } from 'react-native';
import Model from './Model';
import Clean from './Clean';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AsyncStorage } from 'react-native';
import Food from './Food';
import Toy from './Toy';
import { Haptic, Audio } from 'expo';
import ProgressBar from 'react-native-progress/Bar';


export default class Pokemon extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {},
            hunger: "",
            cleanliness: "",
            fun: "",
            alive: true,
            id: "x",
            update: "",
        };
    }

    componentDidMount() {
        let promise1 = new Promise((resolved, unresolved) => {
            resolved(this.load());
        })

        promise1.then(() =>
            console.log(this.state.alive))
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
                        hunger: "",
                        cleanliness: "",
                        fun: "",
                        alive: false
                    });
                }
                else {
                    this.setState({
                        hunger: this.state.hunger - 1,
                        cleanliness: this.state.cleanliness - 1,
                        fun: this.state.fun - 1
                    });

                    if (this.state.hunger % 10 == 0) {
                        this.savePokStats(this.state);
                    }

                }
            }
        }, 2000);
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.state.alive != prevState.alive) {
            if (this.props.onAliveChange) {
                this.props.onAliveChange(this.state.alive);
            }
        }

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
        console.log(hunger)
        if (hunger != null) {
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

        const { sound } = await Audio.Sound.createAsync({ uri: 'https://veekun.com/dex/media/pokemon/cries/' + String(this.state.id) + '.ogg' });

        await sound.playAsync();

        //'https://veekun.com/dex/media/pokemon/cries/1.ogg'

    }

    componentWillUnmount() {
        clearInterval(this._interval);
    }

    render() {

        let action = <View></View>;
        let imageUri = "http://pokestadium.com/sprites/xy/" + this.state.data.name + ".gif";
        let name = this.state.data.name;

        let color_hunger = "green";
        if (this.state.hunger < 75) {
            color_hunger = "greenyellow";
        }
        if (this.state.hunger < 50) {
            color_hunger = "yellow";
        }
        if (this.state.hunger < 30) {
            color_hunger = "orange";
        }
        if (this.state.hunger < 20) {
            color_hunger = "red";
        }

        let color_cleanliness = "green";
        if (this.state.cleanliness < 75) {
            color_cleanliness = "greenyellow";
        }
        if (this.state.cleanliness < 50) {
            color_cleanliness = "yellow";
        }
        if (this.state.cleanliness < 30) {
            color_cleanliness = "orange";
        }
        if (this.state.cleanliness < 20) {
            color_cleanliness = "red";
        }

        let color_fun = "green";
        if (this.state.fun < 75) {
            color_fun = "greenyellow";
        }
        if (this.state.fun < 50) {
            color_fun = "yellow";
        }
        if (this.state.fun < 30) {
            color_fun = "orange";
        }
        if (this.state.fun < 20) {
            color_fun = "red";
        }

        let newPokemon = <View style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',

        }}>
            <Text style={{ fontSize: 18, fontWeight: "bold" }}>{name}</Text>
            <TouchableHighlight onPress={() => this.playRecording()}>
                <Image source={{ uri: imageUri }} style={{ width: 200, height: 200, resizeMode: "contain" }} />
            </TouchableHighlight>
            <Text style={{ fontSize: 18, paddingTop: 15 }}>Hunger: {Math.round(this.state.hunger)}%</Text>
            <ProgressBar progress={this.state.hunger * 0.01} width={200} color={color_hunger} />
            <Text style={{ fontSize: 18 }}>Cleanliness: {Math.round(this.state.cleanliness)}%</Text>
            <ProgressBar progress={this.state.cleanliness * 0.01} width={200} color={color_cleanliness} />
            <Text style={{ fontSize: 18 }}>Fun: {Math.round(this.state.fun)}%</Text>
            <ProgressBar progress={this.state.fun * 0.01} width={200} color={color_fun} />
        </View>;

        if (!this.state.alive) {
            newPokemon =
                <TouchableOpacity style={{
                    padding: 15, alignItems: 'center',
                    justifyContent: 'center'
                }} activeOpacity={0.5} onPress={() => {
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
                    <Text style={{ paddingHorizontal: 15, color: "black", fontSize: 20, fontWeight: "bold" }}>Oh no! Your Pokémon died!</Text>
                    <Image style={{ width: 180, height: 180, resizeMode: "contain" }} source={{ uri: "http://33.media.tumblr.com/18a645e8cae6526b567b17919ea65d54/tumblr_n4mlhyk5wT1qa0qrko1_500.gif" }} />
                    <Text style={{ paddingHorizontal: 15, color: "black", fontSize: 20, paddingVertical: 20 }}>Press to hatch a new Pokémon</Text>
                </TouchableOpacity>

            action = <View></View>;
        }

        return <View style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
        }}>
            {newPokemon}
            {action}
        </View>;
    }
}
//
