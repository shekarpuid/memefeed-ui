import React, { useEffect } from 'react'
import { Text, Button, Header, Left, Body, Right, Title } from 'native-base'
import { connect } from 'react-redux'
import { Image, Platform, View } from 'react-native'
import styles from '../../styles/common'
// import Logo from '../../../assets/home-logo.png'
import Logo from '../../../assets/logo.png'
import Ionicon from 'react-native-vector-icons/dist/Ionicons'

const Headers = (props) => {
    const { selectedTabIndex, setShowPosts, showPosts, user, navigation } = props
    // useEffect(() => {
    // alert(JSON.stringify(user))
    // }, [showPosts])

    function renderHeader() {
        const StatusBarStyle = Platform.OS === 'ios' ? 'light-content' : 'light-content'

        // Create Post Header
        if (showPosts) {
            return (
                <Header style={{ backgroundColor: '#00639c' }} androidStatusBarColor="#00639c" iosBarStyle={StatusBarStyle}>
                    <Left style={{ flex: 0.5 }}>
                        <Button
                            transparent
                            onPress={() => setShowPosts(false)}>
                            <Ionicon name="arrow-back-outline" color="#fff" style={styles.fs25} />
                        </Button>
                    </Left>
                    <Body>
                        <Title style={{ fontWeight: 'bold', alignSelf: 'center', marginLeft: -40, color: '#fff' }}>
                            Create Post
                </Title>
                    </Body>
                    <Right style={{ flex: 0.3 }}>
                        <Button
                            transparent
                            onPress={() => setShowPosts(false)}>
                            <Ionicon name="close" color="#fff" style={styles.fs25} />
                        </Button>
                    </Right>
                </Header>
            )
        }

        // Search Header
        // if (selectedTabIndex === 2) {
        //     return (
        //         <Header searchBar style={{ backgroundColor: '#00639c' }} androidStatusBarColor="#00639c" iosBarStyle={Platform.OS === 'ios' ? 'dark-content' : 'light-content'}>
        //             <Item>
        //                 <Ionicon name="ios-search" size={23} />
        //                 <Input placeholder="Search with #Hash Tag" />
        //             </Item>
        //             <Button transparent>
        //                 <Text>Search</Text>
        //             </Button>
        //         </Header>
        //     )
        // }

        if (selectedTabIndex === 2 || selectedTabIndex === 3 || selectedTabIndex === 4) {
            return (
                <Header searchBar style={{ backgroundColor: '#00639c', height: 0 }} androidStatusBarColor="#00639c" iosBarStyle='light-content' />
            )
        }

        // Dashboard Header
        return (
            <Header style={{ backgroundColor: '#00639c' }} androidStatusBarColor="#00639c" iosBarStyle={StatusBarStyle}>
                {selectedTabIndex !== 3 ?
                    <View style={{ flex: 0.6, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        {/* <Button transparent onPress={() => navigation.openDrawer()}
                            style={{ flex: 0.4, width: 50 }}
                        >
                            <Ionicon name="ios-menu-outline" color="#fff" style={[styles.fs25, { alignSelf: 'flex-start' }]} />
                        </Button> */}
                        <Left style={{ flex: 0.6, flexDirection: 'row', justifyContent: 'space-between' }}>

                            <Image source={Logo} style={[styles.logo, { alignSelf: 'flex-end' }]} />
                        </Left>
                    </View> : null}
                <Body>
                    {/* <Title
                style={{fontStyle: 'italic', fontWeight: 'bold', marginLeft: 5}}>
                {displayContent.value}
              </Title> */}
                </Body>
                <Right style={{ flex: 0.4 }}>
                    {user.data !== null && user.data !== undefined &&
                        user.data.user_type !== 'User' ? (
                        <Button transparent onPress={() => setShowPosts(true)}>
                            <Ionicon name="add-circle-outline" color="#fff" style={styles.fs25} />
                        </Button>
                    ) : null}
                </Right>
            </Header>
        )
    }
    return (
        <>
            {renderHeader()}
        </>
    )
}

const mapStateToProps = (state) => ({
    user: state.user,
    posts: state.posts.posts,
    createPost: state.createPost,
    postTypes: state.postTypes,
})
export default connect(mapStateToProps)(Headers)