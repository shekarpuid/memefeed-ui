import React, { useEffect, useState } from 'react'
import { TouchableOpacity, View, Modal } from 'react-native'
import { Container, Text, Thumbnail, Item, Input, Header, Right, Left, Body, Button, Title, Content, Footer } from 'native-base'
import defaultAvatar from '../../../assets/grayman.png'
import Ionicon from 'react-native-vector-icons/dist/Ionicons'
import styles from '../../styles/common'
import { env } from '../../env'
import { Loader } from '../../components/Loader'
import KeyboardStickyView from 'rn-keyboard-sticky-view'
import { httpService } from '../../utils'

const UserReportModal = (props) => {
    const { viewUser, loggedInUser, showReport, setShowReport } = props
    const StatusBarStyle = Platform.OS === 'ios' ? 'light-content' : 'light-content'
    const profileImage = `${env.baseUrl}${viewUser.profile_image}`
    const [value, setValue] = useState('')
    const [disable, setDisable] = useState(false)
    const [height, setHeight] = useState(0)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        // console.log(JSON.stringify(loggedInUser))
        // console.log(JSON.stringify(viewUser))
    }, [])

    const submitReport = async () => {
        setValue('')
        const url = 'users/report_user'
		const method = 'POST'
		const formData = new FormData()
		formData.append('user_id', loggedInUser.data.session_id)
		formData.append('reported_user_id', viewUser.id)
		formData.append('report_text', value)
        // console.log(JSON.stringify(formData))
        
        await httpService(url, method, formData)
			.then(res => res.json())
			.then(json => {
				if (json.status === 0 || json.status === 1) {
					alert(json.msg)
				}
				// console.log("Report response: ", JSON.stringify(json))
				setLoading(false)
				setValue('')
                setShowReport(false)
			})
			.catch(error => {
				alert(error)
				console.log(error)
				setValue('')
                setLoading(false)
                setShowReport(false)
			})
    }

    return (
        <Modal animationType="slide" visible={showReport}
            onRequestClose={() => {
                setShowReport(false)
            }}
        >
            <Container>
                <Header style={{ backgroundColor: '#00639c' }} androidStatusBarColor="#00639c" iosBarStyle={StatusBarStyle}>
                    <Left style={{ flex: 0.5 }}>
                        <Button
                            transparent
                            onPress={() => setShowReport(false)}>
                            <Ionicon name="arrow-back-outline" color="#fff" style={styles.fs25} />
                        </Button>
                    </Left>
                    <Body>
                        <Title style={{ fontWeight: 'bold', alignSelf: 'center', marginLeft: -40, color: '#fff', textTransform: 'capitalize' }}>{viewUser.user_type} Report</Title>
                    </Body>
                    <Right style={{ flex: 0.3 }}>
                        <Button
                            transparent
                            onPress={() => setShowReport(false)}>
                            <Ionicon name="close" color="#fff" style={styles.fs25} />
                        </Button>
                    </Right>
                </Header>

                <Content>
                    <View style={{ flex: 1, flexDirection: 'row', marginLeft: 10, marginTop: 10 }}>
                        <Thumbnail
                            source={
                                viewUser.profile_image.length > 0 ? { uri: profileImage } : viewUser.profile_image === null || viewUser.profile_image === undefined ? defaultAvatar : defaultAvatar}
                        />
                        <View style={{ padding: 10, backgroundColor: '#f7f7f7', borderRadius: 5, width: '81%' }}>

                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Text style={{ fontWeight: 'bold' }}>{viewUser.name}</Text>
                            </View>
                            <Text style={{ color: '#039bd4', fontSize: 13 }}>{viewUser.handle_name}</Text>
                        </View>
                    </View>

                </Content>
                <KeyboardStickyView style={{ backgroundColor: '#fff', minHeight: 45, height: height, maxHeight: 120 }}
                    keyboardVerticalOffset={44}
                >
                    <Footer style={{ paddingHorizontal: 5, marginBottom: Platform.OS === 'ios' ? 30 : 0, backgroundColor: '#fff', minHeight: 45, height: height, maxHeight: 120 }}>
                        <Item rounded style={[styles.footerItem, { minHeight: 45, height: height, top: Platform.OS === 'ios' ? 0 : -5 }]}>
                            <Input placeholder='Report here..'
                                multiline={true}
                                style={[styles.input, { minHeight: 30, height: height, maxHeight: 120 }]}
                                onChangeText={(value) => {
                                    setValue(value)
                                    if (value.length > 0) {
                                        setDisable(false)
                                    } else {
                                        setDisable(true)
                                    }
                                }}
                                value={value}
                                editable={true}
                                onContentSizeChange={(e) => setHeight(e.nativeEvent.contentSize.height)}
                            />
                            <TouchableOpacity disabled={disable} onPress={submitReport}>
                                <Ionicon active name='send' style={[styles.fs20, styles.themeColor, { opacity: disable ? 0.6 : 1 }]} />
                            </TouchableOpacity>
                        </Item>
                    </Footer>
                </KeyboardStickyView>

                {loading && <Loader />}
            </Container>
        </Modal>
    )
}

export default UserReportModal
