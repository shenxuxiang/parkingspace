import React, { Component } from 'react'
import pureRenderMixin from 'react-addons-pure-render-mixin'
import PropTypes from 'prop-types'

export default
class Notice extends Component {
    constructor () {
        super()
        this.state = {
            leaveAnimation: false // 是否开启结束动画
        }
        this.shouldComponentUpdate = pureRenderMixin.shouldComponentUpdate.bind(this)
    }
    componentDidMount () {
        this.interval = setTimeout(() => {
            this.closeToast()
        }, this.props.duration - 300)
    }
    componentWillUnmount () {
        this.clearTimer()
    }
    clearTimer () {
        clearTimeout(this.interval)
        this.interval = null
    }
    closeToast () {
        this.clearTimer()
        this.setState({leaveAnimation: true})
        this.timer = setTimeout(() => {
            this.props.onCloseToast()
            clearTimeout(this.timer)
            this.timer = null
        }, 300)
    }
    render () {
        return (
            <div
                className={this.state.leaveAnimation ? 'toast-box-txt leave' : 'toast-box-txt'}
            >
                {this.props.content}
            </div>
        )
    }
}
Notice.propTypes = {
    duration: PropTypes.number,
    onCloseToast: PropTypes.func,
    content: PropTypes.any
}
