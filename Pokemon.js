import React from 'react';
import { Text, View, Image, Button, ActivityIndicator, TouchableOpacity, TouchableHighlight, Platform, ImageBackground } from 'react-native';
import Model from './Model';
import Clean from './Clean';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AsyncStorage } from 'react-native';
import Food from './Food';
import Toy from './Toy';
import { Haptic, Audio } from 'expo';
import ProgressBar from 'react-native-progress/Bar';
import * as Progress from 'react-native-progress';


export default class Pokemon extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {},
            hunger: "",
            cleanliness: "",
            fun: "",
            alive: 'true',
            id: "x",
            update: "",
            contentStatus: "LOADING",
        };
    }

    componentDidMount() {

        let promise1 = new Promise((resolved, unresolved) => {
            resolved(this.load());
        })

        promise1.then(() =>
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
                        alive: 'false'
                    });
                    this.savePokStats(this.state);
                }
                else {
                    this.setState({
                        hunger: this.state.hunger - 1,
                        cleanliness: this.state.cleanliness - 1,
                        fun: this.state.fun - 1,
                    });

                    if (this.state.hunger % 10 == 0 || this.state.hunger == 99) {
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
            Model.getPokemonById(this.state.id).then((data) => {
                this.setState({
                    data: data,
                    hunger: 100,
                    cleanliness: 100,
                    fun: 100,
                    alive: 'true',
                    update: "",
                });
            })
        }
    }

    randomId() {
        let newID = (Math.floor(Math.random() * 100) + 1);
        if (newID == 29 || newID == 32) {
            console.log("Ooops där blev det fel! ", newID);
            newID = newID + 1;
        }
        this.setState({ id: newID })
        this.save(this.state.id);
    }

    print = async () => {
        AsyncStorage.getAllKeys((err, keys) => {
            AsyncStorage.multiGet(keys, (err, stores) => {
                stores.map((result, i, store) => {
                    // get at each store's key/value so you can work with it
                    let key = store[i][0];
                    let value = store[i][1];
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
                alive: 'true',
            });
        }

        this.setState({ contentStatus: "LOADED" })

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

        let remote = "https://4.bp.blogspot.com/-gchMbKclwIQ/Vsgb1I06qLI/AAAAAAAAAE8/i4L89o19YNQ/s1600/11_iykim2000_2.gif";

        let action = <View></View>;
        if (this.props.action == "clean") {
            action = <Clean onClean={() => {
                if (this.state.cleanliness < 120) {
                    this.setState({ cleanliness: this.state.cleanliness + 0.2 })
                }
            }} />
        }

        if (this.props.action == "feed") {
            action = <Food onFood={() => {
                if (this.state.hunger < 120) {
                    this.setState({ hunger: this.state.hunger + 0.2 })
                }
            }} />
        }

        if (this.props.action == "play") {
            action = <Toy onFun={(speed) => {
                if (this.state.fun < 120) {
                    this.setState({ fun: this.state.fun + 0.005 * speed })
                }
            }} />
        }

        //if (this.state.data.name.split("-"))
        let imageUri = "http://pokestadium.com/sprites/xy/" + this.state.data.name + ".gif";
        let name = this.state.data.name;
        if (name) {
            name = name.charAt(0).toUpperCase() + name.slice(1);
        }

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
            <Text style={{ fontSize: 18, paddingTop: 15 }}>Hunger:</Text>
            <ProgressBar progress={this.state.hunger * 0.01} width={200} color={color_hunger} />
            <Text style={{ fontSize: 18 }}>Cleanliness:</Text>
            <ProgressBar progress={this.state.cleanliness * 0.01} width={200} color={color_cleanliness} />
            <Text style={{ fontSize: 18 }}>Fun:</Text>
            <ProgressBar progress={this.state.fun * 0.01} width={200} color={color_fun} />
        </View>;


        if (this.state.alive != 'true') {
            newPokemon =
                <TouchableOpacity style={{
                    padding: 15, alignItems: 'center',
                    justifyContent: 'center'
                }} activeOpacity={0.5} onPress={() => {
                    let newID = (Math.floor(Math.random() * 100) + 1);
                    console.log("id: ", newID)
                    if (newID == 29 || newID == 32) {
                        console.log("Ooops där blev det fel! ", newID);
                        newID = newID + 1;
                    }
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


        if (this.state.contentStatus == "LOADED") {

            return (
                <View style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                    {newPokemon}
                    {action}
                </View>)

        }

        else if (this.state.contentStatus == "LOADING") {

            return (
                <View style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                    <ActivityIndicator size="large" color="#ffffff" />
                </View>)

        }
    }
}
