import React from 'react';
import { PanResponder, View, Animated, Platform, Vibration, Image } from 'react-native';
import { Haptic } from 'expo';
import { MaterialCommunityIcons, Entypo, FontAwesome } from '@expo/vector-icons';

export default class Food extends React.Component {
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
        if (Platform.OS === 'ios') {
          Haptic.selection();
        }
        this.props.onFood();
      }
    });
  }

  componentWillMount() {
    this.panResponder = PanResponder.create({
      onPanResponderStart: () => {
        Animated.spring(this.state.size, { toValue: 1.2 }).start();
      },
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event([null, { // <--- When moving
        dx: this.state.pan.x,
        dy: this.state.pan.y,
        useNativeDriver: true
      }]),
      onPanResponderRelease: (e, gesture) => {
        Animated.spring(
          this.state.pan,
          { toValue: { x: 0, y: 0 } },
        ).start();

        Animated.spring(this.state.size, { toValue: 1.0 }).start();
      } // <--- callback when dropped
    });
  }

  render() {
    return <Animated.View
      {...this.panResponder.panHandlers}
      style={[this.state.pan.getLayout()]}>
      <Image style={{ width: 80, height: 80, resizeMode: "contain", alignSelf: "center" }} source={{ uri: "https://gifimage.net/wp-content/uploads/2017/07/apple-gif-21.gif" }} />
    </Animated.View>;
  }
}
