import React from 'react';
import { SafeAreaView, View, Button, TextInput, Text, ImageBackground, StatusBar, ActivityIndicator } from 'react-native';
import { TouchableOpacity } from 'react-native'
import { createStackNavigator, createAppContainer } from 'react-navigation';
import { MaterialCommunityIcons, Entypo, FontAwesome } from '@expo/vector-icons';
import Pokemon from './Pokemon';
import { Haptic } from 'expo';
import { Vibration, Platform } from 'react-native';
import { AsyncStorage } from 'react-native';
import Start from './getStarted';


export default class Homescreen extends React.Component {
    static navigationOptions = ({ navigation }) => {
        return {
            headerTransparent: true,
            headerTintColor: "white",
            headerRight:
                <TouchableOpacity style={{ marginRight: 10 }} activeOpacity={0.5} onPress={() => navigation.navigate("Info")}>
                    <MaterialCommunityIcons name="information-outline" size={30} color="white" />
                </TouchableOpacity>,
            headerLeft: null

        }
    }

    constructor(props) {
        super(props);
        this.state = {
            pokemonAlive: 'false',
            action: "",
            userName: "",
            show: true,
            status: "LOADING",
        }
    }

    componentDidMount() {
      this.loadUsername();
      this.getLifeStatus();

      //för att rensa storage!!!! kommetera bort de ovanstående raderna i componentDidMount()
      /*
      this.removeItemValue("pokemonID");
        this.removeItemValue("pokemonHunger")
        this.removeItemValue("pokemonClean")
        this.removeItemValue("pokemonFun")
        this.removeItemValue("pokemonAlive")
        this.removeItemValue("username")
      */

    }

    removeItemValue = async (key) => {
        try {
            await AsyncStorage.removeItem(key);
            return true;
        }
        catch (exception) {
            return false;
        }
    }

    getLifeStatus = async () => {
        const life_status = await AsyncStorage.getItem("pokemonAlive");
        this.setState({ pokemonAlive: life_status })
    }

    loadUsername = async () => {
        const username = await AsyncStorage.getItem("username");
        if (username == null) {
            //true = visa Start component
            this.setState({
              show: true,
              status: "LOADED" });
        } else {
            //false = inte visa Start component
            this.setState({
                show: false,
                status: "LOADED",
                userName: username
            });
            //this.setState({ userName: username });
        }
        return "resolved"
    }

    printNAme = async () => {
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


    render() {
        var remote = 'https://i.imgur.com/7SHNBH4.png';
        const resizeMode = 'center';
        const { navigate } = this.props.navigation;

        let text = <View></View>;

        if (this.state.action == "feed") {
            text = <Text style={{ fontSize: 16, textAlign: 'center', padding: 10, fontWeight: "bold", color: "white" }}>Drag the apple to your Pokémon to feed!</Text>
        }
        else if (this.state.action == "clean") {
            text = <Text style={{ fontSize: 16, textAlign: 'center', padding: 10, fontWeight: "bold", color: "white" }}>Shower your Pokémon to clean it!</Text>
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
                console.log(this.state.userName)
                navigate('Fight', { username: this.state.userName })
            }}>
                <MaterialCommunityIcons name="sword-cross" size={60} color={this.state.action == "" ? "lightgray" : "gray"} />
                <Text style={{ paddingHorizontal: 15, color: "white" }}>Fight</Text>
            </TouchableOpacity>
        </View>;

        if (this.state.pokemonAlive == 'false') {
            buttons = <View></View>
        }

        let user = <View></View>;

        if (this.state.status == "LOADED") {

            if (this.state.show == false) {
                user = <SafeAreaView style={{
                    flex: 1,
                    flexDirection: 'column',
                }}>
                    <StatusBar backgroundColor="blue" barStyle="light-content" />
                    <Pokemon style={{ flexGrow: 1 }} action={this.state.action}
                        onAliveChange={(alive) => this.setState({ pokemonAlive: alive })} />
                    {text}
                    <View style={{ flexDirection: "row", flexShrink: 1, justifyContent: "center" }}>
                        {buttons}
                    </View>
                </SafeAreaView>
            }


            else {
                user = <Start onShow={() => {
                    this.setState({ show: false })
                }} />

                remote = "http://miniwallist.com/wp-content/uploads/2016/07/pokemon-go-pokeball-mobile-wallpaper-minimalist-2160x3840.jpg";
            }

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
                    {user}

                </ImageBackground>
            )

        }

        else if (this.state.status == "LOADING") {

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
                    <ActivityIndicator size="large" color="#ffffff" />

                </ImageBackground>
            )
        }
    }
}
