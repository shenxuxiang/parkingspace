import axios from 'axios'

let apiRemote = null
let cancel = null
const CancelToken = axios.CancelToken

if (window.location.origin) {
    apiRemote = window.location.origin
} else {
    apiRemote = window.location.protocol + '//' + window.location.host
}

const axiosConfig = {
    baseURL: apiRemote,
    timeout: 10000
}

const sendRequest = (url, headers, method, sendData, isUpload) => {
    axiosConfig.url = url
    axiosConfig.headers = headers
    axiosConfig.method = (method || 'GET').toUpperCase()
    if (axiosConfig.method === 'POST') {
        axiosConfig.data = sendData || {}
    }
    if (isUpload) {
        axiosConfig.onUpLoadProgress = (progressEvent) => {}
        axiosConfig.onDownLoadProgress = (progressEvent) => {}
        axiosConfig.maxContentLength = 50000
    }
    axiosConfig.cancelToken = new CancelToken(function executor (c) {
        cancel = c
    })
    return new Promise ((resolve, reject) => {
        axios.request(axiosConfig).then (resp => {
            resolve(resp)
        }).catch(error => {
            reject({
                code: 'error_request',
                desc: '服务器开小差了~ 请稍后重试'
            })
        })
    })
}
export default {
    carnos (sendData) {
        return sendRequest('/clientCar/carnos', {
            "Content-Type": "application/json; cahrset=utf-8"
        }, 'post', sendData, true)
    },
    bindCar (sendData) {
        return sendRequest('/clientCar/bindCar', {
            "Content-Type": "application/json; cahrset=utf-8"
        }, 'post', sendData, true)
    },
    feeinfo (sendData) {
        return sendRequest('/pay/feeinfo', {
            "Content-Type": "application/json; cahrset=utf-8"
        }, 'post', sendData, true)
    },
    userkey (code) {
        return sendRequest('/pay/userkey', {
            "Content-Type": "application/json; cahrset=utf-8"
        }, 'post', {code: code}, true)
    },
    getWXPayOptions (sendData) {
        return sendRequest('/pay/jspay', {
            "Content-Type": "application/json; cahrset=utf-8"
        }, 'post', sendData, true)
    },
    getUserInfo (openId) {
        return sendRequest('/user/info', {
            "Content-Type": "application/json; cahrset=utf-8"
        }, 'post', {openId: openId}, true)
    },
    parkspaceList (sendData) {
        return sendRequest('/parklot/list', {
            "Content-Type": "application/json; cahrset=utf-8"
        }, 'post', sendData, true)
    },
    getConfig (url) {
        return sendRequest('/jsconfig', {
            "Content-Type": "application/json; cahrset=utf-8"
        }, 'post', {url: url}, true)
    },
    cancel () {
        cancel && cancel()
    }
}


