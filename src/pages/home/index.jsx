import './style.css'
import React, { Component } from 'react'
import pureRenderMixin from 'react-addons-pure-render-mixin'
import Input from '../../components/input'
import apis from '../../common/apis.js'
import Alerts from '../../components/alerts/toast'

export default
class Home extends Component {
    constructor () {
        super()
        this.state = {
            addNumberPlate: '', // 添加车牌号
            numberPlateList: [], // 所有车牌号
            numberPlateValue: '', // 绑定缴费车牌
            openId: '', // 该用户id
            isTap: false,
            code: '', // 用户code码
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
                this.getCarNobList()
            } else {
                Alerts.show(resp.data.desc, this.state.duration)
            }
        }).catch(error => {
            Alerts.success('服务器开小差了 ~ 请稍后重试', this.state.duration)
        })
    }
    componentWillUnmount () {
        apis.cancel()
        Alerts.hide()
    }
    getCarNobList () { // 获取该id下所有绑定的车牌
        apis.carnos({"openId": this.state.openId}).then(resp => {
            if (resp.data.code === '000000') {
                this.setState({
                    numberPlateList: resp.data.content,
                    numberPlateValue: resp.data.content[0]
                })
            } else {
                Alerts.show(resp.data.desc, this.state.duration)
            }
        }).catch(error => {
            Alerts.show('服务器开小差了 ~ 请稍后重试', this.state.duration)
        })
    }
    updateValue (name, event) { // 自组建触发更新相对应的值
        this.setState({[name]: event.target.value})
    }
    addCarNob (desc, code) { // 添加车牌号
        Alerts.show(desc, this.state.duration)
        code === '000000' && this.getCarNobList()
    }
    handleSubmit () { // 缴费按钮提交
        if (this.state.numberPlateValue === '') {
            Alerts.show('请选择缴费车牌号码', this.state.duration)
            return
        }
        apis.feeinfo({carNum: this.state.numberPlateValue}).then(resp => {
            if (resp.data.code === '000000') {
                if (resp.data.content.receivableMoney !== 0) {
                    window.localStorage.setItem("userPayOption", resp.data.content.receivableMoney + '&' + this.state.numberPlateValue + '&' + this.state.openId)
                    this.props.history.push('/topay')
                } else {
                    Alerts.show('暂无订单支付', this.state.duration)
                }
            } else {
                Alerts.show(resp.data.desc, this.state.duration)
            }
        }).catch(error => {
            Alerts.show('服务器开小差了 ~ 请稍后重试', this.state.duration)
        })
    }
    selectCarNob (val) { // 选择相应的车牌号去缴费
        this.setState({numberPlateValue: val})
    }
    render () {
		return (
            <div
                className="home-page"
                onTouchStartCapture={() => {this.setState({isTap: true})}}
                onTouchMoveCapture={() => {this.setState({isTap: false})}}
            >
                <Input
                    title="输入车牌号"
                    placeHolder="请输入您的车牌号"
                    type="text"
                    openId={this.state.openId}
                    propsToState={this.addCarNob.bind(this)}
                    isTap={this.state.isTap}
                />
                <ul className="home-page-showlist">
                    {this.state.numberPlateList.map((item, index) => (
                        <li
                            key={index}
                            className={this.state.numberPlateValue === item ? 'home-page-showlist-item active' : 'home-page-showlist-item'}
                            onTouchEnd={this.state.isTap && this.selectCarNob.bind(this, item)}
                        >
                            <span>{item}</span>
                            <span className="home-page-showlist-item-ico"></span>
                        </li>
                    ))}
                </ul>
                <div
                    className="submit-btn"
                    onTouchEnd={this.state.isTap && this.handleSubmit.bind(this)}
                >
                    <span>缴费</span>
                </div>
            </div>
		)
	}
}
