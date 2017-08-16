import './style.css'
import React, { Component } from 'react'
import pureRenderMixin from 'react-addons-pure-render-mixin'

export default
class PayComponent extends Component {
    constructor () {
        super ()
        this.state = {

        }
        this.shouldComponentUpdate = pureRenderMixin.shouldComponentUpdate.bind(this)
    }
    render () {
        return (
            <div className="pay-component">
                <div className="pay-component-head">
                    <span className="pay-component-ok"></span>
                </div>
                <div className="pay-component-container">
                    支付成功
                </div>

            </div>
        )
    }
}
