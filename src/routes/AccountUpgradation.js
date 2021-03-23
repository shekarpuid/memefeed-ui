import React, { useState, useEffect } from 'react'
import { Container, Content, H1 } from 'native-base'
import { Image, View } from 'react-native'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { encode } from 'base-64'
import { env } from '../env'
import { Button, TextInput, Item } from '../components/index'
import styles from '../styles/common'
import { setUserData } from '../actions/userDataActions'

function AccountUpgradation(props) {
    const { user, handleSetUserData } = props

    const handleSubmit = async () => {
      
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

                const url = `${env.baseUrl}users/upgrade_account` 
                const response = await fetch(url, {
                    method: 'POST',
                    headers: myHeaders,
                    body: formData
                })
                // const res = await response.json()
                // await handleSetUserData(res)
                alert("Thanks for choosing your intrest. my team members will contact you soon.")
                props.navigation.navigate('Main', {
                    profile: true
                })
            } catch (error) {
                alert(error)
                console.error(error)
            }
        
    }

    return (
        <>
            <Container style={styles.blueBg}>
                <Content style={styles.content}>
                    <H1 style={styles.h1}>Upgrade Account </H1>
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
        handleSetUserData: setUserData
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(AccountUpgradation)
