import React from 'react';
import { Text, View, Image } from 'react-native';
import Model from './Model';
import PubNub from 'pubnub';

export default class Fight extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: {},
      hunger: 100,
      cleanliness: 100,
      fun: 100,
      alive: true,
      occupancy: 0
    };

    var pubnub = new PubNub({
      subscribeKey: "sub-c-ff0c5120-7702-11e9-945c-2ea711aa6b65",
      publishKey: "pub-c-ab1f1896-d4ac-4b70-aaf4-ca968c88c2f5",
      secretKey: "sec-c-NjI1MjhlNDEtNmEwYi00NjNmLWJkYTgtNDYwNzFhZDBkNmQz",
      ssl: true
    })

    pubnub.addListener({
      status: function (s) {
        if (s.category === "PNConnectedCategory") {
          ready = true;
        }
        var affectedChannelGroups = s.affectedChannelGroups;
        var affectedChannels = s.affectedChannels;
        var category = s.category;
        var operation = s.operation;
      },
      message: function (msg) {
      },
      presence: function(p) {
        // handle presence
        var action = p.action; // Can be join, leave, state-change or timeout
        var channelName = p.channel; // The channel for which the message belongs
        this.setState({
          occupancy: p.occupancy
        })
        var occupancy = p.occupancy; // No. of users connected with the channel
        var state = p.state; // User State
        var channelGroup = p.subscription; //  The channel group or wildcard subscription match (if exists)
        var publishTime = p.timestamp; // Publish timetoken
        var timetoken = p.timetoken;  // Current timetoken
        var uuid = p.uuid; // UUIDs of users who are connected with the channel
      }
    })
    pubnub.subscribe({
      channels: ["Fight"],
      withPresence: true
    });

    pubnub.hereNow(
      {
          channels: ["Fight"], 
          channelGroups : ["cg1"],
          includeUUIDs: true,
          includeState: true
      },
      function (status, response) {
          // handle status, response

      }
  );
  }



  render() {

    return (
      <View>
        <Text>Users: {this.state.occupancy}</Text>
      <Text>FIGHT
      </Text>
      </View>
    
    )

  }

}
