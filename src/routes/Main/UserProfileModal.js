import React, { useEffect, useState } from 'react'
import { Container, Text, Thumbnail, Icon, Header, Right, Left, Body, Button, Title } from 'native-base'
import { Dimensions, TouchableOpacity, View, Modal, ActivityIndicator, FlatList } from 'react-native'
import defaultAvatar from '../../../assets/grayman.png'
import Ionicon from 'react-native-vector-icons/dist/Ionicons'
import styles from '../../styles/common'
import { env } from '../../env'
import UserReportModal from './UserReportModal'
import { httpService } from '../../utils'
import HashtagPost from '../../components/HashtagPost'
import Hashtag from './Hashtag/Hashtag'

const UserProfileModal = (props) => {
    const { viewUser, loggedInUser, postTypes, onHomePostSend, showPosts, setShowPosts, isVisible, setIsVisible } = props
    const StatusBarStyle = Platform.OS === 'ios' ? 'light-content' : 'light-content'
    const imageUrl = `${env.baseUrl}${viewUser.profile_image}`
    const [posts, setPosts] = useState([])
    const [noData, setNoData] = useState('')
    const [popup, setPopup] = useState(false)
    let isMount = true
    const [showReport, setShowReport] = useState(false)
    const [items, setItems] = useState(10)
    const [loadmore, setLoadmore] = useState(false)
    const [loading, setLoading] = useState(false)
    const [hashTag, setHashTag] = useState({})
    const [hashtagModal, setHashtagModal] = useState(false)

    useEffect(() => {
        // console.log(JSON.stringify(viewUser))
        // console.log(JSON.stringify(loggedInUser))
        fetchUserPosts()

        return () => {
            isMount = false
        }
    }, [])

    // ======================================================== Fetch hashtag data fn
    const getHashData = async (value) => {
        let key = value.substring(1)
        const url = 'hashtag/hashtags'
        const formData = new FormData()
        formData.append('user_id', loggedInUser.data.session_id)
        formData.append('search_val', key)
        // console.log("Hashtag follow: ", JSON.stringify(formData))

        await httpService(url, 'POST', formData)
            .then(res => res.json())
            .then(json => {
                if (json.status === 0) {
                    alert(json.msg)
                } else {
                    if (isMount) setHashTag(json.data[0])
                    setHashtagModal(true)
                }
                // console.log("Hashtag data: ", JSON.stringify(json))
            })
            .catch(error => { alert(error); console.log(error) })
    }

    const fetchUserPosts = async () => {
        setLoading(true)
        const formData = new FormData()
        formData.append('creator_user_id', viewUser.id)

        await httpService('posts/postlist', 'POST', formData)
            .then(res => res.json())
            .then(json => {
                if (json.status === 0) {
                    setNoData('No data found')
                    setPosts([])
                } else {
                    setPosts(json)
                }
                setLoading(false)
                // console.log("Creator Posts: ", JSON.stringify(json))
            })
            .catch(error => { alert(error); console.log(error); setLoading(false) })
    }

    const footerComp = () => {
        if (loadmore) {
            return <ActivityIndicator color="#00639c" size='large' style={{ height: 50, backgroundColor: '#fff' }} />
        } else {
            return <View></View>
        }
    }

    const loadMore = () => {
        if (items <= posts.length) {
            setLoadmore(true)
            setTimeout(() => {
                setLoadmore(false)

                setItems(items + 1)
            }, 100)
        }
    }

    const renderHeader = () => {
        return (
            <View style={{ height: 140, width: "100%", flexDirection: 'row', borderBottomColor: '#808080', borderBottomWidth: 2 }}>
                <View style={{ justifyContent: 'center', alignItems: 'center', flex: 0.3 }}>
                    <Thumbnail
                        style={{ borderWidth: 5, borderColor: '#00639c' }}
                        large
                        // source={{uri: 'https://cdn.fastly.picmonkey.com/contentful/h6goo9gw1hh6/2sNZtFAWOdP1lmQ33VwRN3/24e953b920a9cd0ff2e1d587742a2472/1-intro-photo-final.jpg?w=800&q=70'}}
                        source={
                            viewUser.profile_image.length > 0 ? { uri: imageUrl } :
                                defaultAvatar}
                    />
                </View>
                <View style={{ flex: 1 }}>
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ flex: 0.7 }}>
                            <Text style={{ fontWeight: 'bold' }}>{viewUser.name}</Text>
                            <Text style={{ fontWeight: 'bold', color: '#808080', fontSize: 15 }}>{viewUser.handle_name}</Text>
                        </View>

                        {/* Icons */}
                        <View style={{ flex: 0.3, flexDirection: 'row', justifyContent: 'space-between', paddingRight: 10 }}>
                            <TouchableOpacity>
                                <Icon name='thumbs-up-sharp' />
                            </TouchableOpacity>
                            <View>
                                <TouchableOpacity onPress={() => setPopup(true)}>
                                    <Ionicon name='ios-ellipsis-horizontal-circle' style={{ fontSize: 30 }} />
                                </TouchableOpacity>
                                {popup &&
                                    <View style={styles.profileReportPopup}>
                                        <TouchableOpacity style={styles.profileReportPopupLink}
                                            onPress={() => {
                                                setPopup(false)
                                                setShowReport(true)
                                            }}
                                        >
                                            <Text>Report</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={styles.profileReportPopupLink}
                                            onPress={() => {
                                                setPopup(false)
                                            }}
                                        >
                                            <Text>Block</Text>
                                        </TouchableOpacity>
                                    </View>
                                }
                            </View>
                        </View>
                    </View>

                    {/* Header Bottom */}
                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>
                        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                            <View style={styles.profileIconBtn}>
                                <Text style={{ fontWeight: 'bold' }}>Upvotes</Text>
                            </View>
                            <Text style={{ fontWeight: 'bold' }}>180</Text>
                        </View>
                        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                            <View style={styles.profileIconBtn}>
                                <Text style={{ fontWeight: 'bold' }}>Following</Text>
                            </View>
                            <Text style={{ fontWeight: 'bold' }}>108</Text>
                        </View>
                        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                            <View style={styles.profileIconBtn}>
                                <Text style={{ fontWeight: 'bold' }}>Followers</Text>
                            </View>
                            <Text style={{ fontWeight: 'bold' }}>450</Text>
                        </View>
                    </View>
                </View>
            </View>
        )
    }

    return (
        <>
            <Modal animationType="slide" visible={isVisible}
                onRequestClose={() => {
                    setIsVisible(false)
                }}
            >
                <Container>
                    <Header style={{ backgroundColor: '#00639c' }} androidStatusBarColor="#00639c" iosBarStyle={StatusBarStyle}>
                        <Left style={{ flex: 0.5 }}>
                            <Button
                                transparent
                                onPress={() => setIsVisible(false)}>
                                <Ionicon name="arrow-back-outline" color="#fff" style={styles.fs25} />
                            </Button>
                        </Left>
                        <Body>
                            <Title style={{ fontWeight: 'bold', alignSelf: 'center', marginLeft: -40, color: '#fff', textTransform: 'capitalize' }}>{viewUser.user_type} Profile</Title>
                        </Body>
                        <Right style={{ flex: 0.3 }}>
                            <Button
                                transparent
                                onPress={() => setIsVisible(false)}>
                                <Ionicon name="close" color="#fff" style={styles.fs25} />
                            </Button>
                        </Right>
                    </Header>
                    <View style={{ flex: 1 }}
                        onStartShouldSetResponder={() => setPopup(false)}
                    >
                        {renderHeader()}
                        <View style={{ paddingVertical: 0, marginBottom: 180 }}>
                            {loading ? <ActivityIndicator size='large' color='#00639c' style={{ marginTop: 20 }} /> : null}
                            {posts.length === 0 && <Text style={styles.noData}>{noData}</Text>}
                            <FlatList
                                data={posts}
                                keyExtractor={item => item.id.toString()}
                                renderItem={({ item, index }) => {
                                    if (index + 1 <= items) {
                                        return <HashtagPost
                                            post={item} user={loggedInUser}
                                            start={0} end={9} getHashData={getHashData}
                                        />
                                    }
                                }}
                                bounces={false} onEndReached={() => loadMore()}
                                onEndReachedThreshold={0.2}
                                ListFooterComponent={footerComp}
                            // style={{ height: Platform.OS === 'ios' ? height - 257 : height - 235 }}
                            />
                        </View>
                    </View>
                </Container>
            </Modal>


            {showReport &&
                <UserReportModal
                    viewUser={viewUser} loggedInUser={loggedInUser} showReport={showReport} setShowReport={setShowReport}
                />
            }


            {hashtagModal &&
                <Hashtag user={loggedInUser}
                    isVisible={hashtagModal} setIsVisible={setHashtagModal}
                    hashTag={hashTag} setHashTag={setHashTag}
                />
            }

        </>
    )
}

export default UserProfileModal