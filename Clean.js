import React from 'react';
import { Gyroscope, Haptic } from 'expo';
import { StyleSheet, Text, TouchableOpacity, View, Platform } from 'react-native';



export default class Clean extends React.Component {
    constructor(props) {
        super(props);
        this.state = { gyroscopeData: {},

        };
    }

    componentDidMount() {
    /*  this.state.pan.addListener((value) => {
          if (value.x > -100 && value.x < 100 && value.y < -150 && value.y > -400) {
              this.props.onFood();

          }
      });*/

      Gyroscope.setUpdateInterval(16);

      Gyroscope.addListener(result => {
        this.setState({ gyroscopeData: result });
      //  this.onLevel();
      let { x, y, z } = result;
      //console.log(result)
      if (x > 0.8 || x < -0.8)
          if (Platform.OS === 'ios') {
            Haptic.selection();
          }
          this.props.onClean(

        );

    });

    }

    componentWillUnmount() {
        Gyroscope.removeAllListeners();
    }
    render() {
        return   (
              <View>
      </View>);
    }
}

function round(n) {
  if (!n) {
    return 0;
  }

  return Math.floor(n * 100) / 100;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'stretch',
    marginTop: 15,
  },
  button: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#eee',
    padding: 10,
  },
  middleButton: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#ccc',
  },
  sensor: {
    marginTop: 15,
    paddingHorizontal: 10,
  },
});
