import React, { useState, useEffect } from 'react';
import { List, Text, ListItem, Thumbnail, Left, Body, Right, Spinner } from 'native-base';
import { Image, View, TouchableOpacity, ScrollView } from 'react-native'
import { env } from "../../env"
import { encode } from 'base-64'
import styles from '../../styles/common'
import defaultAvatar from '../../../assets/grayman.png'
import { httpService } from '../../utils';
import { Loader } from '../../components/Loader';


const User = (props) => {
	const {user, imageUrl, followHandler, toIds} = props
	const isNumber = id => id == user.id
	let indexId = toIds.findIndex(isNumber)

	return(
		<>
			<ListItem avatar key={user.id} >
					<Left>
						{/* <Thumbnail source={user.profile_image === null || user.profile_image === '' ? { uri: defaultAvatar } : { uri: imageUrl }} /> */}
						<Thumbnail
						
						source={user.profile_image === null || user.profile_image === '' ? defaultAvatar :
							user.profile_image.length > 0 ? { uri: imageUrl } :
							defaultAvatar}
					/>
					</Left>
					<Body>
						<Text>{user.name}</Text>
						<Text note>{user.handle_name}</Text>
					</Body>
					<Right>
						{indexId >= 0 ? 
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
							}} onPress={() => followHandler(user)}>
								<Text style={{ color: '#000000', fontWeight: 'bold' }}>Follow</Text>
							</TouchableOpacity>
						}
					</Right>
				</ListItem>
		</>
	)
}

export const Search = (props) => {
	const { user } = props
	const [userType, setUserType] = useState('Creator')
	const [selectedIndex, setSelectedIndex] = useState(0)
	const [loading, setLoading] = useState(false)
	const [hasErrors, setHasErrors] = useState(false)
	const [users, setUsers] = useState([])
	const [loader, setLoader] = useState(false)
	const [response, setResponse] = useState({})
	const [active, setActive] = useState(false)
	const [toIds, setToIds] = useState([])

	useEffect(() => {
		creatorsHandler()
		console.log(JSON.stringify(toIds))
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
		await setUserType('user')
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
			<View style={{ width: '100%', height: 80, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
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
			return users.map(user => {
				const imageUrl = `${env.baseUrl}${user.profile_image}`
				return <User user={user} imageUrl={imageUrl} followHandler={followHandler} toIds={toIds} />
			})
		}
		return <Text style={styles.noData}>No users to display.</Text>
	}

	const followHandler = async (followUser) => {
		setResponse({})
		setLoader(true)
		let userType = ''
		if(followUser.user_type === 'Creator'){
			userType = 'creator'
		}else{
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
                // console.log("User follow: ", JSON.stringify(json))
				setLoader(false)
            })
            .catch(error => {
				alert(error)
				setLoader(false)
			})
    }

	return (
		<ScrollView>
			{renderSegment()}
			{loading ? <Spinner color="#00639c" style={{ marginTop: 10, alignSelf: 'center' }} /> : <List>{renderUsers()}</List>}
			{loader ? <Loader /> : null}
		</ScrollView>
	)
}