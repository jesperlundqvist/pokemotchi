import React from 'react';
import { Text, View, Image } from 'react-native';
import Model from './Model';
import PubNub from 'pubnub';

export default class Fight extends React.Component {
  constructor(props) {
    super(props);
    console.log("fight")
    this.state = {
      data: {},
      hunger: 100,
      cleanliness: 100,
      fun: 100,
      alive: true,
      occupancy: 0
    };

  }

  componentDidMount(){
console.log("component...")
    var pubnub = new PubNub({
      subscribeKey: "sub-c-ff0c5120-7702-11e9-945c-2ea711aa6b65",
      publishKey: "pub-c-ab1f1896-d4ac-4b70-aaf4-ca968c88c2f5",
      secretKey: "sec-c-NjI1MjhlNDEtNmEwYi00NjNmLWJkYTgtNDYwNzFhZDBkNmQz",
      uuid: "machi",
      ssl: true
    })
  
    pubnub.addListener({
      status: function (s) {
        console.log("status")
        if (s.category === "PNConnectedCategory") {
          ready = true;
        }
      
        var affectedChannelGroups = s.affectedChannelGroups;
        var affectedChannels = s.affectedChannels;
        var category = s.category;
        var operation = s.operation;
      },
      message: function(m) {
        // handle message
        //console.log("message")
        //console.log(m)
        var channelName = m.channel; // The channel for which the message belongs
        var channelGroup = m.subscription; // The channel group or wildcard subscription match (if exists)
        var pubTT = m.timetoken; // Publish timetoken
        var msg = m.message; // The Payload
        var publisher = m.publisher; //The Publisher
    },
      presence: function(p) {
        console.log("kör presence")
        // handle presence
        var action = p.action; // Can be join, leave, state-change or timeout
        var channelName = p.channel; // The channel for which the message belongs
        /*this.setState({
          occupancy: p.occupancy
        })*/
        var occupancy = p.occupancy; // No. of users connected with the channel
        var state = p.state; // User State
        var channelGroup = p.subscription; //  The channel group or wildcard subscription match (if exists)
        var publishTime = p.timestamp; // Publish timetoken
        var timetoken = p.timetoken;  // Current timetoken
        //var uuid = p.uuid; // UUIDs of users who are connected with the channel
      }
    })
  
      console.log("subscribing...")
    pubnub.subscribe({
      channels: ["Fight"],
      withPresence: true
    });

    pubnub.publish(
      {
          message: {
              such: 'object'
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

    pubnub.hereNow(
      {
          channels: ["Fight", "west"], 
          includeUUIDs: true,
          includeState: true
      },
      function (status, response) {
          // handle status, response
        console.log("response: ",response)
  
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
