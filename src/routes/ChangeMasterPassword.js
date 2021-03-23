import React, { useState, useEffect } from 'react'
import { Container, Content, H1 } from 'native-base'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { encode } from 'base-64'
import { env } from '../env'
import { Button, TextInput, Item } from '../components/index'
import styles from '../styles/common'
import AsyncStorage from '@react-native-async-storage/async-storage'

function ChangeMasterPassword(props) {
    const { user } = props
    const [oldPassword, setOldPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmNewPassword, setConfirmNewPassword] = useState('')

    const handleSubmit = async () => {
        if (oldPassword.length === 0) {
            alert('Please enter old master password')
            return
        } else if (newPassword.length === 0) {
            alert('Please enter new master password')
            return
        } else if (confirmNewPassword.length === 0) {
            alert('Please enter confirm new master password')
            return
        } else if (oldPassword.length < 6) {
            alert('Please enter old master password minimum 6 characters')
            return
        } else if (newPassword.length < 6) {
            alert('Please enter new master password minimum 6 characters')
            return
        } else if (confirmNewPassword.length < 6) {
            alert('Please enter confirm new master password minimum 6 characters')
            return
        } else if (newPassword !== confirmNewPassword) {
            alert('New master password and Confirm new master password are not matched.')
            return
        } else {
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
                formData.append('user_id', user.data.session_id)
                formData.append('current_password', oldPassword)
                formData.append('master_password', newPassword)
                formData.append('confirm_master_password', confirmNewPassword)

                const url = `${env.baseUrl}users/master_password` // --> change user name, handle name, profile image api
                const response = await fetch(url, {
                    method: 'POST',
                    headers: myHeaders,
                    body: formData
                })
                const res = await response.json()
                console.log("change master password response: " + JSON.stringify(res))
                if (res.status === 1) {
                    alert("Successfully changed master password.")
                    setOldPassword('')
                    setNewPassword('')
                    setConfirmNewPassword('')
                    // try {
                    //     await AsyncStorage.removeItem('userData')
                    // } catch (error) {
                    //     alert("User data not removed.")
                    //     return
                    // }
                    props.navigation.navigate('Main')
                }else{
                    alert("Old master password is not matched. Please provide currect old master password.")
                }
            } catch (error) {
                alert(error)
                console.error(error)
            }
            // alert(`${oldPassword} ${newPassword} ${confirmNewPassword}`);
        }
    }

    return (
        <>
            <Container style={styles.blueBg}>
                <Content style={styles.content}>
                    <H1 style={styles.h1}>Change Master Password</H1>
                    <Item regular>
                        <TextInput light placeholder="Old master password*" value={oldPassword} onChangeText={(value) => setOldPassword(value)} secureTextEntry={true} />
                    </Item>
                    <Item regular>
                        <TextInput light placeholder="New master password*" value={newPassword} onChangeText={(value) => setNewPassword(value)} secureTextEntry={true} />
                    </Item>
                    <Item regular>
                        <TextInput light placeholder="Confirm new master password*" value={confirmNewPassword} onChangeText={(value) => setConfirmNewPassword(value)} secureTextEntry={true} />
                    </Item>
                    <Button full rounded textLight style={styles.mt10} onPress={() => handleSubmit()}>SUBMIT</Button>
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

export default connect(mapStateToProps, mapDispatchToProps)(ChangeMasterPassword)