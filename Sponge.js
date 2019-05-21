import React from 'react';
import { PanResponder, View, Animated } from 'react-native';

export default class Sponge extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pan: new Animated.ValueXY(),
            size: new Animated.Value(1)
        };
    }

    componentDidMount() {
        this.state.pan.addListener((value) => {
            if (value.x > -100 && value.x < 100 && value.y < -150 && value.y > -400) {
                this.props.onClean();

            }
        });
    }

    componentWillMount() {
        this.panResponder = PanResponder.create({
            onPanResponderStart: () => {
                Animated.spring(this.state.size, {toValue: 1.2}).start();
            },
            onStartShouldSetPanResponder: () => true,
            onPanResponderMove: Animated.event([null,{ // <--- When moving
                dx : this.state.pan.x,
                dy : this.state.pan.y,
                useNativeDriver: true
            }]),
            onPanResponderRelease: (e, gesture) => {
                Animated.spring(
                    this.state.pan,
                    {toValue: {x: 0, y: 0}},
                  ).start();

                Animated.spring(this.state.size, {toValue: 1.0}).start();
            } // <--- callback when dropped
        });
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
