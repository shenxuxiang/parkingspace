const userKey = 'X45pqhDXuaGVPQTt5g67NPotr8rMDZOT' // 百度地图的开发者密钥
let script
const createScript = (src) => {
    script = document.createElement('script')
    script.src = src
    document.body.appendChild(script);
}
const removeScript = () => {
    if (script) {
        document.body.removeChild(script)
        script = null
    }
}
export default {
    getCity (sendData) {
        const result = new Promise ((resolve, reject) => {
            window.jsonpcallback = (data) => {
                resolve(data)
            }
        })
        const src = 'http://api.map.baidu.com/geocoder/v2/?callback=jsonpcallback&location=' + sendData + '&output=json&ak=' + userKey
        createScript(src)
        return result
    },
    hide () {
        removeScript()
    }
}
