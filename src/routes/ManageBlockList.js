import React, { useState, useEffect } from 'react'
import { Container, Content, H1, Spinner, Text, ListItem, Thumbnail, Left, Body, Right, Item } from 'native-base'
import { FlatList, Image, View, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import styles from '../styles/common'
import { httpService } from '../utils'
import defaultAvatar from '../../assets/grayman.png'
import { env } from '../env'
import { Loader } from '../components/Loader'

function ManageBlockList(props) {
    const { user } = props
    const data = [
        { "id": "30", "user_type": "Creator", "name": "test", "handle_name": "testmemehere", "profile_image": "" },
        { "id": "32", "user_type": "Creator", "name": "Sravan", "handle_name": "creator", "profile_image": "images\/60240942406d8.png" }
    ]
    const [list, setList] = useState([])
    const [loading, setLoading] = useState(false)
    const [loader, setLoader] = useState(false)
    let isMount = true

    useEffect(() => {
        getBlockList()
        return () => {
            isMount = false
        }
    }, [])

    // get block list
    const getBlockList = async () => {
        setLoading(true)
        const url = 'users/manage_block_list'
        const formData = new FormData()
        formData.append('user_id', user.data.session_id)
        // console.log("Hashtag posts formdata: ", JSON.stringify(formData))

        await httpService(url, 'POST', formData)
            .then(res => res.json())
            .then(json => {
                if (isMount) setList(json.data)
                // console.log("Block List: ", JSON.stringify(json))
                setLoading(false)
            })
            .catch(error => {
                alert(error)
                console.log(error)
                setLoading(false)
            })
    }

    // get block list
    const unBlockHandler = async (item) => {
        setLoader(true)
        const url = 'users/manage_block_list'
        const formData = new FormData()
        formData.append('user_id', user.data.session_id)
        formData.append('un_block_user_id', item.id)
        console.log("Block users formdata: ", JSON.stringify(formData))

        await httpService(url, 'POST', formData)
            .then(res => res.json())
            .then(json => {
                if (isMount) {
                    if (json.data) {
                        setList(json.data)
                    } else {
                        setList([])
                    }
                }
                console.log("Block List: ", JSON.stringify(json))
                setLoader(false)
            })
            .catch(error => {
                alert(error)
                console.log(error)
                setLoader(false)
            })
    }

    const renderItem = ({ item, index }) => {
        const imageUrl = `${env.baseUrl}${item.profile_image}`
        const http = item.profile_image.search('https')
        return (
            <ListItem avatar key={item.id} >
                <Left>
                    {/* <Thumbnail source={user.profile_image === null || user.profile_image === '' ? { uri: defaultAvatar } : { uri: imageUrl }} /> */}
                    <Thumbnail style={styles.postAvatar}
                        source={item.profile_image === null || item.profile_image === '' ? defaultAvatar
                            : http >= 0 ? { uri: item.profile_image }
                                : item.profile_image.length > 0 ? { uri: imageUrl } :
                                    defaultAvatar}
                    />
                </Left>
                <Body>
                    <TouchableOpacity
                        onPress={() => {
                            setIsVisible(true)
                            setViewUser(item)
                        }}
                    >
                        <Text style={{ fontWeight: 'bold', fontSize: 14 }}>{item.name}</Text>
                    </TouchableOpacity>
                    <Text note style={{ fontWeight: 'bold', fontSize: 12 }}>{item.handle_name}</Text>
                </Body>
                <Right>
                    <TouchableOpacity style={{
                        backgroundColor: '#00639c',
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: 100,
                        height: 30,
                        marginRight: 4,
                        borderWidth: 1,
                        borderColor: '#00639c', borderRadius: 4
                    }} onPress={() => unBlockHandler(item)}>
                        <Text style={{ color: '#fff', fontWeight: 'bold' }}>Unblock</Text>
                    </TouchableOpacity>
                </Right>
            </ListItem>
        )
    }

    return (
        <>
            <Container>
                <Content style={styles.content}>
                    <H1 style={[styles.h1, { color: '#00639c' }]}>Manage Block List</H1>
                    {loading ? <Spinner color="#00639c" style={{ marginTop: 0, alignSelf: 'center' }} /> : null}
                    {list.length !== undefined && list.length > 0 ?
                        <FlatList
                            data={list}
                            renderItem={renderItem}
                            keyExtractor={item => item.id}
                        /> :
                        <Text style={styles.noData}>No blocked users to display.</Text>
                    }
                </Content>
            </Container>
            {loader && <Loader />}
        </>
    )
}

function mapStateToProps(state) {
    return {
        user: state.user,
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        // handleSetUserData: setUserData
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(ManageBlockList)