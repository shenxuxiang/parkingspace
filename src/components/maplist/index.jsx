import './style.css'
import React, { Component } from 'react'
import pureRenderMixin from 'react-addons-pure-render-mixin'
import ReactEchartsCore from 'echarts-for-react/lib/core';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/line';
// import 'echarts/lib/component/tooltip';

export default
class MapList extends Component {
    constructor () {
        super()
        this.state = {

        }
        this.shouldComponentUpdate = pureRenderMixin.shouldComponentUpdate.bind(this)
    }
    componentDidMount () {
    }
    getOption () {
        return {
            title: {
                show: false
            },
            grid: {
                show: false,
                zlevel: 0,
                left: '5px',
                right: '5px',
                top: '10px',
                bottom: '5px',
                containLabel: true,
            },
            series: {
                name:'',
                type:'line', // 图标类型
                stack: '',
                areaStyle: {normal: {}},
                data: this.props.parkSpaceList.length > 0 ? this.props.parkSpaceList.map(item => (item.surplusPercent)) : [] // 数据
            },
            xAxis: {
                type : 'category', // 类型
                boundaryGap : false, // 数据放在中间，不是从坐标轴左侧开始
                data : this.props.parkSpaceList.length > 0 ? this.props.parkSpaceList.map(item => (item.infoTime)) : [],
                name: '', // 坐标轴名称
                axisLine: { // 轴线设置
                    lineStyle: { // 轴线样式设置
                        color: '#ccc', // 颜色
                        width: 1 // 宽度
                    }
                },
                axisTick: { // 坐标轴刻度设置
                    show: false,
                },
                axisLabel: { // 刻度标签设置
                    show: true, // 是否显示
                    interval: 0, // 刻度标签显示方式，0 显示所有， 1 隔一个再显示，2 隔2个在显示
                    inside: false, // 刻度位置朝内还是朝外
                    showMinLabel : false, // 是否显示最小刻度
                    showMaxLabel : false, // 是否显示最大刻度
                    textStyle: { // 刻度标签文字设置
                        align: 'center', // 垂直对齐方式
                        baseline: 'top' // 水平对齐方式
                    }
                },
                splitLine: {
                    show: false // 分割线是否显示
                },
            },
            yAxis: {
                type : 'value', // 类型
                splitNumber: 1, // 预计分为1个刻度
                boundaryGap: false, // 数据放在中间，不是从坐标轴左侧开始
                axisLine: { // 轴线设置
                    lineStyle: {
                        color: '#ccc', // 轴线颜色
                        width: 1 // 轴线宽度
                    }
                },
                axisTick: { // 坐标轴刻度设置
                    show: false
                },
                splitLine: { // 分割线是否显示
                    show: false
                },
                axisLabel: { // 刻度标签
                    formatter: '{value}%', // 单位
                    showMinLabel : false, // 是否显示最小刻度
                    inside: true // 刻度位置朝内还是朝外
                }
            },
            color: this.props.color
        }
    }
    toEnterMap () {
        this.props.isTap &&
        window.wx.openLocation({
            latitude: +this.props.latitude, // 纬度，浮点数，范围为90 ~ -90
            longitude: +this.props.longitude, // 经度，浮点数，范围为180 ~ -180。
            name: this.props.address, // 位置名
            address: this.props.address, // 地址详情说明
            scale: 16, // 地图缩放级别,整形值,范围从1~28。默认为最大
            infoUrl: '' // 在查看位置界面底部显示的超链接,可点击跳转
        })
    }
    render () {
        return (
            <div className="maplist-component">
                <div className="maplist-component-head">
                    <div
                        className="maplist-component-head-name"
                        onTouchEnd={this.toEnterMap.bind(this)}
                    >
                        <span>{this.props.name}</span>
                    </div>

                    <div
                        className="maplist-component-head-parkingspace"
                    >
                        <span
                            className="maplist-component-head-parkingspace-title"
                        >剩余车位</span>
                        <span
                            className="maplist-component-head-parkingspace-num"
                            style={{color: this.props.color}}
                        >{this.props.surplusSpaces}</span>
                    </div>
                    <div className="maplist-component-head-expected">车流量预测</div>
                </div>
                <div className="maplist-component-map">
                    <ReactEchartsCore
                        echarts={echarts}
                        option={this.getOption()}
                        notMerge={true}
                        style={{height: '3.2667rem', width: '100%'}}
                        lazyUpdate={true}
                        theme={"theme_name"}
                    />
                </div>
            </div>
        )
    }
}
