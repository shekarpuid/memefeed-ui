import React, { useEffect, useState } from 'react'
import { ScrollView, View, Text, Modal, TouchableOpacity, FlatList } from 'react-native'
import { Header, Right, Left, Body, Button, Title, Item, Picker, Spinner } from 'native-base'
import Ionicon from 'react-native-vector-icons/dist/Ionicons'
import { httpService } from '../../../utils'
import styles from '../../../styles/common'
import HashtagPost from '../../../components/HashtagPost'

const Hashtag = (props) => {
    const StatusBarStyle = Platform.OS === 'ios' ? 'light-content' : 'light-content'
    const { isVisible, setIsVisible, hashTag, setHashTag, user } = props
    let isMount = true

    // States    
    const [filters, setFilters] = useState(0)
    const [sortBy, setSortBy] = useState(0)
    const [datePosted, setDatePosted] = useState('select')
    const [start, setStart] = useState(0)
    const [end, setEnd] = useState(9)
    const [data, setData] = useState([])
    const [showPosts, setShowPosts] = useState(true)
    const [editing, setEditing] = useState(false)
    const [menuId, setMenuId] = useState(0)
    const [ptypeList, setPtypeList] = useState([])
    const [sortByList, setSortByList] = useState([])
    const [filterLoading, setFilterLoading] = useState(false)

    useEffect(() => {
        getFilters()
        getSortBy()
        getHashtagPosts()
        // console.log("hashTag: " + JSON.stringify(hashTag))

        return () => {
            isMount = false
            setHashTag({})
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
                    if (isMount) alert(json.msg)
                }
                // console.log("Hashtag follow: ", JSON.stringify(json))
            })
            .catch(error => { alert(error); console.log(error) })
    }

    // get Hashtag Posts
    const getHashtagPosts = async () => {
        setFilterLoading(true)
        const url = 'posts/postlist'
        const formData = new FormData()
        formData.append('user_id', user.data.session_id)
        formData.append('hash_tag_id', hashTag.id)
        // console.log("Hashtag posts formdata: ", JSON.stringify(formData))

        await httpService(url, 'POST', formData)
            .then(res => res.json())
            .then(json => {
                if (isMount) setData(json)
                // console.log("Hashtag Posts: ", JSON.stringify(json))
                setFilterLoading(false)
            })
            .catch(error => { 
                alert(error)
                console.log(error) 
                setFilterLoading(false)
            })
    }

    // getFilters
    const getFilters = async () => {
        const url = 'post_type/ptypelist'
        const formData = new FormData()
        formData.append('user_id', user.data.session_id)
        // console.log("Hashtag follow: ", JSON.stringify(formData))

        await httpService(url, 'POST', formData)
            .then(res => res.json())
            .then(json => {
                if (isMount) setPtypeList(json)
                // console.log("Hashtag follow: ", JSON.stringify(json))
            })
            .catch(error => { alert(error); console.log(error) })
    }

    // getSortBy
    const getSortBy = async () => {
        const url = 'post/sort_filter_types'
        const formData = new FormData()
        formData.append('user_id', user.data.session_id)
        // console.log("Hashtag follow: ", JSON.stringify(formData))

        await httpService(url, 'POST', formData)
            .then(res => res.json())
            .then(json => {
                if (isMount) setSortByList(json.data)
                // console.log("Hashtag follow: ", JSON.stringify(json))
            })
            .catch(error => { alert(error); console.log(error) })
    }

    // Filters onchange fn
    const filtersOnchange = async (value) => {
        if (value !== 0) {
            setFilterLoading(true)
            setFilters(value)
            // console.log(value)

            const url = 'posts/postlist'
            const formData = new FormData()
            formData.append('user_id', user.data.session_id)
            formData.append('post_type_filter_id', value)
            // console.log("Hashtag follow: ", JSON.stringify(formData))

            await httpService(url, 'POST', formData)
                .then(res => res.json())
                .then(json => {
                    if (isMount) setData(json)
                    // console.log("Hashtag Filters Posts: ", JSON.stringify(json))
                    setFilterLoading(false)
                })
                .catch(error => { 
                    alert(error)
                    console.log(error)
                    setFilterLoading(false) 
                })
        }
    }
    const sortByOnchange = async (value) => {
        if (value !== 0) {
            setFilterLoading(true)
            setSortBy(value)
            // console.log(value)

            const url = 'posts/postlist'
            const formData = new FormData()
            formData.append('user_id', user.data.session_id)
            formData.append('sort_filter_id', value)
            // console.log("Hashtag follow: ", JSON.stringify(formData))

            await httpService(url, 'POST', formData)
                .then(res => res.json())
                .then(json => {
                    if (isMount) setData(json)
                    // console.log("Hashtag Sort by Posts: ", JSON.stringify(json))
                    setFilterLoading(false)
                })
                .catch(error => { 
                    alert(error)
                    console.log(error) 
                    setFilterLoading(false)
                })
        }
    }

    const datePostedOnchange = value => {
        setDatePosted(value)
    }

    return (
        <>
            {/* {console.log(hashTag.name)} */}
            <Modal animationType="slide" visible={isVisible}
                onRequestClose={() => {
                    setIsVisible(false)
                    setHashTag({})
                }}
            >
                {/* Header */}
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
                            <Text style={{ color: '#00639c', fontWeight: 'bold' }}>FOLLOW</Text>
                        </TouchableOpacity>
                    </Right>
                </Header>

                {/* Filters */}
                {data.length > 0 ?
                <View style={[styles.row, { marginTop: 10, marginBottom: 10 }]}>
                    <Item picker style={styles.filterSelect}>
                        <Picker
                            mode="dropdown"
                            style={styles.filterPicker}
                            selectedValue={filters}
                            onValueChange={value => filtersOnchange(value)}
                        >
                            <Picker.Item label="Filters" value={0} />
                            {ptypeList.length > 0 ? ptypeList.map(item => {
                                return <Picker.Item key={item.id} label={item.name} value={item.id} />
                            }) : null}
                        </Picker>
                    </Item>
                    <Item picker style={styles.filterSelect}>
                        <Picker
                            mode="dropdown"
                            style={styles.filterPicker}
                            selectedValue={sortBy}
                            onValueChange={value => sortByOnchange(value)}
                        >
                            <Picker.Item label="Sort by" value={0} />
                            {sortByList.length > 0 ? sortByList.map(item => {
                                return <Picker.Item key={item.id} label={item.name} value={item.id} />
                            }) : null}
                        </Picker>
                    </Item>
                    <Item picker style={styles.filterSelect}>
                        <Picker
                            mode="dropdown"
                            style={styles.filterPicker}
                            selectedValue={datePosted}
                            onValueChange={value => datePostedOnchange(value)}
                        >
                            <Picker.Item label="Date posted" value="select" />
                        </Picker>
                    </Item>
                </View>
                : null}
                {filterLoading  ? <Spinner color="#00639c" style={{ marginTop: 10, alignSelf: 'center' }} /> : null}
                {data.length > 0 ?
                    <FlatList
                        data={data}
                        renderItem={({ item }) => {
                            return <HashtagPost
                                post={item} start={start} end={end} data={data} setData={setData} setShowPosts={setShowPosts}
                                setEditing={setEditing} menuId={menuId} setMenuId={setMenuId}
                            />
                        }}
                        keyExtractor={item => item.id}
                    />
                    : <Text style={styles.noData}>No data found</Text>
                }
            </Modal>
        </>
    )
}

export default Hashtag