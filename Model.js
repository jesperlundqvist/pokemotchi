import {AsyncStorage} from 'react-native';
import React from 'react';
import { Text, View, Image } from 'react-native';


export default class Model extends React.Component{
    constructor(props) {
    super(props);

    //AsyncStorage.getItem(key)

    }

    static getAllPokemon() {
        return fetch("https://pokeapi.co/api/v2/pokemon/").then((res) => res.json());
    }

    static getPokemonById(id) {
        return fetch("https://pokeapi.co/api/v2/pokemon/" + id).then((res) => res.json());
    }

    static favPok(element) {
      console.log("model");
      console.log(element.name);
      //AsyncStorage.setItem(key, value)
      AsyncStorage.setItem("pokemon", element);
    }
}
