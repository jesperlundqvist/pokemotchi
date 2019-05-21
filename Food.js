import React from 'react';
import { Gyroscope } from 'expo';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';



export default class Food extends React.Component {
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

      this._toggle();

    }

    componentWillMount() {
      this._unsubscribe();

    }

    _toggle = () => {
        if (this._subscription) {
        this._unsubscribe();
        } else {
        this._subscribe();
        }
    }

      _slow = () => {
        Gyroscope.setUpdateInterval(1000);

      };

      _fast = () => {
        Gyroscope.setUpdateInterval(16);
      };

      _subscribe = () => {
        this._subscription = Gyroscope.addListener(result => {
          this.setState({ gyroscopeData: result });
        //  this.onLevel();
        let { x, y, z } = result;
        //console.log(result)
        if (x > 0.8 || x < -0.8)
          this.props.onFood(

          );

      });
      };

      _unsubscribe = () => {
        this._subscription && this._subscription.remove();
        this._subscription = null;
      };


    render() {
      let { x, y, z } = this.state.gyroscopeData;
        return   (
              <View style={styles.sensor}>
              <Text>Gyroscope:</Text>
              <Text>
                x: {round(x)} y: {round(y)} z: {round(z)}
              </Text>

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
