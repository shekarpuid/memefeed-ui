import React, { useState, useEffect } from 'react'
import { View, FlatList, Dimensions, Platform , NativeModules, TouchableOpacity} from 'react-native'
import { Container, Text, Button, Header, Spinner, Item, Input, Content } from 'native-base'
import styles from '../../styles/common'
import Ionicon from 'react-native-vector-icons/dist/Ionicons'
import UseFetch from '../../hooks/UseFetch'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { httpService } from '../../utils'

const HashTags = () => {
    const StatusBarStyle = Platform.OS === 'ios' ? 'light-content' : 'light-content'
    let isMount = true
    const url = 'hashtag/hashtags'
    
    // const { loading, data, error } = UseFetch(url, method)

    const [loading, setLoading] = useState(false)
    const [hashTags, setHashTags] = useState([])
    const [error, setError] = useState(false)
    const [value, setValue] = useState('')

    useEffect(() => {
        // console.log("Hashtags: use effect")
        // const res = AsyncStorage.getItem('posts')
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
                    if(isMount) setHashTags(json.data)
                    
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

    const Tag = ({ name, index }) => (
        <View style={styles.hashTagItem}>
            <Text style={[styles.hashTagText, styles.hashTagIndex]}>{index + 1}.</Text>
            <View>
                <Text style={[styles.hashTagText, styles.hashTagName]}>#{name}</Text>
                <Text style={[styles.hashTagSub]}>3k memes</Text>
            </View>
        </View>
    )

    const renderItem = ({ item, index }) => (
        <Tag name={item.name} index={index} />
    )

    // Search Hashtags
    const searchHandler = async () => {
        setLoading(true)
        const method = 'POST'
        const formData = new FormData()
        formData.append('search_val', value)

        await httpService(url, method, formData)
            .then(res => res.json())
            .then(json => {
                if (json.status === 0) {
                    alert(json.msg)
                } else {
                    if(isMount) setHashTags(json.data)
                }
                // console.log("Search Hashtags: ", JSON.stringify(json))
                setLoading(false)
                setValue('')
            })
            .catch(error => {
                alert(error)
                console.log(error)
                setError(true)
                setValue('')
                setLoading(false)
            })
    }
    

    return (
        <View>
            <Header searchBar style={{ backgroundColor: '#00639c' }} androidStatusBarColor="#00639c"
                iosBarStyle={StatusBarStyle}>
                <Item style={{paddingHorizontal: Platform.OS === 'ios' ? 10 : 0}}>
                    <Input placeholder="Search with #Hash Tag" 
                        onChangeText={text => setValue(text)}
                        returnKeyType='search'
                        keyboardType='default'
                        // onKeyPress={(e) => searchHandler(e)}
                        // onSubmitEditing={(e) => searchHandler(e)}
                        // multiline={true}
                    />
                    <TouchableOpacity onPress={() => searchHandler()}>
                        <Ionicon name="ios-search" size={Platform.OS === 'ios' ? 18 : 23} style={{top: Platform.OS === 'ios' ? 1 : 0, right: 10}} />
                    </TouchableOpacity>
                </Item>
                <Button transparent>
                    <Text style={{color: '#fff'}}>Search</Text>
                </Button>
            </Header>

            <View>
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
        </View>
    )
}

export default React.memo(HashTags)