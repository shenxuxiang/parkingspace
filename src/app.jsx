import React, { Component } from 'react'
import RouteMap from './routemap.jsx'
import pureRenderMixin from 'react-addons-pure-render-mixin'

export default
class App extends Component {
    constructor () {
        super()
        this.state = {
            ori: ''
        }
        this.shouldComponentUpdate = pureRenderMixin.shouldComponentUpdate.bind(this)
    }
    componentWillMount () {
        if ('onorientationchange' in window) {
            this.setState({ori: 'onorientationchange'})
        } else {
            this.setState({ori: 'onresize'})
        }
        this.getWindowWidth()
    }
    componentDidMount () {
        window.addEventListener(this.state.ori, this.orientationChange, false)
    }
    componentWillUnmount () {
        window.removeEventListener(this.state.ori, this.orientationChange, false)
    }
    orientationChange (event) { // 横竖屏切换时的回调函数
        clearTimeout(this.interval)
        this.interval = setTimeout(() => {
            this.getWindowWidth()
            clearTimeout(this.interval)
            this.interval = null
        }, 300)
    }
    getWindowWidth () { // 获取屏幕的宽度
        let winWidth
        if (window.orientation === -90 || window.orientation === 90) {
            winWidth = window.screen.width
        } else if (window.orientation === 0) {
            winWidth = document.documentElement.clientWidth
        }
        document.documentElement.style.fontSize = '' + (winWidth / 10) + 'px'
    }
    render () {
        return (
            <RouteMap/>
        )
    }
}
