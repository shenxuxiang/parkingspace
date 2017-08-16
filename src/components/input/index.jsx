 import './style.css'
import React from 'react'
import pureRenderMixin from 'react-addons-pure-render-mixin'
import apis from '../../common/apis.js'

export default
class Input extends React.Component {
    constructor () {
        super()
        this.state = {
            transparent: true,
            inputVla: '',
            alerts: ''
        }
        this.shouldComponentUpdate = pureRenderMixin.shouldComponentUpdate.bind(this)
    }
    focus (event) { // 得到焦点
        this.setState({transparent: false})
        window.scrollTo(0, event.target.offsetParent.offsetTop - 150)
    }
    blur (event) { // 失去焦点
        if (event.target.value === '') {
            this.setState({transparent: true})
        } else {
            this.setState({transparent: false})
        }
    }
    handle (event) {
        this.setState({inputVla: event.target.value})
    }
    handleEmit () {
        if (this.state.inputVla === '') {
            this.props.propsToState('车牌号不能为空')
            return
        } else if (/^[\u4e00-\u9fff][A-Z][a-z0-9]{5}$/.test(this.state.inputVla)) {
            apis.bindCar({
                openId: this.props.openId,
                carNo: this.state.inputVla
            }).then(resp => {
                this.props.propsToState(resp.data.desc, resp.data.code)
                this.setState({
                    inputVla: '',
                    transparent: true
                })
            }).catch(error => {
                this.props.propsToState('服务器开小差了 ~ 请稍后重试')
            })
            return
        } else {
            this.props.propsToState('车牌号格式不正确')
            return
        }
    }
    render () {
        const { title, placeHolder, type, isTap } = this.props
        return (
            <div className="input-component">
                <span className="ic-title">{title}<i>*</i></span>
                <input
                    type={type}
                    className="ic-input"
                    value={this.state.inputVla}
                    onChange={this.handle.bind(this)}
                    onFocus={this.focus.bind(this)}
                    onBlur={this.blur.bind(this)}
                    style={{background: this.state.transparent ? 'rgba(255, 255, 255, 0)' : 'rgba(255, 255, 255, 1)'}}
                />
                <div
                    className="ic-btn"
                    onTouchEnd={isTap && this.handleEmit.bind(this)}
                >
                    <span>添加</span>
                </div>
                <div className="ic-placeholder">
                    <span>{placeHolder}</span>
                </div>
            </div>
        )
    }
}

