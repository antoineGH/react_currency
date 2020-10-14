import React, { Component } from 'react'
import fetchCurrency from './utils/fetchCurrency'
import InputCurrency from './InputCurrency'
import InputValue from './InputValue'
import InformationCurrency from './InformationCurrency'
import InformationDate from './InformationDate'

import toCurrency from './utils/toCurrency'
import fromCurrency from './utils/fromCurrency'
import { currenciesName } from './utils/currenciesName'

import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

export default class Currency extends Component {

    // --- CLASS CONSTRUCTOR ---

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
            inputValue: '1',
            outputValue: '',
            values: []
        }
    }

    // --- COMPONENT LIFECYCLE ---

    componentDidMount() {
        this.setBase('USD')
    }

    // --- CLASS METHODS --- 

    // Set base
    setBase(selectedCurrency) {
        fetchCurrency(selectedCurrency)
            .then(response => {
                this.setState({ date: response.date })
                const currencies = []
                for (const [prop, value] of Object.entries(response.rates)) {
                    const currencyName = '(' + currenciesName[prop] + ')'
                    currencies.push({
                        value: prop,
                        label: `${prop} ${currencyName}`,
                        rate: value
                    })
                }
                console.log(currenciesName)
                this.setState({ listCurrency: currencies })
                this.setState({ values: currencies[0] })
                if (this.state.inputValue && this.state.outputCurrency) {
                    this.setState({ outputValue: toCurrency(this.state.inputValue, this.state.outputCurrency, currencies) })
                }
            })
            .catch(error => {
                console.log(error)
            })
    }

    // Currency input change
    handleCurrencyInputChange(selectedCurrency) {

        if (selectedCurrency === undefined) {
            this.setState({ inputCurrency: '', outputValue: '' })
        } else {
            this.setState({ inputCurrency: selectedCurrency })
            this.setBase(selectedCurrency)
        }
    }

    // Currency output change
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

    // Value input change
    handleValueInputChange(value) {

        this.setState({ inputValue: value })

        if (this.state.inputCurrency && this.state.outputCurrency) {
            this.setState({ outputValue: toCurrency(value, this.state.outputCurrency, this.state.listCurrency) })
        }
    }

    // Value output change
    handleValueOutputChange(value) {

        this.setState({ outputValue: value })

        if (this.state.inputCurrency && this.state.outputCurrency) {
            this.setState({ inputValue: fromCurrency(value, this.state.outputCurrency, this.state.listCurrency) })
        }
    }

    // --- RENDER ---
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
                    <Col xs={12} sm={12} md={12} lg={8}>
                        <Row>
                            <Col xs={12} sm={3} md={3} lg={3} className='inputValue my-auto'>
                                <InputValue inputValue={this.state.inputValue} onValueChange={this.handleValueInputChange} />
                            </Col>
                            <Col xs={12} sm={9} md={8} lg={8} className='inputCurrency mt-2 mt-sm-0' >
                                <InputCurrency listCurrency={listCurrency} onCurrencyChange={this.handleCurrencyInputChange} options={{ value: "USD", label: "USD" }} />
                            </Col>
                        </Row>

                        {/* Output Value & Currency */}
                        <Row className='mt-sm-3'>
                            <Col xs={12} sm={3} md={3} lg={3} className='mt-4 mt-sm-0 my-auto inputValue'>
                                <InputValue inputValue={this.state.outputValue} onValueChange={this.handleValueOutputChange} />
                            </Col>
                            <Col xs={12} sm={9} md={8} lg={8} className='inputCurrency mt-2 mt-sm-0'>
                                <InputCurrency listCurrency={listCurrency} onCurrencyChange={this.handleCurrencyOutputChange} options={{ value: "EUR", label: "EUR" }} />
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Container>

        )
    }
}
