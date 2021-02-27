import React, { useEffect, useState } from 'react'
import { View, Text, ActivityIndicator, FlatList, Platform, TouchableOpacity, StyleSheet } from 'react-native'
import { Picker, Item } from 'native-base'
import UsePostFetch from '../../../hooks/UsePostFetch'
import styles from '../../../styles/common'
import { httpService } from '../../../utils'
import Post from '../../../components/Post'
import Ionicon from 'react-native-vector-icons/dist/Ionicons'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler'

export const ProfileAlbums = (props) => {
    const { user, height, width, filterMenu, setFilterMenu } = props
    const formData = new FormData()
    formData.append('user_id', user.data.session_id)
    const { loading, error, data } = UsePostFetch('album/album_name_list', 'POST', formData)

    const [selected, setSelected] = useState('all')
    const [albumNames, setAlbumNames] = useState([])
    const [albums, setAlbums] = useState([])
    const [filterdAlbums, setFilterdAlbums] = useState([])
    const [items, setItems] = useState(10)
    const [loadmore, setLoadmore] = useState(false)
    const [noData, setNoData] = useState('')

    useEffect(() => {
        getAlbums()
        getAlbumNames()
        // console.log(JSON.stringify('albums ', albums))
        // console.log(JSON.stringify('albums ', albumNames))
    }, [])

    const getAlbumNames = async () => {
        await httpService('album/album_name_list', 'POST', formData)
            .then(res => res.json())
            .then(json => {
                if (json.status === 0) {
                    setNoData(json.msg)
                } else {
                    setAlbumNames(json.data)
                }
                console.log("Albums: ", JSON.stringify(json))
            })
            .catch(error => console.log(error))
    }

    const getAlbums = async () => {
        await httpService('album/album_list', 'POST', formData)
            .then(res => res.json())
            .then(json => {
                setAlbums(json.data)
                setFilterdAlbums(json.data)
                // console.log("Albums: ", JSON.stringify(json))
            })
            .catch(error => console.log(error))
    }

    const getFilteredAlbums = async (value) => {
        console.log(value)
        setFilterMenu(false)
        if (value === 'all') {
            setFilterdAlbums(albums)
        } else {
            let filteredItems = albums.filter(album => album.album_name.toLowerCase() === value.toLowerCase())
            // console.log("filteredItems", JSON.stringify(filteredItems))
            setFilterdAlbums(filteredItems)
        }
    }

    const onValueChange = () => { }

    const loadMore = () => {
        if (items <= filterdAlbums.length) {
            setLoadmore(true)
            setTimeout(() => {
                setLoadmore(false)

                setItems(items + 10)
            }, 100)
        }
    }

    const headerComp = () => {
        return <Text>Header Component</Text>
    }

    const footerComp = () => {
        if (loadmore) {
            return <ActivityIndicator color="#00639c" size='large' style={{ height: 50, backgroundColor: '#fff' }} />
        } else {
            return <View></View>
        }
    }

    return (
        <View>

            {/* {albumNames.length > 0 &&
                <Item picker style={{
                    height: 45, marginLeft: 20,
                    backgroundColor: '#ddd', paddingHorizontal: 10, width: 190,
                    marginVertical: 10, borderRadius: 5, borderStyle: 'solid', borderWidth: 1,
                    borderColor: '#ddd'
                }}>
                    <Picker
                        mode="dropdown"
                        style={{ width: '100%' }}
                        selectedValue={selected}
                        onValueChange={(itemValue, itemIndex) => {
                            setSelected(itemValue)
                            getFilteredAlbums(itemValue)
                        }}
                    >
                        <Picker.Item label="All" value="all" />
                        {albumNames.map(album => {
                            return <Picker.Item key={album.id} label={album.name} value={album.name} />
                        })}
                    </Picker>
                </Item>
            } */}

            {noData !== '' ? <Text style={styles.noData}>{noData}</Text> :
                <FlatList
                    data={filterdAlbums}
                    keyExtractor={item => item.id.toString()}
                    renderItem={({ item, index }) => {
                        if (index + 1 <= items) {
                            return <Post post={item} user={user} />
                        }
                    }}
                    initialNumToRender={1}
                    bounces={false}
                    onEndReached={() => loadMore()}
                    onEndReachedThreshold={0.2}
                    // ListHeaderComponent={headerComp}
                    ListFooterComponent={footerComp}
                    style={{ height: Platform.OS === 'ios' ? height - 257 : height - 235 }}
                />
            }

            {/* Filters */}
            {albumNames.length > 0 &&
                <View style={{
                    position: 'absolute', right: 20, top: -35
                }}>
                    <TouchableOpacity onPress={() => setFilterMenu(!filterMenu)}
                        style={{ position: 'absolute', top: -0, right: 5 }}
                    >
                        <Ionicon name="ios-filter-outline" size={25} />
                    </TouchableOpacity>
                    {filterMenu &&
                        <>
                            <TouchableWithoutFeedback
                                style={{
                                    backgroundColor: 'rgba(0,0,0,.01)',
                                    position: 'relative', top: -220, left: 25,
                                    width: width + 50, height: height
                                }}
                                onPressIn={() => {
                                    setFilterMenu(false)
                                }}
                            >
                            </TouchableWithoutFeedback>
                            <View style={{
                                position: 'absolute', right: -5, top: 30, width: 150,
                                backgroundColor: '#fff', zIndex: 9999, elevation: 9999,
                                shadowColor: '#aaa', shadowOffset: { width: 0, height: 7 }, shadowOpacity: 0.25,
                                padding: 0, borderWidth: 1, borderColor: '#ddd'
                            }}>
                                <TouchableOpacity onPress={() => getFilteredAlbums('all')}
                                    style={{ paddingVertical: 10, paddingHorizontal: 20 }}
                                >
                                    <Text>All</Text>
                                </TouchableOpacity>
                                {albumNames.map(album => {
                                    return <TouchableOpacity onPress={() => getFilteredAlbums(album.name)}
                                        style={{ paddingVertical: 10, paddingHorizontal: 20 }}
                                    >
                                        <Text>{album.name}</Text>
                                    </TouchableOpacity>
                                })}
                            </View>
                        </>
                    }
                </View>
            }
        </View>
    )
}