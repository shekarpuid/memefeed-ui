import React, { useState, useEffect } from 'react'
import { Container, Content, H1, Text } from 'native-base'
import { Image, View } from 'react-native'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Button, TextInput, Item } from '../components/index'
import styles from '../styles/common'
import { httpService } from '../utils'
import { Loader } from '../components/Loader'

function ChangePrivacy(props) {
    const { user } = props
    const [data, setData] = useState({})
    const [loading, setLoading] = useState(false)
    const [status, setStatus] = useState('1')
    let isMount = true

    useEffect(() => {
        getPrivacy()
        return () => {
            isMount = false
        }
    }, [])
    

    const getPrivacy = async () => {
        setLoading(true)
        const url = 'user/user_privacy_settings'
        const formData = new FormData()
        formData.append('user_id', user.data.session_id)

        await httpService(url, 'POST', formData)
            .then(res => res.json())
            .then(async (json) => {
                setData(json)
                setStatus(json.data)
                // console.log("Privacy data: ", JSON.stringify(json))
                setLoading(false)
            })
            .catch(error => {
                setLoading(false)
                alert(error)
                console.log(error)
            })
    }

    const handleSubmit = async () => {
        setLoading(true)
        let privacyStatus = null
        if(status === '1'){
            privacyStatus = 0
        }else{
            privacyStatus = 1
        }
        const url = 'user/user_privacy_settings'
        const formData = new FormData()
        formData.append('user_id', user.data.session_id)
        formData.append('privacy_status', privacyStatus)
        // console.log("Privacy form data: ", JSON.stringify(formData))

        await httpService(url, 'POST', formData)
            .then(res => res.json())
            .then(async (json) => {
                alert(json.msg)
                setData(json)
                setStatus(json.data)

                // console.log("Change Privacy: ", JSON.stringify(json))
                setLoading(false)
            })
            .catch(error => {
                setLoading(false)
                alert(error)
                console.log(error)
            })
    }

    return (
        <>
            <Container style={styles.blueBg}>
                <Content style={styles.content}>
                    <H1 style={styles.h1}>Change Privacy</H1>
                    {status === '0' ?
                        <Text style={{ color: '#fff', marginBottom: 15 }}>Your account is private now. Want to change it to public?</Text>
                        :
                        <Text style={{ color: '#fff', marginBottom: 15 }}>Your account is public now. Want to change it to private?</Text>
                    }
                    <Button full rounded textLight style={styles.mt10} onPress={() => handleSubmit()}>SUBMIT</Button>
                    
                </Content>
            </Container>
            {loading ? <Loader /> : null}
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

export default connect(mapStateToProps, mapDispatchToProps)(ChangePrivacy)