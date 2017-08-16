import './style.css'
import React, { Component } from 'react'
import pureRenderMixin from 'react-addons-pure-render-mixin'
import apis from '../../common/apis.js'
import ParComponent from '../../components/paycomponent'
import Alerts from '../../components/alerts/toast'

export default
class PayComponent extends Component {
    constructor () {
        super ()
        this.state = {
            openId: '', // 该用户的id
            appId: '', // 微信公众号的id
            pay: '', // 缴纳付费
            carNum: '', // 缴费车牌号
            nonceStr: '', // 微信随机字符串
            packageName: '', // 微信支付凭证
            signType: '', // 加密方式
            signature: '', // 微信签名
            timestamp: '',// 微信时间戳
            isTap: true,
            isShowPayComponent: false, // 支付成功后显示提示
            duration: 2000
        }
        this.getWXOptions = this.getWXOptions.bind(this)
        this.shouldComponentUpdate = pureRenderMixin.shouldComponentUpdate.bind(this)
    }
    componentWillMount () {
        const userPayOption = window.localStorage.getItem('userPayOption')
        this.setState({
            openId: userPayOption.split('&')[2],
            pay: userPayOption.split('&')[0],
            carNum: userPayOption.split('&')[1]
        })
    }
    componentDidMount () {
        this.getWXOptions()
    }
    componentWillUnmount () {
        apis.cancel()
        Alerts.hide()
    }
    getWXOptions () { // 获取调用微信 sdk 的参数信息
        apis.getWXPayOptions({
            openId: this.state.openId,
            money: this.state.pay,
            carNum: this.state.carNum
        }).then(resp => {
            if (resp.data.code === '000000') {
                this.setState({
                    appId: resp.data.content.appId,
                    timestamp: resp.data.content.timestamp,
                    nonceStr: resp.data.content.nonce,
                    packageName: resp.data.content.packageName,
                    signType: resp.data.content.signType,
                    signature: resp.data.content.signature
                })
            } else {
                Alerts.show(resp.data.desc, this.state.duration)
            }
        }).catch(error => {
            Alerts.show('服务器开小差了 ~ 请稍后重试', this.state.duration)
        })
    }
    handlePay () { // 确认支付按钮
        if (!this.state.isTap) {return}
        window.WeixinJSBridge.invoke(
            'getBrandWCPayRequest', {
                "appId": this.state.appId, // 公众号名称，由商户传入
                "timeStamp": this.state.timestamp, // 时间戳，自1970年以来的秒数
                "nonceStr": this.state.nonceStr, // 随机串
                "package": this.state.packageName, // 预支付交易会话标识
                "signType": this.state.signType, // 微信签名方式
                "paySign": this.state.signature // 微信签名
            }, (res) => {
                if (res.err_msg === "get_brand_wcpay_request:ok" ) {
                    this.setState({isShowPayComponent: true})
                } else if (res.err_msg === "get_brand_wcpay_request:cancel") {
                    Alerts.show('支付过程中用户取消', this.state.duration)
                } else if (res.err_msg === "get_brand_wcpay_request:fail") {
                    Alerts.show('支付失败', this.state.duration)
                }
            }
        )
    }
    render () {
        return (
            <div
                className="pay-page"
                onTouchStartCapture={() => {this.setState({isTap: true})}}
                onTouchMoveCapture={() => {this.setState({isTap: false})}}
            >
                <div className="pay-page-container">
                    <div className="pay-page-container-title">本次停车费用</div>
                    <div className="pay-page-container-pay"><span>￥</span>{this.state.pay}</div>
                    <div
                        className="pay-page-container-btn"
                        onTouchEnd={this.handlePay.bind(this)}
                    >确定支付</div>
                </div>
                {
                    this.state.isShowPayComponent
                    ? <ParComponent />
                    : null
                }
            </div>
        )
    }
}
