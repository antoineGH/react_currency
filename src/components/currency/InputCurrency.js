import React, { Component } from 'react'
import Select from "react-dropdown-select";

export default class InputCurrency extends Component {

    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(selectedCurrency) {
        this.props.onCurrencyChange(selectedCurrency)
    }

    render() {

        const listCurrency = this.props.listCurrency

        return (
            <Select
                options={listCurrency}
                values={[]}
                onChange={(selected) => this.handleChange(selected[0].value) }
            />
        )
    }
}
