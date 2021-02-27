import React, { Component } from 'react'
import { Container, Content, Text, H1, Form, Spinner } from 'native-base'
import { Image, View, TouchableOpacity, Platform } from 'react-native'
import { connect } from 'react-redux'
import { Button, TextInput, Item } from '../../components/index'
import Logo from '../../../assets/logo.png'
import { loginUser, signupType } from '../../actions/user'
import Icon from 'react-native-vector-icons/dist/FontAwesome'
import styles from '../../styles/common'
import { GoogleSignin, statusCodes, GoogleSigninButton } from '@react-native-community/google-signin'
import { LoginManager, AccessToken, GraphRequest, GraphRequestManager } from 'react-native-fbsdk'
import InstagramLogin from 'react-native-instagram-login'
import { fetchUserInfo } from '../../actions/loginWithActions'
import DoubleTapToClose from '../../components/DoubleTapToClose'
import Splash from '../Splash/Splash'

let googleWebClientId = Platform.OS === 'ios' ? '937005234462-oc6473kb98j1gnb4bvolbvsukuggef49.apps.googleusercontent.com' : '937005234462-5snttuofho139u6g6o5cafepd35v4rjv.apps.googleusercontent.com'

class BasicLogin extends Component {
  state = {
    handleName: '',
    passcode: '',
    loading: false,
    userInfo: {},
    error: {},
    loaded: false,
    isLoading: true,
    token: '',
  }

  setIgToken = (data) => {
    alert('data', JSON.stringify(data))
    this.setState({ token: data.access_token })
  }

  componentDidMount() {
    GoogleSignin.configure({
      webClientId: googleWebClientId,

      offlineAccess: true
    })
    // alert("Basic Login with user data: " + JSON.stringify(this.props.user))
  }
  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.state.loading !== nextProps.user.loading)
      this.setState({ loading: nextProps.user.loading })
  }

  // Login submit
  async handleLogin() {
    const { handleName, passcode } = await this.state
    if (handleName === '' || passcode === '') {
      alert('Please Enter Handle Name and Passcode')
      return
    }
    const info = {
      handleName,
      passcode,
    }
    await this.props.loginUser(info)
    const userInfo = await this.props.user
    if (userInfo.error !== null) {
      alert('Internal Server Error')
      return
    }
    if (userInfo.data === null) {
      alert('User Not Found')
      return
    }
    if (
      userInfo.data.user_type === 'User' &&
      Number(userInfo.data.signup) === 1
    ) {
      this.setState({ handleName: '', passcode: '' })
      this.props.navigation.navigate('Main')
      return
    }
    if (
      userInfo.data.user_type === 'User' &&
      Number(userInfo.data.signup) === 0
    ) {
      this.setState({ handleName: '', passcode: '' })
      this.props.navigation.navigate('CreateUserId')
      return
    }
    if (
      userInfo.data.user_type === 'Creator' &&
      Number(userInfo.data.signup) === 1
    ) {
      this.setState({ handleName: '', passcode: '' })
      this.props.navigation.navigate('Main')
      return
    }
    if (
      userInfo.data.user_type === 'Creator' &&
      Number(userInfo.data.signup) === 0
    ) {
      this.setState({ handleName: '', passcode: '' })
      // this.props.navigation.navigate('AddPhone')
      this.props.navigation.navigate('Main')
      return
    }

    this.setState({ handleName: '', passcode: '' })
    this.props.navigation.navigate('RequestCode')
  }

  // Gmail login start
  signInWithGoogle = async () => {
    // alert("Google sign in")
    try {
      GoogleSignin.configure({
        webClientId: '937005234462-5snttuofho139u6g6o5cafepd35v4rjv.apps.googleusercontent.com',
        offlineAccess: true
      })
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn()
      console.log(JSON.stringify(userInfo))
      const info = {
        name: userInfo.user.name,
        profile_image: userInfo.user.photo,
        handle_name: userInfo.user.givenName,
        user_type: 'User',
        login_with: 'gmail',
        email: userInfo.user.email
      }
      this.setState({
        userInfo: userInfo,
        loaded: true
      })
      await this.props.fetchUserInfo(info)
      const user = await this.props.user
      if (user.data.user_type === 'User' && Number(user.data.signup) === 1) {
        this.props.navigation.navigate('Main')
        return
      }
      this.props.navigation.navigate('Main')
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.lerrorog("SIGN_IN_CANCELLED")
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.error("IN_PROGRESS")
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.error("PLAY_SERVICES_NOT_AVAILABLE")
      } else {
        console.error(error.message)
      }
    }
  }
  // Gmail login end

  // Facebook login start
  async onFacebookButtonPress() {
    // alert("FB sign in")
    try {
      // Attempt login with permissions
      const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);

      if (result.isCancelled) {
        throw 'User cancelled the login process';
      }

      // Once signed in, get the users AccesToken
      const data = await AccessToken.getCurrentAccessToken();

      if (!data) {
        throw 'Something went wrong obtaining access token';
      }

      AccessToken.getCurrentAccessToken().then(
        (data) => {
          const infoRequest = new GraphRequest(
            '/me?fields=name,picture',
            null,
            this._responseInfoCallback
          );
          // Start the graph request.
          new GraphRequestManager().addRequest(infoRequest).start()
        }
      )
    } catch (error) {
      alert(error)
    }
  }

  //Create response callback.
  _responseInfoCallback = async (error, result) => {
    if (error) {
      alert('Error fetching data: ' + error.toString());
    } else {
      console.log('Result : ' + JSON.stringify(result))
      const info = {
        name: result.name,
        handle_name: result.name,
        user_type: 'User',
        login_with: 'facebook',
        profile_image: result.picture.data.url,
        email: ''
      }
      this.setState({
        userInfo: result,
        loaded: true
      })
      await this.props.fetchUserInfo(info)
      const user = await this.props.user
      if (user.data.user_type === 'User' && Number(user.data.signup) === 1) {
        // if (user.data.user_type === 'User') {
        this.props.navigation.navigate('Main')
        return
      }

      // this.renderFBScreen(result)
    }
  }

  renderFBScreen = (result) => {
    return alert('Result Name: ' + result.id)
  }
  // Facebook login end

  render() {
    const { style } = this.props

    return (
      //   <>
      //   {this.state.isLoading ? <Splash /> : }
      // </>
      <Container style={style.container}>
        <Content style={style.content}>
          {/* <DoubleTapToClose /> */}
          <View style={style.body1}>
            <Image source={Logo} resizeMode="contain" style={style.image} />
          </View>
          <H1 style={style.h1}>Sign In</H1>

          <Form>
            <Item rounded>
              <TextInput
                placeholder="Handle Name"
                onChangeText={(value) => this.setState({ handleName: value })}
                value={this.state.handleName}
              />
            </Item>
            <Item rounded>
              <TextInput
                placeholder="Passcode"
                onChangeText={(value) => this.setState({ passcode: value })}
                secureTextEntry={true}
                value={this.state.passcode}
              />
            </Item>
            <Text style={style.forgot} onPress={() => this.props.navigation.navigate('ForgotPassword')}>Forgot Password?</Text>
            <Button full rounded textLight onPress={() => this.handleLogin()}>
              SIGN IN
            </Button>
            {/* <Button
              full
              rounded
              textLight
              onPress={() => this.props.navigation.navigate('CreateUserId')}>
              SIGN UP
            </Button> */}
            {this.state.loading ? (
              <Spinner
                color="red"
                style={{ marginTop: 10, alignSelf: 'center' }}
              />
            ) : null}
            <View style={style.loginWith}>
              <View style={style.hor} />
              <Text style={style.horText}>Or join with</Text>
              <View style={style.hor} />
            </View>
          </Form>

          <View style={style.footer}>
            <TouchableOpacity style={styles.roundedButton} onPress={() => this.signInWithGoogle()}>
              <Icon name='google-plus' style={{ color: '#EB412E', fontSize: 16 }} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.dFlexCenter, styles.roundedButton} onPress={() => this.onFacebookButtonPress()}>
              <Icon name='facebook' style={{ color: '#3C51A5', fontSize: 16 }} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.dFlexCenter, styles.roundedButton} onPress={() => this.instagramLogin.show()}>
              <Icon name='instagram' style={{ color: '#C134A9', fontSize: 18 }} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.dFlexCenter, styles.roundedButton}
              onPress={() => {
                this.props.signupType('email')
                this.props.navigation.navigate('AddPhone')
              }}
            >
              <Icon name='envelope' style={{ color: '#255E94', fontSize: 16 }} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.dFlexCenter, styles.roundedButton}
              onPress={() => {
                this.props.signupType('phone')
                this.props.navigation.navigate('AddPhone')
              }}
            >
              <Icon name='mobile' style={{ color: '#0183CE', fontSize: 23 }} />
            </TouchableOpacity>
          </View>

{/* 
          <Text style={{ margin: 10 }}>Token: {this.state.token}</Text>
          <TouchableOpacity
            style={{marginBottom: 50, padding: 20}}
            onPress={() => this.instagramLogin.show()}>
            <Text style={{ color: 'white', textAlign: 'center' }}>Login now</Text>
          </TouchableOpacity> */}
          <InstagramLogin
            ref={ref => (this.instagramLogin = ref)}
            appId='737116713863632'
            appSecret='30fabbbd10e8dbe409a6d211965aeed7'
            redirectUrl='http://memefeed.app/'
            // redirectUrl='https://www.google.com/'
            // scopes={['user_profile', 'user_media']}
            scopes={['basic']}
            // scopes={['public_content', 'follower_list']}
            onLoginSuccess={this.setIgToken}
            onLoginFailure={(data) => console.log(data)}
          />
        </Content>
      </Container>

    )
  }
}

export default connect(
  (state) => ({
    user: state.user,
  }),
  {
    loginUser,
    fetchUserInfo,
    signupType
  },
)(BasicLogin) 
