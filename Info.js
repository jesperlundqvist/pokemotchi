import React from 'react';
import { View, SafeAreaView, Text, StatusBar } from 'react-native';

export default class Info extends React.Component {
    static navigationOptions = {
    };

    constructor(props) {
        super(props);

        this.state = {
        };
    }

    componentDidMount() {
    }

    componentWillUnmount() {
    }

    render() {
        return(<SafeAreaView>
            <StatusBar backgroundColor="white" barStyle="dark-content" />
            <Text>Info</Text>
        </SafeAreaView>);
    }
}
