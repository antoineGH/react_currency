import React, { Component } from 'react'
import fetchCurrency from './utils/fetchCurrency'
import InputCurrency from './InputCurrency'
import InputValue from './InputValue'

function getRate(outputCurrency, listCurrency) {
    let rate = ''
    listCurrency.forEach(currency => {
        if (currency.value === outputCurrency)
            rate = currency.rate

    })
    return rate
}

function toCurrency(inputValue, outputCurrency, listCurrency) {

    inputValue = parseFloat(inputValue);
    if (Number.isNaN(inputValue)) {
        return '';
    }

    const rate = getRate(outputCurrency, listCurrency);
    const output = inputValue * rate
    const rounded = Math.round(output * 10000) / 10000;
    return rounded.toString();
}

function fromCurrency(outputValue, outputCurrency, listCurrency) {

    outputValue = parseFloat(outputValue);
    if (Number.isNaN(outputValue)) {
        return '';
    }
    const rate = getRate(outputCurrency, listCurrency);
    const output = outputValue / rate
    const rounded = Math.round(output * 1000) / 1000;
    return rounded.toString();
}

export default class Currency extends Component {

    constructor(props) {
        super(props);
        this.handleCurrencyInputChange = this.handleCurrencyInputChange.bind(this);
        this.handleCurrencyOutputChange = this.handleCurrencyOutputChange.bind(this);
        this.handleValueInputChange = this.handleValueInputChange.bind(this);
        this.handleValueOutputChange = this.handleValueOutputChange.bind(this);
        this.state = {
            listCurrency: '',
            inputCurrency: '',
            outputCurrency: '',
            date: '',
            inputValue: '',
            outputValue: ''
        }
    }

    componentDidMount() {
        fetchCurrency('CNY')
            .then(response => {
                const currencies = []
                this.setState({ date: response.date })
                for (const [prop, value] of Object.entries(response.rates)) {
                    currencies.push({ value: prop, label: prop, rate: value })
                }
                this.setState({ listCurrency: currencies })
            })
            .catch(error => {
                console.log(error)
            })
    }

    setBase(selectedCurrency) {
        fetchCurrency(selectedCurrency)
            .then(response => {
                this.setState({ date: response.date })
                const currencies = []
                for (const [prop, value] of Object.entries(response.rates)) {
                    currencies.push({ value: prop, label: prop, rate: value })
                }
                this.setState({ listCurrency: currencies })
            })
            .catch(error => {
                console.log(error)
            })
    }

    // CURRENCY INPUT CHANGE
    handleCurrencyInputChange(selectedCurrency) {

        this.setState({ inputCurrency: selectedCurrency })
        this.setBase(selectedCurrency)

        setTimeout(() => {
            const listCurrency = this.state.listCurrency

            if (this.state.inputValue && this.state.outputCurrency) {
                this.setState({ outputValue: toCurrency(this.state.inputValue, this.state.outputCurrency, listCurrency) })
            }
        }, 500)
    }

    // CURRENCY OUTPUT CHANGE
    handleCurrencyOutputChange(selectedCurrency) {

        this.setState({ outputCurrency: selectedCurrency })

        if (this.state.inputValue && this.state.inputCurrency) {
            this.setState({ outputValue: toCurrency(this.state.inputValue, selectedCurrency, this.state.listCurrency) })
        }
    }

    // VALUE INPUT CHANGE
    handleValueInputChange(value) {

        this.setState({ inputValue: value })

        if (this.state.inputCurrency && this.state.outputCurrency) {
            this.setState({ outputValue: toCurrency(value, this.state.outputCurrency, this.state.listCurrency) })
        }
    }

    // VALUE OUTPUT CHANGE
    handleValueOutputChange(value) {

        this.setState({ outputValue: value })

        if (this.state.inputCurrency && this.state.outputCurrency) {
            this.setState({ inputValue: fromCurrency(value, this.state.outputCurrency, this.state.listCurrency) })
        }
    }

    render() {
        const listCurrency = this.state.listCurrency;


        return (
            <div>
                <InputValue inputValue={this.state.inputValue} onValueChange={this.handleValueInputChange} />
                <InputCurrency listCurrency={listCurrency} onCurrencyChange={this.handleCurrencyInputChange} />
                <InputValue inputValue={this.state.outputValue} onValueChange={this.handleValueOutputChange} />
                <InputCurrency listCurrency={listCurrency} onCurrencyChange={this.handleCurrencyOutputChange} />
            </div>
        )
    }
}
