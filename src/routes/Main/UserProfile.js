import React, { useEffect, useState } from 'react'
import { Container, Text, Thumbnail, Icon } from 'native-base'
import { Dimensions, TouchableOpacity, View } from 'react-native'
import defaultAvatar from '../../../assets/grayman.png'
import Ionicon from 'react-native-vector-icons/dist/Ionicons'
import styles from '../../styles/common'
import { env } from '../../env'
import { ProfilePosts } from './Profile/ProfilePosts'
import { ProfileAlbums } from './Profile/ProfileAlbums'

const Profile = (props) => {
	// setSelectedTabIndex, getaActive, 
	const { user, postTypes, onHomePostSend, showPosts, setShowPosts } = props
	const imageUrl = `${env.baseUrl}${user.data.profile_image}`
	const [posts, setPosts] = useState(false)
	const [albums, setAlbums] = useState(false)
	const { height, width } = Dimensions.get('window')
	const [filterMenu, setFilterMenu] = useState(false)
	const [menuId, setMenuId] = useState(0)
	let isMount = true

	useEffect(() => {
		// console.log(JSON.stringify(user))
		// console.log(user.data.profile_image)
		if (user.data.user_type === 'Creator') {
			setPosts(true)
		} else {
			setAlbums(true)
		}

		return () => {
            isMount = false
        }
	}, [])

	

	const renderHeader = () => {
		return (
			<View style={{ height: 140, width: "100%", flexDirection: 'row', borderBottomColor: '#808080', borderBottomWidth: 2 }}>
				<View style={{ justifyContent: 'center', alignItems: 'center', flex: 0.3 }}>
					<Thumbnail
						style={{ borderWidth: 5, borderColor: '#00639c' }}
						large
						// source={{uri: 'https://cdn.fastly.picmonkey.com/contentful/h6goo9gw1hh6/2sNZtFAWOdP1lmQ33VwRN3/24e953b920a9cd0ff2e1d587742a2472/1-intro-photo-final.jpg?w=800&q=70'}}
						source={
							user.data.profile_image === null || user.data.profile_image === undefined ? defaultAvatar :
								user.data.login_with === 'gmail' || user.data.login_with === 'facebook' ? { uri: user.data.profile_image } :
									user.data.profile_image.length > 0 ? { uri: imageUrl } :
										defaultAvatar}
					/>
				</View>
				<View style={{ flex: 1 }}>
					<View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
						<View style={{ flex: 0.7 }}>
							<Text style={{ fontWeight: 'bold' }}>{user.data.name}</Text>
							<Text style={{ fontWeight: 'bold', color: '#808080', fontSize: 15 }}>{user.data.handle_name}</Text>
						</View>
						<View style={{ flex: 0.3, flexDirection: 'row', justifyContent: 'space-between', paddingRight: 10 }}>
							<View>
								<Ionicon name='notifications' style={{ fontSize: 30 }} />
							</View>
							{/* <View>
							<Ionicon name='chatbubble-ellipses-outline' style={{ fontSize: 30 }} />
						</View> */}
							<TouchableOpacity>
								<Icon name='thumbs-up-sharp' />
							</TouchableOpacity>
						</View>
					</View>
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
		<Container>
			<View style={{ flex: 1 }} onStartShouldSetResponder={() => {
				if (menuId > 0) setMenuId(0)
			}}>
				{showPosts ? null :
					<>
						{renderHeader()}
						{/* tabs titles */}
						<View style={styles.tabsHeaders}>
							{user.data.user_type === 'Creator' &&
								<TouchableOpacity style={styles.pTabLink} onPress={() => {
									setPosts(true)
									setAlbums(false)
								}}>
									<Text style={[styles.pTabLinkText, { color: posts ? '#00639c' : '#333', fontWeight: posts ? 'bold' : 'normal' }]}>Posts</Text>
								</TouchableOpacity>
							}
							<TouchableOpacity style={styles.pTabLink} onPress={() => {
								setPosts(false)
								setAlbums(true)
							}}>
								<Text style={[styles.pTabLinkText, { color: albums ? '#00639c' : '#333', fontWeight: albums ? 'bold' : 'normal' }]}>Albums</Text>
							</TouchableOpacity>
						</View>
					</>
				}

				{/* Child Comps */}
				<View>
					{posts ?
						<ProfilePosts
							user={user} height={height} width={width}
							// filterMenu={filterMenu} setFilterMenu={setFilterMenu}
							postTypes={postTypes} onHomePostSend={onHomePostSend}
							showPosts={showPosts} setShowPosts={setShowPosts}
							menuId={menuId} setMenuId={setMenuId}
						/> :
						<ProfileAlbums
							user={user} height={height} width={width}
							filterMenu={filterMenu} setFilterMenu={setFilterMenu}
							postTypes={postTypes} onHomePostSend={onHomePostSend}
							showPosts={showPosts} setShowPosts={setShowPosts}
							setPosts={setPosts} menuId={menuId} setMenuId={setMenuId}
						/>
					}
				</View>
			</View>
		</Container>
	)
}

export default Profile
