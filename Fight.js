import React from 'react';
import { Text, View, Button, TextInput, Alert, ImageBackground, SafeAreaView } from 'react-native';
import Model from './Model';
import Arena from './Arena';
import PubNub from 'pubnub';

const remote = 'https://pbs.twimg.com/media/DVMT-6OXcAE2rZY.jpg';

export default class Fight extends React.Component {
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
      pokemonID: this.props.navigation.getParam("pokemon", "1"),
      opponent: "",
      opponentPokemonID: 0,
      fightState: "ready",
      fightChannel: ""
    };

  }

  componentDidMount() {
    this.pubnub = new PubNub({
      subscribeKey: "sub-c-ff0c5120-7702-11e9-945c-2ea711aa6b65",
      publishKey: "pub-c-ab1f1896-d4ac-4b70-aaf4-ca968c88c2f5",
      secretKey: "sec-c-NjI1MjhlNDEtNmEwYi00NjNmLWJkYTgtNDYwNzFhZDBkNmQz",
      ssl: true,
      uuid: this.state.username
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
          if (msg.user == this.state.username && msg.action == "fight") {
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
            alert("accepted fight");
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
            alert("declined fight");
            this.setState({ fightState: "ready" });
          }
        }

        else if (this.state.fightState = "fight") {
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
        console.log(p)
        console.log("kör presence")
        console.log("users: ", p.uuid)
        console.log("action: ", p.action)
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
    console.log("inne i fight: ", p)
    console.log("pokemonID: ", this.state.pokemonID)
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

    this.setState({ fightState: "ready" });

    this.pubnub.subscribe({
      channels: ["Fight"]
    })

    this.pubnub.unsubscribe({
      channels: [this.state.fightChannel]
    })
  }

  render() {
    const resizeMode = 'center';
    let content = this.state.users.map(function (user) {
      if (this.state.username != user)
        return <Button title={user} key={user} onPress={() => { this.FightUser(user) }} />
    }.bind(this));

    if (this.state.fightState == "fight") {
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
        <SafeAreaView style={{flex:1, justifyContent: "space-between", flexDirection: 'column', backgroundColor: 'transparent'}}>
            <Text>{this.state.fightState}</Text>
            <View>
            {content}
            </View>
            <Button title="Back" onPress={(() => this.props.navigation.goBack()).bind(this)} />
        </SafeAreaView>
    </ImageBackground>


    )

  }

}
