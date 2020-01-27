import React from 'react';
import { View } from 'react-native';
import api from '../../services/api';

export default class User extends React.Component {


    static navigationOptions = ({navigation}) => ({
        title: navigation.getParam('user').name
    });

    state = {
        stars: []
    };

    async componentDidMount(): void {
        const {navigation} = this.props;
        const user = navigation.getParam('user');
        const response = await api.get(`/users/${user.login}/starred`);

        this.setState({stars: response.data});
    }

    render() {
        return (
            <View/>
        )
    }
}
