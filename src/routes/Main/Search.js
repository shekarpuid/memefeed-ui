import React, { useState, useEffect } from 'react';
import { List, Text, ListItem, Thumbnail, Left, Body, Right, Spinner, Header, Item, Input } from 'native-base';
import { Image, View, TouchableOpacity, ScrollView, Platform } from 'react-native'
import Ionicon from 'react-native-vector-icons/dist/Ionicons'
import { env } from "../../env"
import { encode } from 'base-64'
import styles from '../../styles/common'
import defaultAvatar from '../../../assets/grayman.png'
import { httpService } from '../../utils';
import { Loader } from '../../components/Loader'
import UserProfileModal from './UserProfileModal';

// User component
const User = (props) => {
	const { user, imageUrl, followHandler, toIds, item, setViewUser, setIsVisible } = props
	let indexId = toIds.findIndex(id => id == item.id)
	let http = item.profile_image.search('https')
	let isMount = true

	useEffect(() => {
		// console.log("User item:" + JSON.stringify(item))
		// console.log(indexId)
		return () => {
			isMount = false
		}
	}, [])

	useEffect(() => {
		// const isNumber = id => id == user.id
		// indexId = toIds.findIndex(id => id == user.id)
		console.log("toIds: " + JSON.stringify(toIds))
		console.log("indexId: " + JSON.stringify(indexId))
	}, [toIds])

	return (
		<>
			<ListItem avatar key={item.id} >
				<Left>
					{/* <Thumbnail source={user.profile_image === null || user.profile_image === '' ? { uri: defaultAvatar } : { uri: imageUrl }} /> */}
					<Thumbnail
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
						<Text>{item.name}</Text>
					</TouchableOpacity>
					<Text note>{item.handle_name}</Text>
				</Body>
				<Right>
					{indexId >= 0 || item.to_id === user.data.session_id ?
						<View style={
							{
								backgroundColor: '#00639c',
								justifyContent: 'center',
								alignItems: 'center',
								width: 120,
								height: 40,
								marginRight: 4,
								borderWidth: 1,
								borderColor: '#00639c'
							}
						}>
							<Text style={{ color: '#fff', fontWeight: 'bold' }}>Following</Text>
						</View>
						:
						<TouchableOpacity style={{
							backgroundColor: '#fff',
							justifyContent: 'center',
							alignItems: 'center',
							width: 120,
							height: 40,
							marginRight: 4,
							borderWidth: 1,
							borderColor: 'gray'
						}} onPress={() => followHandler(item)}>
							<Text style={{ color: '#000000', fontWeight: 'bold' }}>Follow</Text>
						</TouchableOpacity>
					}
				</Right>
			</ListItem>
		</>
	)
}

export const Search = (props) => {
	const { user, postTypes, onHomePostSend, showPosts, setShowPosts } = props
	const StatusBarStyle = Platform.OS === 'ios' ? 'light-content' : 'light-content'
	const [userType, setUserType] = useState('Creator')
	const [selectedIndex, setSelectedIndex] = useState(0)
	const [loading, setLoading] = useState(false)
	const [hasErrors, setHasErrors] = useState(false)
	const [users, setUsers] = useState([])
	const [loader, setLoader] = useState(false)
	const [response, setResponse] = useState({})
	const [active, setActive] = useState(false)
	const [toIds, setToIds] = useState([])
	const [value, setValue] = useState('')
	let isMount = true
	const [isVisible, setIsVisible] = useState(false)
	const [viewUser, setViewUser] = useState({})

	useEffect(() => {
		creatorsHandler()
		// console.log(JSON.stringify(users))
		return () => {
			isMount = false
		}
	}, [])

	function getActive(active) {
		if (active)
			return "Following"
		return "Follow"
	}

	function loadFollowStyle(active) {
		let buttonStyle = {
			backgroundColor: '#fff',
			justifyContent: 'center',
			alignItems: 'center',
			width: 120,
			height: 40,
			marginRight: 4,
			borderWidth: 1,
			borderColor: 'gray'
		}
		if (active) {
			buttonStyle.backgroundColor = '#00639c',
				buttonStyle.borderWidth = 0
		}
		return buttonStyle
	}

	function loadSegmentStyle(index) {
		let buttonStyle = {
			backgroundColor: '#fff',
			justifyContent: 'center',
			alignItems: 'center',
			width: 150,
			height: 40,
			marginRight: 4,
			borderWidth: 1,
			borderColor: 'gray'
		}
		if (index === selectedIndex) {
			buttonStyle.borderRadius = 15
			buttonStyle.backgroundColor = '#00639c',
				buttonStyle.borderWidth = 0
		}
		return buttonStyle

	}

	const creatorsHandler = async () => {
		await setUsers([])
		await setSelectedIndex(0);
		await setUserType('Creator')
		setLoading(true)
		// alert(selectedIndex)
		try {
			const username = 'memefeed'
			const password = 'Connect12345!'
			const myHeaders = new Headers()
			myHeaders.append('Content-Type', 'multipart/form-data')
			myHeaders.append(
				'Authorization',
				`Basic ${encode(`${username}:${password}`)}`
			)

			let formData = new FormData()
			formData.append('user_type', 'Creator')
			formData.append('user_id', user.data.session_id)
			// console.log("Users form data: " + JSON.stringify(formData))

			const url = `${env.baseUrl}users/get_users`
			const response = await fetch(url, {
				method: 'POST',
				headers: myHeaders,
				body: formData
			})
			const data = await response.json()
			// alert(JSON.stringify(data.data))
			// console.log("Users List: " + JSON.stringify(data.data))
			setUsers(data.data)
			setLoading(false)
		} catch (error) {
			setHasErrors(true)
			setLoading(false)
			alert(error)
			console.error(error)
		}
	}

	const usersHandler = async () => {
		await setUsers([])
		await setSelectedIndex(1);
		await setUserType('User')
		setLoading(true)
		try {
			const username = 'memefeed'
			const password = 'Connect12345!'
			const myHeaders = new Headers()
			myHeaders.append('Content-Type', 'multipart/form-data')
			myHeaders.append(
				'Authorization',
				`Basic ${encode(`${username}:${password}`)}`
			)

			let formData = new FormData()
			formData.append('user_type', 'user')
			formData.append('user_id', user.data.session_id)
			// console.log("Users form data: " + JSON.stringify(formData))

			const url = `${env.baseUrl}users/get_users`
			const response = await fetch(url, {
				method: 'POST',
				headers: myHeaders,
				body: formData
			})
			const data = await response.json()
			// alert(JSON.stringify(data.data))
			// console.log("Users List: " + JSON.stringify(data.data))
			setUsers(data.data)
			setLoading(false)
		} catch (error) {
			setHasErrors(true)
			setLoading(false)
			alert(error)
			console.error(error)
		}
	}

	// Tabs links
	function renderSegment() {
		return (
			<View style={{ width: '100%', height: 70, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
				<TouchableOpacity onPress={() => creatorsHandler()} style={loadSegmentStyle(0)}>
					<Text style={{ color: selectedIndex != 0 ? '#000000' : '#fff', fontWeight: 'bold' }}>Creators</Text>
				</TouchableOpacity>
				<TouchableOpacity onPress={async () => usersHandler()} style={loadSegmentStyle(1)}>
					<Text style={{ color: selectedIndex != 1 ? '#000000' : '#fff', fontWeight: 'bold' }}>People</Text>
				</TouchableOpacity>
			</View>
		)
	}

	// render users
	const renderUsers = () => {
		if (hasErrors) return <Text style={styles.error}>Unable to display comments.</Text>
		if (users.length > 0) {
			return users.map(item => {
				const imageUrl = `${env.baseUrl}${item.profile_image}`
				return <User item={item} imageUrl={imageUrl} followHandler={followHandler} toIds={toIds} user={user}
					setViewUser={setViewUser} setIsVisible={setIsVisible}
				/>
			})
		}
		return <Text style={styles.noData}>No users to display.</Text>
	}

	// Follow handler
	const followHandler = async (followUser) => {
		// console.log("followUser: ", JSON.stringify(followUser))
		setResponse({})
		setLoader(true)
		let userType = ''
		if (followUser.user_type === 'Creator') {
			userType = 'creator'
		} else {
			userType = 'user'
		}
		const url = 'followers/following'
		const formData = new FormData()
		formData.append('user_id', user.data.session_id)
		formData.append('type', userType)
		formData.append('to_id', followUser.id)
		// console.log("Hashtag follow: ", JSON.stringify(formData))

		await httpService(url, 'POST', formData)
			.then(res => res.json())
			.then(json => {
				setResponse(json)
				setToIds([...toIds, json.to_id])

				// console.log(JSON.stringify(toIds))
				if (json.status === 0) {
					alert(json.msg)
				} else {
					alert(json.msg)
				}
				// console.log("User follow response: ", JSON.stringify(json))
				setLoader(false)
			})
			.catch(error => {
				alert(error)
				setLoader(false)
			})
	}

	// Search Hashtags
	const searchHandler = async () => {
		setLoading(true)
		setValue('')
		const url = 'users/get_users'
		const method = 'POST'
		const formData = new FormData()
		formData.append('search_val', value)
		formData.append('user_id', user.data.session_id)
		formData.append('user_type', userType)
		// console.log("Search Users form data: ", JSON.stringify(formData))

		await httpService(url, method, formData)
			.then(res => res.json())
			.then(json => {
				if (json.status === 0) {
					alert(json.msg)
				} else {
					if (isMount) setUsers(json.data)
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
		<>
			<Header searchBar style={{ backgroundColor: '#00639c' }} androidStatusBarColor="#00639c"
				iosBarStyle={StatusBarStyle}>
				<Item style={{ paddingHorizontal: Platform.OS === 'ios' ? 10 : 0 }}>
					<Input placeholder="User's Search"
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
			{renderSegment()}
			<ScrollView>
				{loading ? <Spinner color="#00639c" style={{ marginTop: 10, alignSelf: 'center' }} /> : <List>{renderUsers()}</List>}
			</ScrollView>

			{isVisible &&
				<UserProfileModal
					viewUser={viewUser} loggedInUser={user}
					isVisible={isVisible} setIsVisible={setIsVisible}
					onHomePostSend={onHomePostSend} postTypes={postTypes} showPosts={showPosts} setShowPosts={setShowPosts}
				/>
			}
			{loader ? <Loader /> : null}
		</>
	)
}