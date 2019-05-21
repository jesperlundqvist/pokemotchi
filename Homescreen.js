import React from 'react';
import { SafeAreaView, View, Button, TextInput, Text } from 'react-native';
import { TouchableOpacity } from 'react-native'
import { createStackNavigator, createAppContainer } from 'react-navigation';
import { MaterialCommunityIcons, Entypo } from '@expo/vector-icons';
import Pokemon from './Pokemon';
import { Haptic } from 'expo';

export default class Homescreen extends React.Component {
    static navigationOptions = {
        title: 'Welcome'
    };

    constructor(props) {
        super(props);
        this.state = {
            pokemonId: Math.floor(Math.random() * 100) + 1,
            pokemonAlive: true,
            action: "neutral"
        }
    }

    render() {

        const { navigate } = this.props.navigation;

        console.log('skickar in i fight')
        console.log(this.state.pokemonId)
        let buttons = <View style={ {flexDirection: "row"}}>
        <TouchableOpacity style={{padding: 15}} activeOpacity={0.5} onPress={() => {
            Haptic.selection();
        }}>
            <MaterialCommunityIcons name="food-apple" size={60} color="green" />
            <Text style={{paddingHorizontal: 15}}>Feed</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{padding: 15}} activeOpacity={0.5} onPress={() => {
            Haptic.selection();
        }}>
            <Entypo name="water" size={60} color="skyblue" />
            <Text style={{paddingHorizontal: 15}}>Clean</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{padding: 15}} activeOpacity={0.5} onPress={() => {
            Haptic.selection();
        }}>
            <MaterialCommunityIcons name="basketball" size={60} color="orange" />
            <Text style={{paddingHorizontal: 15}}>Play</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{padding: 15}} activeOpacity={0.5} onPress={() => {
            navigate('Fight', { username: "Joppe", pokemon: this.state.pokemonId })
            Haptic.selection();
        }}>
            <MaterialCommunityIcons name="sword-cross" size={60} color="grey" />
            <Text style={{paddingHorizontal: 15}}>Fight</Text>
        </TouchableOpacity>
</View>;



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
            <SafeAreaView style={{
                flex: 1,
                flexDirection: 'column',
            }}>
                <Pokemon style={{ flexGrow: 1 }} id={this.state.pokemonId} onAliveChange={(alive) => this.setState({ pokemonAlive: alive })} />
                <View style={{ flexDirection: "row", flexShrink: 1, justifyContent: "center" }}>
                    {buttons}
                </View>
            </SafeAreaView>
        );
    }
}
