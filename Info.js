import React from 'react';
import { View, SafeAreaView, Text, StatusBar } from 'react-native';
import { MaterialCommunityIcons, Entypo } from '@expo/vector-icons';

export default class Info extends React.Component {
    static navigationOptions = {
    };

    constructor(props) {
        super(props);

        this.state = {
        };
    }

    componentDidMount() {
    }

    componentWillUnmount() {
    }

    render() {
        return(<SafeAreaView>
            <StatusBar backgroundColor="white" barStyle="dark-content" />
            <Text style={{fontSize: 17, textAlign: "center", fontWeight: "bold", paddingVertical:20}}>Here you can find information about Pokemotchi!</Text>
            <Text style={{fontSize: 15, paddingHorizontal: 5}}>Take care of your pokémon by feeding, cleaning and playing with it. 
            You can also interact with your friends in the battle arena where you can fight against their pokémon.</Text>
            <View style={{flexDirection: "row", textAlign: "center", padding: 10}}>
            <MaterialCommunityIcons name="food-apple" size={20} color="greenyellow"/>
            <Text style={{fontSize: 15, fontWeight: "bold", paddingHorizontal: 5}}>Feed your pokémon by holding your phone level.</Text>
            </View>
            <View style={{flexDirection: "row", textAlign: "center", padding: 10}}>
            <Entypo name="water" size={20} color="skyblue" />
            <Text style={{fontSize: 15, fontWeight: "bold", textAlign: "center",paddingHorizontal: 5}}>Clean your pokémon by dragging the blue cirkle over the pokémon.</Text>
            </View>
            <View style={{flexDirection: "row", textAlign: "center", padding: 10}}>
            <MaterialCommunityIcons name="basketball" size={20} color="orange" />
            <Text style={{fontSize: 15, fontWeight: "bold", textAlign: "center", paddingHorizontal: 5}}>Play with your pokémon by shaking your phone.</Text>
            </View>
            <View style={{flexDirection: "row", textAlign: "center", padding: 10}}>
            <MaterialCommunityIcons name="sword-cross" size={20} color="lightgray" />
            <Text style={{fontSize: 15, fontWeight: "bold", textAlign: "center", paddingHorizontal: 5}}>Fight with your pokémon by going to the Fighting arena.</Text>
            </View>
            <View style={{flexDirection: "row", textAlign: "center", padding: 10}}>
            <MaterialCommunityIcons name="sword-cross" size={20} color="lightgray" />
            <Text style={{fontSize: 17, fontWeight: "bold", paddingHorizontal: 5}}>Fight</Text>
            </View>
            <Text style={{fontSize: 15, paddingHorizontal: 10}}>To fight other users, press on the other users pokémon as fast as possible. The user who's the fastest win!</Text>
        </SafeAreaView>);
    }
}
