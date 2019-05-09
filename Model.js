export default class Model {
    static getAllPokemon() {
        return fetch("https://pokeapi.co/api/v2/pokemon/").then((res) => res.json());
    }

    static getPokemonById(id) {
        return fetch("https://pokeapi.co/api/v2/pokemon/" + id).then((res) => res.json());
    }
}
