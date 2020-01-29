import React from 'react';
import api from '../../services/api';
import PropTypes from 'prop-types';
import {
    Avatar,
    Name,
    Bio,
    Header,
    Container,
    Stars,
    Starred,
    OwnerAvatar,
    Info,
    Title,
    Author
} from "./styles";

import { ActivityIndicator } from 'react-native';

export default class User extends React.Component {


    static navigationOptions = ({navigation}) => ({
        title: navigation.getParam('user').name
    });

    static propTypes = {
        navigation: PropTypes.shape({
            getParam: PropTypes.func
        }).isRequired
    };

    state = {
        stars: [],
        loading: false,
        page: 1
    };

    async componentDidMount() {
        const {navigation} = this.props;
        const user = navigation.getParam('user');
        this.setState({loading: true});
        const response = await api.get(`/users/${user.login}/starred`);

        this.setState({
            stars: response.data,
            loading: false
        });
    }

    loadMore = async (user) => {
        let {page} = this.state;
        page++;
        this.setState({page: page});
        const response = await api.get(`/users/${user.login}/starred?page=${page}`);
        this.setState({
            stars: response.data
        })
    };

    render() {
        const {navigation} = this.props;
        const {stars, loading} = this.state;
        const user = navigation.getParam('user');
        return (
            <Container>
                <Header>
                    <Avatar source={{uri: user.avatar}}/>
                    <Name>{user.name}</Name>
                    <Bio>{user.bio}</Bio>
                </Header>
                {loading ?
                    (<ActivityIndicator size={60} color="#7159C1"/>)
                    :
                    (<Stars data={stars}
                            keyExtractor={star => String(star.id)}
                            onEndReachedThreshold={0.2}
                            onEndReached={() => this.loadMore(user)}
                            renderItem={({item}) => (
                                <Starred>
                                    <OwnerAvatar source={{uri: item.owner.avatar_url}}/>
                                    <Info>
                                        <Title>{item.name}</Title>
                                        <Author>{item.owner.login}</Author>
                                    </Info>
                                </Starred>
                            )}/>)
                }
            </Container>
        )
    }
}
