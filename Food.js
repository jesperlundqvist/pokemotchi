import React from 'react';
import { Gyroscope } from 'expo';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';


export default class Food extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }

    componentDidMount() {

    }

    componentWillMount() {

    }

    render() {
        return <Animated.View
        {...this.panResponder.panHandlers}
         style={[this.state.pan.getLayout()]}>
            <Animated.View
            style={{
                backgroundColor: "skyblue",
                width: 50 * 2,
                height: 50 * 2,
                borderRadius: 50,
                transform: [{scaleX: this.state.size}, {scaleY: this.state.size}]
            }}
            />
        </Animated.View>;
    }
}
