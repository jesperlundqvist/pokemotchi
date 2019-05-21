import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Accelerometer } from 'expo';

const THRESHOLD = 100;

export default class Toy extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
        };
    }

    componentDidMount() {
        Accelerometer.setUpdateInterval(
          16
        );

        let last_x, last_y, last_z;
        let lastUpdate = 0;
        Accelerometer.addListener(accelerometerData => {
            let {x, y, z} = accelerometerData;
            let currTime = Date.now();
            if ((currTime - lastUpdate) > 100) {
                let diffTime = (currTime - lastUpdate);
                lastUpdate = currTime;

                let speed = Math.abs(x + y + z - last_x - last_y - last_z) / diffTime * 10000;

                if ( speed > THRESHOLD ) {
                    this.props.onFun(speed);
                }

                last_x = x;
                last_y = y;
                last_z = z;
            }
        });

        Accelerometer.addListener(
          accelerometerData => {
            this.setState({ accelerometerData });
          }
        );
    }

    componentWillUnmount() {
        Accelerometer.removeAllListeners();
    }

    render() {
        return (<View></View>);
    }
}
