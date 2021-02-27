import { env } from './env'
import { encode } from 'base-64'
import { GoogleSignin } from '@react-native-community/google-signin'
import { LoginManager, AccessToken, GraphRequest, GraphRequestManager } from 'react-native-fbsdk'

// Google, Fb login
export const googleSignOut = async () => {
    // alert("Google sign out")
    try {
        await GoogleSignin.revokeAccess()
        await GoogleSignin.signOut()
    } catch (error) {
        console.error(error)
    }
}
export const fbSignOut = async () => {
    // alert("FB sign out")
    let current_access_token = '';
    AccessToken.getCurrentAccessToken().then((data) => {
        current_access_token = data.accessToken.toString();
    }).then(() => {
        let logout =
            new GraphRequest(
                "me/permissions/",
                {
                    accessToken: current_access_token,
                    httpMethod: 'DELETE'
                },
                (error, result) => {
                    if (error) {
                        console.log('Error fetching data: ' + error.toString());
                    } else {
                        LoginManager.logOut();
                    }
                });
        new GraphRequestManager().addRequest(logout).start();
    })
        .catch(error => {
            console.log(error)
        });
}

// Time ago
export function timesAgo(date) {
    // console.log(date) // 2021-02-17 13:17:30
    if (date !== undefined) {
        let strDate = date
        let dateFormat = strDate.split(' ')
        let dateStr = dateFormat[0].split('-').join('/')
        let timeStr = dateFormat[1]
        let formatedDate = dateStr + " " + timeStr
        let datum = Date.parse(formatedDate)
        // let dateDatum =  datum/1000
        // console.log(dateDatum)
        const NOW = new Date()
        const times = [["second", 1], ["minute", 60], ["hour", 3600], ["day", 86400], ["week", 604800], ["month", 2592000], ["year", 31536000]]

        let diff = Math.round((NOW - datum) / 1000)
        for (let t = 0; t < times.length; t++) {
            if (diff < times[t][1]) {
                if (t == 0) {
                    return "Just now"
                } else {
                    diff = Math.round(diff / times[t - 1][1])
                    return diff + " " + times[t - 1][0] + (diff == 1 ? " ago" : "s ago")
                }
            }
        }
    }
}

// Http Service
export function httpService(url, method, formData) {
    const username = 'memefeed'
    const password = 'Connect12345!'
    const myHeaders = new Headers()
    myHeaders.append('Content-Type', 'multipart/form-data')
    myHeaders.append(
        'Authorization',
        `Basic ${encode(`${username}:${password}`)}`
    )
    // setLoading(true)
    return fetch(`${env.baseUrl}${url}`, {
        method: method,
        headers: myHeaders,
        body: formData
    })
}

