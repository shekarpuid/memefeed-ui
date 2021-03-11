import React, { useEffect } from 'react'
import { ScrollView, View, Text, Modal, TouchableOpacity } from 'react-native'
import { Header, Right, Left, Body, Button, Title } from 'native-base'
import Ionicon from 'react-native-vector-icons/dist/Ionicons'
import { httpService } from '../../../utils'
import styles from '../../../styles/common'

const Hashtag = (props) => {
    const StatusBarStyle = Platform.OS === 'ios' ? 'light-content' : 'light-content'
    const { isVisible, setIsVisible, hashTag, setHashTag, user } = props
    let isMount = true

    useEffect(() => {
        // console.log(JSON.stringify(hashTag))
        return () => {
            isMount = false
        }
    }, [])

    const followHandler = async () => {
        const url = 'followers/following'
        const formData = new FormData()
        formData.append('user_id', user.data.session_id)
        formData.append('type', 'hash')
        formData.append('to_id', hashTag.id)
        // console.log("Hashtag follow: ", JSON.stringify(formData))

        await httpService(url, 'POST', formData)
            .then(res => res.json())
            .then(json => {
                if (json.status === 0) {
                    alert(json.msg)
                } else {
                    if(isMount) alert(json.msg)
                }
                // console.log("Hashtag follow: ", JSON.stringify(json))
            })
            .catch(error => {alert(error);console.log(error)})
    }

    return (
        <>
            <Modal animationType="slide" visible={isVisible}
                onRequestClose={() => {
                    setIsVisible(false)
                    setHashTag({})
                }}
            >
                <Header style={{ backgroundColor: '#fff' }} androidStatusBarColor="#00639c" iosBarStyle={StatusBarStyle}>
                    <Left style={{ flex: 0.45 }}>
                        <Button
                            transparent
                            onPress={() => setIsVisible(false)}>
                            <Ionicon name="arrow-back-outline" color="#00639c" style={styles.fs25} />
                        </Button>
                    </Left>
                    <Body>
                        <Title style={{ fontWeight: 'bold', alignSelf: 'flex-start', marginLeft: -40, color: '#00639c' }}>#{hashTag.name}</Title>
                        <Text style={{ alignSelf: 'flex-start', marginLeft: -40, color: '#333', fontSize: 12 }}>{hashTag.followers_count}</Text>
                    </Body>
                    <Right style={{ flex: 0.3 }}>
                        <TouchableOpacity 
                            onPress={() => followHandler()}
                            style={[styles.vhCenter, {
                                borderWidth: 1, borderColor: '#00639c', borderRadius: 8, width: 90, height: 35,
                            }]}
                        >
                            <Text style={{color: '#00639c', fontWeight: 'bold'}}>FOLLOW</Text>
                        </TouchableOpacity>
                    </Right>
                </Header>

                <ScrollView>
                    <Text>Content</Text>
                </ScrollView>
            </Modal>
        </>
    )
}

export default Hashtag