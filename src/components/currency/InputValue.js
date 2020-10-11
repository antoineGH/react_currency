import React, { Component } from 'react'

export default class InputValue extends Component {

    constructor(props){
        super(props)
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        this.props.onValueChange(event.target.value)
    }

    render() {
        const value = this.props.inputValue

        return (
            <input value={value} onChange={this.handleChange} />
        )
    }
}
