import React from 'react';
import { Text, View, Alert, ImageBackground, SafeAreaView, Image, ActivityIndicator, TouchableOpacity, StatusBar } from 'react-native';
import Model from './Model';
import { MaterialCommunityIcons, Entypo, FontAwesome} from '@expo/vector-icons';
import Arena from './Arena';
import PubNub from 'pubnub';
import ProgressBar from 'react-native-progress/Bar';


export default class Fight extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerTransparent: true,
      headerTintColor: "white",
      headerRight:
      <View style={{flexDirection: "row"}}>
      <View style={{flexDirection: "row", paddingEnd: 60, paddingTop: 4}}>
        <FontAwesome style={{ marginLeft: 10 }} name="user-o" size={30} color="white" />
        <Text style={{color: "white", padding: 5, fontSize: 15, fontWeight: "bold"}}>{navigation.state.params.username}</Text>
        </View>
        <TouchableOpacity style={{ marginRight: 10 }} activeOpacity={0.5} onPress={() => navigation.navigate("Info")}>
          <MaterialCommunityIcons name="information-outline" size={30} color="white" />
        </TouchableOpacity>
        </View>
        ,
    }
  }

  constructor(props) {
    super(props);
    console.log("fight")
    console.log("component...")

    this.state = {
      data: {},
      hunger: 100,
      cleanliness: 100,
      fun: 100,
      alive: true,
      occupancy: null,
      users: [],
      back: this.props.navigation,
      inArena: false,
      username: this.props.navigation.getParam("username", "Username"),
      pokemonID: "",
      opponent: "",
      opponentPokemonID: 0,
      fightState: "ready",
      fightChannel: "",
      level: 1,
      progress_next_level: 0,
    };

  }

  getPokemonID = async () => {
    const id = await AsyncStorage.getItem("pokemonID");
    console.log('synkar med async')
    console.log({pokemonId: id})
    this.setState(integer({pokemonID: id}))
  }


  componentDidMount() {
    this.getPokemonID()

    this.pubnub = new PubNub({
      subscribeKey: "sub-c-ff0c5120-7702-11e9-945c-2ea711aa6b65",
      publishKey: "pub-c-ab1f1896-d4ac-4b70-aaf4-ca968c88c2f5",
      secretKey: "sec-c-NjI1MjhlNDEtNmEwYi00NjNmLWJkYTgtNDYwNzFhZDBkNmQz",
      ssl: true,
      uuid: this.state.username,
    })

    this.pubnub.addListener({
      status: function (s) {
        console.log("status")
        console.log(s);
        if (s.category === "PNConnectedCategory") {
          ready = true;
        }

        var affectedChannelGroups = s.affectedChannelGroups;
        var affectedChannels = s.affectedChannels;
        var category = s.category;
        var operation = s.operation;
      },
      message: function (m) {
        // handle message
        console.log("message")
        console.log(m)
        var channelName = m.channel; // The channel for which the message belongs
        var channelGroup = m.subscription; // The channel group or wildcard subscription match (if exists)
        var pubTT = m.timetoken; // Publish timetoken
        var msg = m.message; // The Payload
        var publisher = m.publisher; //The Publisher

        if (this.state.fightState == "ready") {
          if (msg.user == this.state.username && msg.action == "fight" && this.state.fightState) { //Ska det stå && this.state.fighState
            this.setState({ fightState: "pending" });//Kanske borde ändras? MEst för att man inte ska synas för folk när man fått en request
            Model.getPokemonById(msg.my_pokemon).then((pokemon) => {
              Alert.alert("Fight", "fight från " + publisher + "'s " + pokemon.name, [
                {
                  text: "Yes!", onPress: (() => {
                    this.pubnub.publish(
                      {
                        message: {
                          action: 'accept',
                          my_pokemon: this.state.pokemonID,
                          user: publisher
                        },
                        channel: 'Fight'
                      });

                    this.pubnub.unsubscribe({
                      channels: ['Fight']
                    })

                    let channelName = publisher + this.state.username;

                    this.pubnub.subscribe({
                      channels: [channelName]
                    });

                    this.setState({ fightState: "fight", opponentPokemonID: msg.my_pokemon, opponent: publisher, fightChannel: channelName });
                  }).bind(this)
                },
                {
                  text: "No!", onPress: (() => {
                    this.pubnub.publish(
                      {
                        message: {
                          action: 'decline',
                          my_pokemon: this.state.pokemonID,
                          user: publisher
                        },
                        channel: 'Fight'
                      });

                    this.setState({ fightState: "ready" });
                  }).bind(this)
                }]);


            });
          }
        }

        else if (this.state.fightState == "pending") {
          if (msg.user == this.state.username && msg.action == "accept") {
            alert("Accepted fight");
            this.pubnub.unsubscribe({
              channels: ['Fight']
            })

            let channelName = this.state.username + publisher;

            this.pubnub.subscribe({
              channels: [channelName]
            });

            this.setState({ fightState: "fight", opponentPokemonID: msg.my_pokemon, opponent: publisher, fightChannel: channelName });
          }
          else if (msg.user == this.state.username && msg.action == "decline") {
            alert("Declined fight");
            this.setState({ fightState: "ready" });
          }
        }

        else if (this.state.fightState == "fight") {
          if (msg.user == this.state.username && msg.action == "exit") {
            this.setState({ fightState: "ready" });
            this.pubnub.subscribe({
              channels: ["Fight"]
            });
            this.pubnub.unsubscribe({
              channels: this.state.fightChannel
            });
          }

          else if (msg.user == this.state.username && msg.action == "victory") {
            alert("Du förlorade :(");
            this.setState({ fightState: "ready" });
            this.pubnub.subscribe({
              channels: ["Fight"]
            });
            this.pubnub.unsubscribe({
              channels: [this.state.fightChannel]
            });
          }
        }
      }.bind(this),
      presence: function (p) {
        // handle presence
        var action = p.action; // Can be join, leave, state-change or timeout
        var channelName = p.channel; // The channel for which the message belongs

        if (p.action == "join") {
          this.setState({ users: this.state.users.concat([p.uuid]) });
        }
        else if (p.action = "leave") {
          let users = this.state.users;
          var index = users.indexOf(p.uuid);
          if (index !== -1) users.splice(index, 1);
          this.setState({ users: users });
        }

        this.setState({
          occupancy: p.occupancy
        })

        var occupancy = p.occupancy; // No. of users connected with the channel
        var state = p.state; // User State
        var publishTime = p.timestamp; // Publish timetoken
        var timetoken = p.timetoken;  // Current timetoken
        var uuid = p.uuid; // UUIDs of users who are connected with the channel

      }.bind(this)
    })

    this.pubnub.subscribe({
      channels: ["Fight"],
      withPresence: true
    });

    this.pubnub.hereNow(
      {
        channels: ["Fight"],
        includeUUIDs: true,
        includeState: true
      },
      function (status, response) {
        let users = [];
        response.channels.Fight.occupants.forEach((val) => {
          users.push(val.uuid);
        });

        this.setState({
          occupancy: response.totalOccupancy,
          users: users
        })

      }.bind(this)
    );
  }

  componentWillUnmount() {
    if (this.state.fightState == "fight") {
      this.pubnub.publish(
        {
          message: {
            action: 'exit',
            my_pokemon: this.state.pokemonID,
            user: this.state.opponent
          },
          channel: 'Fight'
        });

      this.pubnub.unsubscribe({
        channels: [this.state.fightChannel]
      })
    }
    else {
      this.pubnub.unsubscribe({
        channels: ['Fight']
      })
    }
  }

  FightUser(p) {
    this.pubnub.publish(
      {
        message: {
          action: 'fight',
          my_pokemon: this.state.pokemonID,
          user: p
        },
        channel: 'Fight',
        sendByPost: false, // true to send via POST
        storeInHistory: false, //override default storage options
        meta: {
          "cool": "meta"
        } // publish extra meta with the request
      },
      function (status, response) {
        this.setState({
          fightState: "pending"
        });

        setTimeout(() => {
          if (this.state.fightState == "pending") {
            alert("timeout");
            this.setState({ fightState: "ready" });
          }
        }, 10000);
      }.bind(this)
    );
  }

  victory() {
    alert("Du vann!");

    this.pubnub.publish(
      {
        message: {
          action: 'victory',
          my_pokemon: this.state.pokemonID,
          user: this.state.opponent
        },
        channel: this.state.fightChannel
      });
    let new_progress = this.state.progress_next_level+0.2;
    if (new_progress == 1) {
      let new_level = this.state.level+1;
      this.setState({ level: new_level });
      alert("You reached the next level!")
    }

    this.setState({ fightState: "ready", progress_next_level: new_progress });

    this.pubnub.subscribe({
      channels: ["Fight"]
    })

    this.pubnub.unsubscribe({
      channels: [this.state.fightChannel]
    })
  }


  render() {
    var remote = 'https://pbs.twimg.com/media/DVMT-6OXcAE2rZY.jpg';
    const resizeMode = 'center';
    users_online = this.state.users.map(function (user) {
      console.log("user: ", user)
      if (this.state.username != user)
        return <TouchableOpacity style={{ flexDirection: "row" }} title={user} key={user} onPress={() => { this.FightUser(user) }} >
          <MaterialCommunityIcons name="sword-cross" size={30} color="lightgray" />
          <Text style={{ fontSize: 25, color: "white", fontWeight: "bold", paddingHorizontal: 15 }}>{user}</Text>
        </TouchableOpacity>
    }.bind(this));

    let content = <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontSize: 20, color: "white", fontWeight: "bold", paddingVertical: 15 }}>
        Press on a user to start a fight!
    </Text>
      {users_online}
    </View>;

    console.log("length: ", this.state.users.length)
    if (this.state.users.length <= 1) {
      content = <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}><Text style={{ fontSize: 25, color: "white", fontWeight: "bold" }}>The arena is empty</Text><Entypo name="emoji-sad" size={60} color="white" style={{ paddingVertical: 20 }} /></View>
    }

    if (this.state.fightState == "pending") {
      content = <View><Image style={{ width: 180, height: 180, resizeMode: "contain"}} source={{ uri: "http://25.media.tumblr.com/c99a579db3ae0fc164bf4cca148885d3/tumblr_mjgv8kEuMg1s87n79o1_400.gif" }}/><ActivityIndicator size="large" color="#ffffff" /></View>
    }

    if (this.state.fightState == "fight") {
      console.log('skickas in i fight')
      console.log(this.state.pokemonID)
      console.log(this.state.opponentPokemonID)
      content = <Arena myId={this.state.pokemonID} theirId={this.state.opponentPokemonID} onVictory={() => { this.victory() }} />;


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
        <StatusBar backgroundColor="green" barStyle="light-content" />
        <SafeAreaView style={{ flex: 1, justifyContent: "space-between", flexDirection: 'column', backgroundColor: 'transparent' }}>
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            {content}
            <View style={{ flexDirection: "column", paddingHorizontal: 30, alignItems: 'center', justifyContent: 'center', padding:30  }}>
              <ProgressBar progress={this.state.progress_next_level} width={200} height={15} color="midnightblue" />
              <Text style={{ fontSize: 15 , paddingHorizontal:10}}>Level: {this.state.level}</Text>
            </View>
          </View>
        </SafeAreaView>
      </ImageBackground>


    )

  }

}
