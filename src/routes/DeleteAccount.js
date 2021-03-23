import React, { useState, useEffect } from 'react'
import { Container, Content, H1 } from 'native-base'
import { Image, View, Text } from 'react-native'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Button, TextInput, Item } from '../components/index'
import styles from '../styles/common'
import { httpService } from '../utils'

function DeleteAccount(props) {
    const { user } = props
    const [deletePassword, setDeletePassword] = useState('')
    const [masterPassword, setMasterPassword] = useState('')
    const [response, setResponse] = useState({})
    let isMount = true

    useEffect(() => {
        console.log(JSON.stringify(user))
        return () => {
            isMount = false
        }
    }, [])

    const handleSubmit = async () => {
        const url = 'users/delete_account'
        const formData = new FormData()
        formData.append('user_id', user.data.session_id)

        await httpService(url, 'POST', formData)
            .then(res => res.json())
            .then(async (json) => {
                if (json.data[0].master_password_status === 1) {
                    if (isMount) {
                        setResponse(json.data)
                    }
                } else {
                    try {
                        await AsyncStorage.removeItem('userData')
                    } catch (error) {
                        alert(error)
                        return
                    }
                    props.navigation.navigate('Main')
                }
                // console.log("Hashtag Posts: ", JSON.stringify(json))
            })
            .catch(error => {
                alert(error)
                console.log(error)
            })
    }

    const deleteAccount = async () => {
        if (deletePassword.length === 0) {
            alert('Please enter delete password')
            return
        }
        if (masterPassword.length === 0) {
            alert('Please enter master password')
            return
        }
        const url = 'users/delete_account'
        const formData = new FormData()
        formData.append('user_id', user.data.session_id)
        formData.append('delete_password', deletePassword)
        formData.append('delete_master_password', masterPassword)

        await httpService(url, 'POST', formData)
            .then(res => res.json())
            .then(async (json) => {
                try {
                    await AsyncStorage.removeItem('userData')
                } catch (error) {
                    alert(error)
                    return
                }
                props.navigation.navigate('Main')

                // console.log("Hashtag Posts: ", JSON.stringify(json))
            })
            .catch(error => {
                alert(error)
                console.log(error)
            })
    }

    return (
        <>
            <Container style={styles.blueBg}>
                <Content style={styles.content}>
                    <H1 style={styles.h1}>Delete Account</H1>
                    {Object.keys(response).length > 0 && response[0].master_password_status === 1 ?
                        <>
                            <Item regular>
                                <TextInput light placeholder="Delete password*" value={deletePassword} onChangeText={(value) => setDeletePassword(value)} secureTextEntry={true} />
                            </Item>
                            <Item regular>
                                <TextInput light placeholder="Master password*" value={masterPassword} onChangeText={(value) => setMasterPassword(value)} secureTextEntry={true} />
                            </Item>
                            <Button full rounded textLight style={styles.mt10} onPress={() => deleteAccount()}>SUBMIT</Button>
                        </>
                        :
                        <>
                            <Text style={{ color: '#fff', marginBottom: 15 }}>Once delete your account, you never get it back.</Text>
                            <Button full rounded textLight style={styles.mt10} onPress={() => handleSubmit()}>SUBMIT</Button>
                        </>
                    }
                </Content>
            </Container>
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

export default connect(mapStateToProps, mapDispatchToProps)(DeleteAccount)