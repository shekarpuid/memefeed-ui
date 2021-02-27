import React, { useState, useEffect } from 'react'
import { encode } from 'base-64'
import { env } from '../env'

const UsePostFetch = (url, method, formData) => {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [data, setData] = useState(null)
    
    useEffect(() => {
        const username = 'memefeed'
        const password = 'Connect12345!'
        const myHeaders = new Headers()
        myHeaders.append('Content-Type', 'multipart/form-data')
        myHeaders.append(
            'Authorization',
            `Basic ${encode(`${username}:${password}`)}`
        )
        setLoading(true)
        fetch(`${env.baseUrl}${url}`, {
            method: method,
            headers: myHeaders,
            body: formData
        })
            .then(res => res.json())
            .then(json => {
                console.log("Use Post Fetch Response: ", JSON.stringify(json))
                setLoading(false)
                setData(json)
            })
            .catch(error => {
                setLoading(false)
                setError(error)
            })
    }, [url])

    return { loading, error, data }
}

export default UsePostFetch