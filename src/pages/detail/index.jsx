import './style.css'
import React, { Component } from 'react'
import pureRenderMixin from 'react-addons-pure-render-mixin'
import apis from '../../common/apis'
import Alerts from '../../components/alerts/toast'

export default
class Detail extends Component {
    constructor () {
        super()
        this.state = {
            code:'',
            openId: '',
            nickName: '',
            headimgurl: '',
            infoList: ['我的钱包', '缴费记录', '附近停车场'],
            avatorImgShow: false,
            duration: 2000
        }
        this.shouldComponentUpdate = pureRenderMixin.shouldComponentUpdate.bind(this)
    }
    componentWillMount () {
        const url = window.location.href
        const start = url.indexOf('?code=')
        const end = url.indexOf('&state')
        this.setState({code: url.substring(start + 6, end)}) // 获取url中的code
    }
    componentDidMount () {
        apis.userkey(this.state.code).then(resp => {
            if (resp.data.code === '000000') {
                this.setState({openId: resp.data.content})
                this.getUserInfo()
            } else {
                Alerts.show(resp.data.desc, this.state.duration)
            }
        }).catch(error => {
            Alerts.show('服务器开小差了 ~ 请稍后重试', this.state.duration)
        })
    }
    componentWillUnmount () {
        apis.cancel()
        Alerts.hide()
    }
    getUserInfo () { // 获取用户相关信息
        apis.getUserInfo(this.state.openId).then (resp => {
            console.log(resp)
            if (resp.data.code === '000000') {
                this.setState({
                    nickName: resp.data.content.nickName,
                    headimgurl: resp.data.content.headimgurl
                })
            } else {
                Alerts.show(resp.data.desc, this.state.duration)
            }
        }).catch(error => {
            Alerts.show('服务器开小差了 ~ 请稍后重试', this.state.duration)
        })
    }
    render () {
        const liList = this.state.infoList.map((val, index) => (
            <li
                key={index}
                className="detail-page-content-item"
            >
                <span className="dpc-item-title">{val}</span>
                <span className="dpc-item-bg"></span>
            </li>
        ))
		return (
            <div className="detail-page">
                <div className="detail-page-header">
                    <span className="dph-avatar">
                        <img
                            className={this.state.avatorImgShow ? '' : 'hide'}
                            src={this.state.headimgurl}
                            alt="avator"
                            onLoad={() => {this.setState({avatorImgShow: true})}}
                        />
                    </span>
                    <span className="dph-name">{this.state.nickName}</span>
                </div>
                <ul className="detail-page-content">
                    {liList}
                </ul>
            </div>
        )
	}
}
