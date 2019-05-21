import React from 'react';
import { Text, View, Image, Button } from 'react-native';
import Model from './Model';
import Sponge from './Sponge';
import { AsyncStorage } from 'react-native';
import Food from './Food';


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
                }
            }
        }, 250);
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
          });
        })
      }
    }

    randomId() {
        this.setState({ id: Math.floor(Math.random() * 10) + 1 })
        this.save(this.state.id);
    }

    print = async () => {
        AsyncStorage.getAllKeys((err, keys) => {
            AsyncStorage.multiGet(keys, (err, stores) => {
                stores.map((result, i, store) => {
                    // get at each store's key/value so you can work with it
                    let key = store[i][0];
                    let value = store[i][1];
                    console.log(key);
                    console.log(value);
                });
            });
        });
    }

    load = async () => {
        const id = await AsyncStorage.getItem("pokemon");

        if (id == "x" || id == null) {
            this.randomId();

        } else {
            this.setState({ id: id })
            //this.state.is = id;
            this.save(this.state.id);

        }
        return "resolved"
    }

    save = async (id) => {
        let stringID = String(id);
        try {
            await (AsyncStorage.setItem("pokemon", stringID))
            this.setState({ id: stringID })

        } catch (e) {
            console.error('Failed to save id.')
        }
    }

    componentWillUnmount() {
        clearInterval(this._interval);
    }

    whenDeadUpdate () {
      //this.setState ({ id: (Math.floor(Math.random() * 10)+1) });
      //this.setState ({ update: "updated" });
      //this.save(this.state.id);
      this.forceUpdate();
      console.log("foreced update");
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
            let newID = (Math.floor(Math.random() * 10)+1);
            this.save(newID);

            this.setState ({
              id:  newID,
              update: "updated",
            });
          }} />
          /*buttons = <Button title="New Pokemon" onPress={this.whenDeadUpdate}/>*/
          name = name + " [DEAD]";
        }


        return (

            <View
                style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Image source={{ uri: imageUri }} style={{ width: 200, height: 200, resizeMode: "contain" }} />
                <Text style={{ fontSize: 24 }}>{name} </Text>
                <Text style={{ fontSize: 18 }}>Hunger: {Math.round(this.state.hunger)} </Text>
                <Text style={{ fontSize: 18 }}>Cleanliness: {Math.round(this.state.cleanliness)} </Text>
                <Text style={{ fontSize: 18 }}>Fun: {Math.round(this.state.fun)} </Text>
                <Sponge onClean={() => { this.setState({ cleanliness: this.state.cleanliness + 0.2 }) }} />

                {buttons}
            </View>
        )
    }
}
//
