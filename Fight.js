import React from 'react';
import { Text, View, Image } from 'react-native';
import Model from './Model';

export default class Fight extends React.Component {
  constructor(props) {
      super(props);
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
      <Text>FIGHT</Text>
    )

  }

}