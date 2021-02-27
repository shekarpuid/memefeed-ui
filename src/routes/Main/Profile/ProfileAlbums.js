import React, { useEffect, useState } from 'react'
import { View, Text, ActivityIndicator, FlatList, Platform } from 'react-native'
import { Picker, Item } from 'native-base'
import UsePostFetch from '../../../hooks/UsePostFetch'
import styles from '../../../styles/common'
import { httpService } from '../../../utils'
import Post from '../../../components/Post'

export const ProfileAlbums = (props) => {
    const { user, height, width } = props
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
        return <Text>Header Comp</Text>
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
            {albumNames.length > 0 &&
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
            }

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
                    style={{ height: Platform.OS === 'ios' ? height - 325 : height - 235 }}
                />
            }
        </View>
    )
}