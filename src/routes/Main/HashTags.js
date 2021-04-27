import React, { useState, useEffect } from 'react'
import { View, FlatList, Dimensions, Platform, NativeModules, TouchableOpacity } from 'react-native'
import { Container, Text, Button, Header, Spinner, Item, Input, Modal, H3 } from 'native-base'
import styles from '../../styles/common'
import Ionicon from 'react-native-vector-icons/dist/Ionicons'
import { httpService } from '../../utils'
import Hashtag from './Hashtag/Hashtag'

const HashTags = (props) => {
    const { user } = props
    const StatusBarStyle = Platform.OS === 'ios' ? 'light-content' : 'light-content'
    let isMount = true
    const url = 'hashtag/hashtags'
    const [loading, setLoading] = useState(false)
    const [hashTags, setHashTags] = useState([])
    const [hashTag, setHashTag] = useState({})
    const [error, setError] = useState(false)
    const [value, setValue] = useState('')
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        getHashTags()

        return () => {
            isMount = false
        }
    }, [])

    // Get Hashtags
    const getHashTags = async () => {
        setLoading(true)
        const method = 'GET'
        await httpService(url, method, null)
            .then(res => res.json())
            .then(json => {
                if (json.status === 0) {
                    alert(json.msg)
                } else {
                    if (isMount) setHashTags(json.data)
                }
                // console.log("Hashtags: ", JSON.stringify(json))
                setLoading(false)
            })
            .catch(error => {
                alert(error)
                console.log(error)
                setError(true)
                setLoading(false)
            })
    }

    const Tag = ({ item, name, index }) => (
        <View style={styles.hashTagItem}>
            {/* <Text style={[styles.hashTagText, styles.hashTagIndex]}>{index + 1}.</Text> */}
            <View>
                <TouchableOpacity onPress={() => {
                    setIsVisible(true)
                    setHashTag(item)
                }}>
                    <Text style={[styles.hashTagText, styles.hashTagName]}>#{name}</Text>
                </TouchableOpacity>
                <Text style={[styles.hashTagSub]}>{item.followers_count}</Text>
            </View>
        </View>
    )

    const renderItem = ({ item, index }) => (
        <Tag item={item} name={item.name} index={index} />
    )

    // Search Hashtags
    const searchHandler = async () => {
        setLoading(true)
        setValue('')
        const method = 'POST'
        const formData = new FormData()
        formData.append('search_val', value)
        formData.append('user_id', user.data.session_id)

        await httpService(url, method, formData)
            .then(res => res.json())
            .then(json => {
                if (json.status === 0) {
                    alert(json.msg)
                } else {
                    if (isMount) setHashTags(json.data)
                }
                // console.log("Search Hashtags: ", JSON.stringify(json))
                setLoading(false)
				setValue('')
            })
            .catch(error => {
                alert(error)
                console.log(error)
                setError(true)
                setLoading(false)
				setValue('')
            })
    }

    return (
        <View>
            <Header searchBar style={{ backgroundColor: '#00639c' }} androidStatusBarColor="#00639c"
                iosBarStyle={StatusBarStyle}>
                <Item style={{ paddingHorizontal: Platform.OS === 'ios' ? 10 : 0 }}>
                    <Input placeholder="Search with #Hash Tag"
                        onChangeText={text => setValue(text)}
                        returnKeyType='search'
                        keyboardType='default'
						value={value}
                    />
                    <TouchableOpacity onPress={() => searchHandler()}>
                        <Ionicon name="ios-search" size={Platform.OS === 'ios' ? 18 : 23} style={{ top: Platform.OS === 'ios' ? 1 : 0, right: 10 }} />
                    </TouchableOpacity>
                </Item>
                {/* <Button transparent>
                    <Text style={{ color: '#fff' }}>Search</Text>
                </Button> */}
            </Header>

            <View>
                <H3 style={{fontSize: 25, fontWeight: 'bold', marginTop: 10, marginLeft: 15, color: '#00639c', fontStyle: 'italic'}}>Trending</H3>

                {loading ? <Spinner color="#00639c" style={{ marginTop: 10, alignSelf: 'center' }} /> : null}
                {hashTags !== null && hashTags.status === 0 ? <Text style={{ marginTop: 20, alignSelf: 'center' }}>{hashTags.msg}.</Text> :
                    hashTags !== null ?
                        <FlatList style={{ marginBottom: Platform.OS === 'ios' ? 165 : 112, marginTop: 15 }}
                            data={hashTags}
                            renderItem={renderItem}
                            keyExtractor={item => item.id}
                        />
                        : null}
            </View>

            {/* Hashtag Modal */}
            {isVisible ?
                <Hashtag 
                    isVisible={isVisible} setIsVisible={setIsVisible} 
                    hashTag={hashTag} setHashTag={setHashTag} user={user} 
                />
                : null}
        </View>
    )
}

export default React.memo(HashTags)