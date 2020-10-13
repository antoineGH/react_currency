import React, { Component } from 'react'
import fetchCurrency from './utils/fetchCurrency'
import InputCurrency from './InputCurrency'
import InputValue from './InputValue'

import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

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

function getDatetime(dt) {

    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

    const date = new Date(dt);

    const today_date = date.getDate()
    const hours = ('0' + date.getHours()).slice(-2);
    const minutes = ('0' + date.getMinutes()).slice(-2);
    const month = (months[date.getMonth()]).substring(0, 3)
    const year = date.getFullYear()

    const formattedTime = `${month}, ${today_date} ${year} ${hours}:${minutes} UTC`

    return formattedTime
}

function InformationDate(props) {
    if (props.state.date) {
        return (
            <Row>
                <Col xs={12} sm={12} md={6}>
                    {props.state.date && <p style={{ marginTop: '-4.5%' }} className='currency_description_details'>{getDatetime(Date.parse(props.state.date))}</p>}
                </Col>
            </Row>
        );
    }
    return null
}

function InformationCurrency(props) {
    if (props.state.listCurrency) {
        return (
            <>
                <Row>
                    <Col xs={12} sm={12} md={6}>
                        <p className='mt-3' style={{ fontSize: '1.5rem' }}>1 {props.state.inputCurrency} equals</p>
                    </Col>
                </Row>
                <Row>
                    <Col xs={12} sm={12} md={6}>
                        <p style={{ fontSize: '3rem', marginTop: '-4%' }}>{toCurrency(1, props.state.outputCurrency, props.state.listCurrency)} {props.state.outputCurrency}</p>
                    </Col>
                </Row>
            </>
        );
    }
    return null
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
            inputCurrency: 'USD',
            outputCurrency: 'EUR',
            date: '',
            inputValue: '',
            outputValue: ''
        }
    }

    componentDidMount() {
        this.setBase('USD')
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
                if (this.state.inputValue && this.state.outputCurrency) {
                    this.setState({ outputValue: toCurrency(this.state.inputValue, this.state.outputCurrency, currencies) })
                }
            })
            .catch(error => {
                console.log(error)
            })
    }

    // CURRENCY INPUT CHANGE
    handleCurrencyInputChange(selectedCurrency) {

        if (selectedCurrency === undefined) {
            this.setState({ inputCurrency: '', outputValue: '' })
        } else {
            this.setState({ inputCurrency: selectedCurrency })
            this.setBase(selectedCurrency)
        }
    }

    // CURRENCY OUTPUT CHANGE
    handleCurrencyOutputChange(selectedCurrency) {

        if (selectedCurrency === undefined) {
            this.setState({ outputCurrency: '', outputValue: '' })
        } else {
            this.setState({ outputCurrency: selectedCurrency })

            if (this.state.inputValue && this.state.inputCurrency) {
                this.setState({ outputValue: toCurrency(this.state.inputValue, selectedCurrency, this.state.listCurrency) })
            }
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
            <Container>
                {/* Conversion One Unit & Information */}
                <InformationCurrency state={this.state} />

                {/* Data Date */}
                <InformationDate state={this.state} />

                {/* Input Value & Currency */}
                <Row>
                    <Col xs={12} sm={12} md={6}>
                        <Row>
                            <Col xs={12} sm={12} md={6}>
                                <InputValue inputValue={this.state.inputValue} onValueChange={this.handleValueInputChange} />
                            </Col>
                            <Col xs={12} sm={12} md={6}>
                                <InputCurrency listCurrency={listCurrency} onCurrencyChange={this.handleCurrencyInputChange} />
                            </Col>
                        </Row>

                        {/* Output Value & Currency */}
                        <Row>
                            <Col xs={12} sm={12} md={6}>
                                <InputValue inputValue={this.state.outputValue} onValueChange={this.handleValueOutputChange} />
                            </Col>
                            <Col xs={12} sm={12} md={6}>
                                <InputCurrency listCurrency={listCurrency} onCurrencyChange={this.handleCurrencyOutputChange} />
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Container>

        )
    }
}
