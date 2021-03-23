import React from 'react'
import { Container, Content, H1 } from 'native-base'
import { Text } from 'react-native'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Button } from '../components/index'
import styles from '../styles/common'
import { setUserData } from '../actions/userDataActions'
import { httpService } from '../utils'

function MonetiseAccount(props) {
    const { user } = props

    const handleSubmit = async () => {
        const url = 'users/monetise_account'
        const formData = new FormData()
        formData.append('user_id', user.data.session_id)

        await httpService(url, 'POST', formData)
            .then(res => res.json())
            .then(async (json) => {
                alert(json.msg)

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
                    <H1 style={styles.h1}>Monetise Account</H1>
                    <Text style={{ color: '#fff', marginBottom: 15 }}>If you have above 1000 or 1000 followers, then only you can do request.</Text>
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

export default connect(mapStateToProps, mapDispatchToProps)(MonetiseAccount)