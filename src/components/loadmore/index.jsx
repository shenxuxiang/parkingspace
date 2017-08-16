import './style.css'
import React, { Component } from 'react'
import pureRenderMixin from 'react-addons-pure-render-mixin'

export default
class LoadMore extends Component {
    constructor () {
        super()
        this.state = {

        }
        this.handleScroll = this.handleScroll.bind(this)
        this.shouldComponentUpdate = pureRenderMixin.shouldComponentUpdate.bind(this)
    }
    componentDidMount () { // 监听scroll事件
        document.addEventListener('scroll', this.handleScroll, false)
    }
    componentWillUnmount() { // 撤销组件时取消监听
        document.removeEventListener('scroll', this.handleScroll, false)
    }
    handleScroll (event) { // 定义scroll方法
        if(!this.refs.loadmore) {
            return
        }
        this.refs.loadmore.getBoundingClientRect().top <=
        document.documentElement.clientHeight + 40 && this.props.requestLoader()
    }
    render () {
        const typeList = (type) => {
            switch (type) {
                case 'loadMore':
                    return (
                        <div className="loadmore" ref="loadmore">
                            上拉加载更多。。。
                        </div>
                    )
                case 'isLoading':
                    return (
                        <div className="isloading">
                            <span>拼命加载中</span>
                            <span className="isloading-circle isloading-item1"></span>
                            <span className="isloading-circle isloading-item2"></span>
                            <span className="isloading-circle isloading-item3"></span>
                        </div>
                    )
                case 'notMore':
                    return (
                        <div className="notmore">
                            别拖拉！没有更多了。。。
                        </div>
                    )
                default:
                    return null;
            }
        }
        return typeList(this.props.loadType)
    }
}

