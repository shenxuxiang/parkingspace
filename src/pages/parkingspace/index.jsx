import './style.css'
import React, { Component } from 'react'
import pureRenderMixin from 'react-addons-pure-render-mixin'
import apis from '../../common/apis.js'
import crossrequest from '../../common/crossrequest.js'
import MapList from '../../components/maplist'
import LoadMore from '../../components/loadmore'
import Alerts from '../../components/alerts/toast'

export default
class ParkingSpace extends Component {
    constructor () {
        super()
        this.state = {
            hasShowPage: false,
            cityName: '',
            userIp: '',
            alerts: '', // toast 提示语
            isShowToast: false, // toast是否展示
            isTap: false,
            code: '', // 用户code码
            longitude: '118.7584960000', // 经度
            latitude: '31.9774340000', // 纬度
            loadType: 'loadMore', // 加载类型 isLoading 加载中。。。 loadMore 上拉加载更多。。。  notMore 没有更多了。。。
            pageNo: 1, // 当前页数
            maxPage: '', // 最多几页
            mapList: [],
            duration: 2000
        }
        this.getParkingList = this.getParkingList.bind(this)
        this.getWXLocation = this.getWXLocation.bind(this)
        this.setWXConfig = this.setWXConfig.bind(this)
        this.shouldComponentUpdate = pureRenderMixin.shouldComponentUpdate.bind(this)
    }
    componentWillMount () {
        document.getElementsByTagName('body')[0].style.background = '#e8e8e8'
    }
    componentDidMount () {
        const startPosition = window.location.href.indexOf('#')
        const url = window.location.href.substring(0, startPosition)
        apis.getConfig(url).then(resp => {
            if (resp.data.code === '000000') {
                this.setWXConfig(resp.data.content) // 设置微信config配置
            }
        }).catch(error => {
            Alerts.show('服务器开小差了 ~ 请稍后重试', this.state.duration)
        })
        window.wx.ready(() => { // weixin ready加载完成以后
            this.getWXLocation() // 调用获取位置接口
        })
    }
    componentWillUnmount () {
        crossrequest.hide()
        apis.cancel()
        Alerts.hide()
    }
    setWXConfig (content) { // 设置微信config配置
        window.wx.config({
            debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来
            appId: content.appId, // 必填，公众号的唯一标识
            timestamp: content.timestamp, // 必填，生成签名的时间戳
            nonceStr: content.nonceStr, // 必填，生成签名的随机串
            signature: content.signature,// 必填，签名，见附录1
            jsApiList: ['openLocation', 'getLocation'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
        })
    }
    getWXLocation () { // 微信获取位置接口 返回经纬度
        window.wx.getLocation({
            type: 'wgs84',
            success: (res) => { // 成功后的回掉函数
                this.setState({
                    hasShowPage: true,
                    longitude: res.longitude,
                    latitude: res.latitude,
                })
                this.getParkingList()
                crossrequest.getCity(res.latitude + ',' + res.longitude).then(resp => {
                    this.setState({cityName: resp.result.addressComponent.city})
                })
            }
        })
    }
    getParkingList (pageNo = 1) { // 获取附近停车场列表
        apis.parkspaceList({
            longitude: this.state.longitude,
            latitude: this.state.latitude,
            pageNo: pageNo,
            pageSize: 5
        }).then(resp => {
            if (resp.data.code === '000000') {
                if (pageNo === 1) {
                    this.setState((prevState, props) => ({
                        pageNo: prevState.pageNo + 1,
                        maxPage: Math.ceil(+resp.data.total  / 5),
                        mapList: resp.data.content
                    }))
                } else {
                    this.setState((prevState, props) => ({
                        pageNo: prevState.pageNo + 1,
                        loadType: prevState.pageNo + 1 > prevState.maxPage ? 'notMore' : 'loadMore',
                        mapList: prevState.mapList.concat(resp.data.content)
                    }))
                }
            }
        }).catch(error => {
            Alerts.show('服务器开小差了 ~ 请稍后重试', this.state.duration)
        })
    }
    emitLoaderMore () { // 上拉翻页触发
        this.setState({loadType: 'isLoading'}, () => {
            this.getParkingList(this.state.pageNo)
        })
    }
    render () {
        return (
            this.state.hasShowPage ? (
                <div
                    className="parkingspace"
                    onTouchStart={() => {this.setState({isTap: true})}}
                    onTouchMove={() => {this.setState({isTap: false})}}
                >
                    <div className="parkingspace-head">当前城市-{this.state.cityName}</div>
                    <div className="parkingspace-content">
                        {
                            this.state.mapList.map((value, index) => (
                                <MapList
                                    key={index}
                                    {...value}
                                    color={index % 2 === 0 ? ['#15bc3b'] : ['#4b84ef']}
                                    isTap={this.state.isTap}
                                />
                            ))
                        }
                    </div>
                    {
                        this.state.maxPage > 1
                        ?
                        <LoadMore
                            loadType={this.state.loadType}
                            requestLoader={this.emitLoaderMore.bind(this)}
                        />
                        : null
                    }
                </div>
            ) : (
                null
            )
        )
    }
}
