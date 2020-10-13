import React, { Component } from 'react'
import Select from "react-dropdown-select";

export default class InputCurrency extends Component {

    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(selected) {
        if (selected[0] === undefined) {
            this.props.onCurrencyChange(undefined)
        } else {
            const selectedCurrency = selected[0].value
            this.props.onCurrencyChange(selectedCurrency)
        }
    }

    render() {

        const listCurrency = this.props.listCurrency

        return (
            <Select
                options={listCurrency}
                values={[]}
                onChange={(selected) => this.handleChange(selected)}
                keepSelectedInList={true}
                dropdownHandle={true}
                closeOnSelect={true}
                clearable={true}
            />
        )
    }
}
