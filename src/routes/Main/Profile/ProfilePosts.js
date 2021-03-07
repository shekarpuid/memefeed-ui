import React, { useEffect, useState } from 'react'
import { View, Text, FlatList, ActivityIndicator, Pressable, StyleSheet } from 'react-native'
import styles from '../../../styles/common'
import { httpService } from '../../../utils'
import Post from '../../../components/Post'
import CreatePost from '../../../components/CreatePost/CreatePost'

export const ProfilePosts = props => {
    const { user, height, width, postTypes, onHomePostSend,
        showPosts, setShowPosts, menuId, setMenuId
    } = props
    const [loading, setLoading] = useState(false)
    const [posts, setPosts] = useState([])
    const [noData, setNoData] = useState('')
    const [editing, setEditing] = useState(false)
    const [newPost, setNewPost] = useState(0)
    const [items, setItems] = useState(10)
    const [loadmore, setLoadmore] = useState(false)

    useEffect(() => {
        getCreatorPosts()
    }, [])

    const getCreatorPosts = async () => {
        setLoading(true)
        const formData = new FormData()
        formData.append('creator_user_id', user.data.session_id)

        await httpService('posts/postlist', 'POST', formData)
            .then(res => res.json())
            .then(json => {
                if (json.status === 0) {
                    setNoData(json.msg)
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

    return (
        <View>
            {/* {menuId > 0 ?
                <Pressable style={{
                    position: 'absolute', top: -250, left: 0, elevation: 1, zIndex: 1,
                    backgroundColor: 'rgba(0,0,0,0.25)', width: width, height: height
                }}></Pressable>
                : null
            } */}

            {showPosts ?
                <CreatePost
                    onPostSend={(data) => onHomePostSend(data)}
                    postTypes={postTypes} user={user}
                    editing={editing} setEditing={setEditing}
                    setNewPost={setNewPost} newPostFetch={getCreatorPosts}
                /> :
                <View style={{ paddingVertical: 0, marginBottom: 180 }}>
                    {loading ? <ActivityIndicator size='large' color='#00639c' style={{ marginTop: 20 }} /> : null}
                    <FlatList
                        data={posts}
                        keyExtractor={item => item.id.toString()}
                        renderItem={({ item, index }) => {
                            if (index + 1 <= items) {
                                return <Post post={item} user={user}
                                    menuId={menuId} setMenuId={setMenuId}
                                    start={0} end={9} menuId={menuId} setMenuId={setMenuId}
                                    editing={editing} setEditing={setEditing} setShowPosts={setShowPosts}
                                />
                            }
                        }}
                        bounces={false} onEndReached={() => loadMore()}
                        onEndReachedThreshold={0.2}
                        ListFooterComponent={footerComp}
                        style={{ height: Platform.OS === 'ios' ? height - 257 : height - 235 }}
                    />
                </View>
            }
        </View>
    )
}