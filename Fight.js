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
      users: null,
      back: this.props.navigation

    };

  }

  JoinBattleArena() {
   

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
        var channelName = m.channel; // The channel for which the message belongs
        var channelGroup = m.subscription; // The channel group or wildcard subscription match (if exists)
        var pubTT = m.timetoken; // Publish timetoken
        var msg = m.message; // The Payload
        var publisher = m.publisher; //The Publisher
      },
      presence: function (p) {
        console.log("kör presence", p)
        console.log("users: ", p.uuid)
        console.log("action: ", p.action)
        console.log("Channel: ", p.channel)
        // handle presence
        var action = p.action; // Can be join, leave, state-change or timeout
        var channelName = p.channel; // The channel for which the message belongs
        this.setState({
          occupancy: p.occupancy,
          users: p.uuid
        })
        var occupancy = p.occupancy; // No. of users connected with the channel
        var state = p.state; // User State
        var publishTime = p.timestamp; // Publish timetoken
        var timetoken = p.timetoken;  // Current timetoken
        var uuid = p.uuid; // UUIDs of users who are connected with the channel

      }.bind(this)
    })

    this.state.pubnub.hereNow(
      {
        channels: ["Fight"],
        includeUUIDs: true,
        includeState: true
      },
      function (status, response) {
        // handle status, response
        console.log("response: ", response)
        //console.log("users2: ", response.uuid)
        this.setState({
          occupancy: response.totalOccupancy
        })

      }.bind(this)
    );

    this.state.pubnub.subscribe({
      channels: ["Fight"],
      withPresence: true
    });

  }

  LeaveArena(){
    this.state.pubnub.unsubscribe({
      channels: ['Fight']
  })
  this.state.back.goBack()
  }

  render() {

    return (
      <View>
        <Button title="Join battle arena" onPress={() => {
          this.JoinBattleArena()
         }} />
        <Button title="Leave battle arena" onPress={() => {
        this.LeaveArena()
         }} />
        <Text>
          Occupants: {this.state.occupancy}
        </Text>
        <Text>
          Users: {this.state.users}
        </Text>
      </View>

    )

  }

}
