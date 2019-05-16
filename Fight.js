import React from 'react';
import { Text, View, Button } from 'react-native';
import Model from './Model';
import PubNub from 'pubnub';

export default class Fight extends React.Component {
  constructor(props) {
    super(props);
    console.log("fight")
    console.log("component...")
    this.pubnub = new PubNub({
      subscribeKey: "sub-c-ff0c5120-7702-11e9-945c-2ea711aa6b65",
      publishKey: "pub-c-ab1f1896-d4ac-4b70-aaf4-ca968c88c2f5",
      secretKey: "sec-c-NjI1MjhlNDEtNmEwYi00NjNmLWJkYTgtNDYwNzFhZDBkNmQz",
      ssl: true,
      uuid: "Machi"
    })
    this.state = {
      pubnub: this.pubnub,
      data: {},
      hunger: 100,
      cleanliness: 100,
      fun: 100,
      alive: true,
      occupancy: null,
      users: [],
      back: this.props.navigation,
      inArena: false
    };

    this.state.pubnub.addListener({
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
        //console.log("message")
        //console.log(m)
        console.log("message: ", m.message)
        var channelName = m.channel; // The channel for which the message belongs
        var channelGroup = m.subscription; // The channel group or wildcard subscription match (if exists)
        var pubTT = m.timetoken; // Publish timetoken
        var msg = m.message; // The Payload
        var publisher = m.publisher; //The Publisher
      },
      presence: function (p) {
        console.log(p)
        console.log("kör presence")
        console.log("users: ", p.uuid)
        console.log("action: ", p.action)
        console.log("Channel: ", p.channel)
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

  }

  JoinBattleArena() {
    this.state.pubnub.subscribe({
      channels: ["Fight"],
      withPresence: true
    });

    this.state.pubnub.hereNow(
      {
        channels: ["Fight"],
        includeUUIDs: true,
        includeState: true
      },
      function (status, response) {
        this.setState({
          occupancy: response.totalOccupancy,
          users: response.channels.Fight.occupants
        })

      }.bind(this)
    );

    this.setState({ inArena: true });
  }

  LeaveArena() {
    this.state.pubnub.unsubscribe({
      channels: ['Fight']
    })
    //this.state.back.goBack()
    this.setState({ inArena: false, users: [] });
  }

  FightUser() {
    this.state.pubnub.publish(
      {
        message: {
          action: 'fight',
          my_pokemon: 'pikachu',
          user: 'joppe'
        },
        channel: 'Fight',
        sendByPost: false, // true to send via POST
        storeInHistory: false, //override default storage options
        meta: {
          "cool": "meta"
        } // publish extra meta with the request
      },
      function (status, response) {
        // handle status, response
      }
    );
  }

  render() {

    let buttons = <Button title="Join battle arena" onPress={() => {
      this.JoinBattleArena()
    }} />;

    if (this.state.inArena) {
      buttons = <View>
        <Button title="Send message" onPress={() => {
          this.FightUser()
        }} />
        <Button title="Leave battle arena" onPress={() => {
          this.LeaveArena()
        }} />
      </View>;
    }

    let users = this.state.users

    return (
      <View>

        {buttons}
        <Text>
          Occupants: {this.state.occupancy}
        </Text>
        <Text>
          Users: {JSON.stringify(this.state.users)}
        </Text>
      </View>

    )

  }

}
