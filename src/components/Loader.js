import React from 'react'
import { Dimensions, TouchableWithoutFeedback, View, Text, ActivityIndicator } from 'react-native'
import styles from '../styles/common'
const {width, height} = Dimensions.get('window')
// Loader
export const Loader = () => {
    return(
        <TouchableWithoutFeedback>
            <View style={[styles.vhCenter ,{
            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999,
            backgroundColor: 'rgba(0,0,0,.45)'
        }]}>
            <View style={[styles.vhCenter ,{flexDirection: 'row', 
                width: 250,
                backgroundColor: '#fff',borderRadius: 8, padding: 25,
            }]}>
                <ActivityIndicator size='small' color='#00639c' />
                <Text style={{color: '#333', marginLeft: 15}}>Please wait...</Text>
            </View>
            </View>
        </TouchableWithoutFeedback>
    )
}