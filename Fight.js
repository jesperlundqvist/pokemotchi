import React from 'react';
import { Text, View, Image } from 'react-native';
import Model from './Model';
import PubNub from 'pubnub';

export default class Fight extends React.Component {
  constructor(props) {
    super(props);
    var pubnub = new PubNub({
      subscribeKey: "sub-c-ff0c5120-7702-11e9-945c-2ea711aa6b65",
      publishKey: "pub-c-ab1f1896-d4ac-4b70-aaf4-ca968c88c2f5",
      secretKey: "sec-c-NjI1MjhlNDEtNmEwYi00NjNmLWJkYTgtNDYwNzFhZDBkNmQz",
      ssl: true
    })

    pubnub.addListener({
      status: function (statusEvent) {
        if (statusEvent.category === "PNConnectedCategory") {
          ready = true;
        }
      },
      message: function (msg) {
      },
      presence: function (presenceEvent) {
        // handle presence
      }
    })

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

    pubnub.subscribe({
      channels: ["Fight"],
      withPresence: true
    });

    this.state = {
      data: {},
      hunger: 100,
      cleanliness: 100,
      fun: 100,
      alive: true
    };
  }



  render() {

    return (
      <View>
        <Text></Text>
      <Text>FIGHT
      </Text>
      </View>
    
    )

  }

}
