import React from 'react';
import { SafeAreaView, View, Button, TextInput, Text, ImageBackground, StatusBar } from 'react-native';
import { TouchableOpacity } from 'react-native'
import { createStackNavigator, createAppContainer } from 'react-navigation';
import { MaterialCommunityIcons, Entypo, FontAwesome } from '@expo/vector-icons';
import Pokemon from './Pokemon';
import { Haptic } from 'expo';
import { Vibration, Platform } from 'react-native';

export default class Homescreen extends React.Component {
    static navigationOptions = ({ navigation }) => {
        return {
            headerTransparent: true,
            headerTintColor: "white",
            headerRight:
                <TouchableOpacity style={{ marginRight: 10 }} activeOpacity={0.5} onPress={() => navigation.navigate("Info")}>
                    <MaterialCommunityIcons name="information-outline" size={30} color="white" />
                </TouchableOpacity>,
            headerLeft: <View style={{flexDirection: "row"}}><FontAwesome style={{ marginLeft: 10 }} name="user-o" size={30} color="white" /><Text style={{color: "white", padding: 3}}>{navigation.state.params.username}</Text></View>

        }
    }

    constructor(props) {
        super(props);
        console.log("username: ", this.props.navigation.state.params.username)
        this.state = {
            pokemonId: Math.floor(Math.random() * 100) + 1,
            pokemonAlive: true,
            action: "",
            userName: this.props.navigation.state.params.username
        }
    }

    render() {
        var remote = 'https://i.imgur.com/7SHNBH4.png';
        const resizeMode = 'center';
        const { navigate } = this.props.navigation;

        let text = <View></View>;

        if (this.state.action == "feed") {
            text = <Text style={{ fontSize: 16, textAlign: 'center', padding: 10, fontWeight: "bold", color: "white" }}>Hold your phone level to feed!</Text>
        }
        else if (this.state.action == "clean") {
            text = <Text style={{ fontSize: 16, textAlign: 'center', padding: 10, fontWeight: "bold", color: "white" }}>Rub the sponge on your Pokémon to clean!</Text>
        }
        else if (this.state.action == "play") {
            text = <Text style={{ fontSize: 16, textAlign: 'center', padding: 10, fontWeight: "bold", color: "white" }}>Shake your phone to play with your Pokémon!</Text>
        }

        let buttons = <View style={{ flexDirection: "row" }}>
            <TouchableOpacity style={{ padding: 15 }} activeOpacity={0.5} onPress={() => {
                if (Platform.OS === 'android') {
                    Vibration.vibrate(50);
                } else if (Platform.OS === 'ios') {
                    Haptic.selection();
                }

                if (this.state.action == "feed") {
                    this.setState({ action: "" });
                }
                else {
                    this.setState({ action: "feed" });
                }
            }}>
                <MaterialCommunityIcons name="food-apple" size={60} color={this.state.action == "feed" || this.state.action == "" ? "greenyellow" : "gray"} />
                <Text style={{ paddingHorizontal: 15, color: "white" }}>Feed</Text>
            </TouchableOpacity>

            <TouchableOpacity style={{ padding: 15 }} activeOpacity={0.5} onPress={() => {
                if (Platform.OS === 'android') {
                    Vibration.vibrate(50);
                } else if (Platform.OS === 'ios') {
                    Haptic.selection();
                }

                if (this.state.action == "clean") {
                    this.setState({ action: "" });
                }
                else {
                    this.setState({ action: "clean" });
                }
            }}>
                <Entypo name="water" size={60} color={this.state.action == "clean" || this.state.action == "" ? "skyblue" : "gray"} />
                <Text style={{ paddingHorizontal: 15, color: "white" }}>Clean</Text>
            </TouchableOpacity>

            <TouchableOpacity style={{ padding: 15 }} activeOpacity={0.5} onPress={() => {
                if (Platform.OS === 'android') {
                    Vibration.vibrate(50);
                } else if (Platform.OS === 'ios') {
                    Haptic.selection();
                }

                if (this.state.action == "play") {
                    this.setState({ action: "" });
                }
                else {
                    this.setState({ action: "play" });
                }
            }}>
                <MaterialCommunityIcons name="basketball" size={60} color={this.state.action == "play" || this.state.action == "" ? "orange" : "gray"} />
                <Text style={{ paddingHorizontal: 15, color: "white" }}>Play</Text>
            </TouchableOpacity>

            <TouchableOpacity style={{ padding: 15 }} activeOpacity={0.5} onPress={() => {
                if (Platform.OS === 'android') {
                    Vibration.vibrate(50);
                } else if (Platform.OS === 'ios') {
                    Haptic.selection();
                }

                navigate('Fight', { username: this.state.userName, pokemon: this.state.pokemonId })
            }}>
                <MaterialCommunityIcons name="sword-cross" size={60} color={this.state.action == "" ? "lightgray" : "gray"} />
                <Text style={{ paddingHorizontal: 15, color: "white" }}>Fight</Text>
            </TouchableOpacity>
        </View>;

        if (!this.state.pokemonAlive) {
            buttons = <View></View>;
        }

        /*if (!this.state.pokemonAlive) {
            buttons = <Button title="New Pokemon" onPress={() => {
                let newPokemon = Math.floor(Math.random() * 10)+1;

                while (newPokemon == this.state.pokemonId) {
                    newPokemon = Math.floor(Math.random() * 10)+1;
                }

                this.setState({
                    pokemonId: newPokemon
                });
            }} />
        }*/



        return (
            <ImageBackground
                style={{
                    backgroundColor: '#ccc',
                    flex: 1,
                    resizeMode,
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    justifyContent: 'center',
                }}
                source={{ uri: remote }}
            >
                <SafeAreaView style={{
                    flex: 1,
                    flexDirection: 'column',
                }}>
                    <StatusBar backgroundColor="blue" barStyle="light-content" />
                    <Pokemon style={{ flexGrow: 1 }} id={this.state.pokemonId} action={this.state.action} onAliveChange={(alive) => this.setState({ pokemonAlive: alive })} />
                    {text}
                    <View style={{ flexDirection: "row", flexShrink: 1, justifyContent: "center" }}>
                        {buttons}
                    </View>
                </SafeAreaView>
            </ImageBackground>
        );
    }
}
