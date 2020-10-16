import React, { Component } from 'react'

import InputCurrency from './InputCurrency'
import InputValue from './InputValue'
import InformationCurrency from './InformationCurrency'
import InformationDate from './InformationDate'
import CurrencyGraph from '../graph/CurrencyGraph'

import { trackPromise } from 'react-promise-tracker'
import LoadingSpinner from '../loading/LoadingSpinner'

import fetchCurrency from './utils/fetchCurrency'
import toCurrency from './utils/toCurrency'
import fromCurrency from './utils/fromCurrency'
import { currenciesName } from './utils/currenciesName'
import sortDate from './utils/sortDate'
import genValues from './utils/genValues'
import getDate from './utils/getDate'
import getDateBefore from './utils/getDateBefore'

import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import fetchHistoryCurrency from './utils/fetchHistoryCurrency'

export default class Currency extends Component {

    // --- CLASS CONSTRUCTOR ---

    constructor(props) {
        super(props);
        this.handleCurrencyInputChange = this.handleCurrencyInputChange.bind(this);
        this.handleCurrencyOutputChange = this.handleCurrencyOutputChange.bind(this);
        this.handleValueInputChange = this.handleValueInputChange.bind(this);
        this.handleValueOutputChange = this.handleValueOutputChange.bind(this);
        this.getGraphInfo = this.getGraphInfo.bind(this);
        this.setActive = this.setActive.bind(this);
        this.state = {
            isLoaded: false,
            hasError: false,

            isHistoryLoaded: false,
            hasHistoryError: false,

            listCurrency: '',
            inputCurrency: 'USD',
            outputCurrency: 'EUR',
            date: '',
            inputValue: '1',
            outputValue: '',

            active: 'month',
            graphLegend: {},
            graphValues: {},
            graphTitle: {}
        }
    }

    // --- COMPONENT LIFECYCLE ---

    componentDidMount() {
        trackPromise(
            fetchCurrency('USD')
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
                    this.setState({ listCurrency: currencies, isLoaded: true, hasError: false })
                    if (this.state.inputValue && this.state.outputCurrency) {
                        this.setState({ outputValue: toCurrency(this.state.inputValue, this.state.outputCurrency, currencies) })
                    }
                })
                .catch(error => {
                    console.log(error)
                    this.setState({ hasError: true })
                })
        );

        const date = new Date(Date.now())
        const start_date = getDate(date)
        const end_date = getDateBefore(date, 1, 'months')
        this.getGraphInfo(end_date, start_date, 'USD', 'EUR')
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
                this.setState({ listCurrency: currencies, isLoaded: true, hasError: false })
                if (this.state.inputValue && this.state.outputCurrency) {
                    this.setState({ outputValue: toCurrency(this.state.inputValue, this.state.outputCurrency, currencies) })
                }
            })
            .catch(error => {
                console.log(error)
                this.setState({ hasError: true })
            })
    }

    // Get Graph Info
    getGraphInfo(startDate, endDate, baseCurrency, destCurrency) {
        fetchHistoryCurrency(startDate, endDate, baseCurrency, destCurrency)
            .then(response => {
                const graphTitle = { base: baseCurrency, dest: destCurrency, start_at: startDate, end_at: endDate }

                // Sort Object of objects with Date as a key
                const orderedDates = sortDate(response)

                // Generate Arrays for Rates Values and Date.
                const { graphLegend, graphValues } = genValues(orderedDates, destCurrency)
                // Update State                
                this.setState({ graphLegend: graphLegend, graphValues: graphValues, graphTitle: graphTitle, isHistoryLoaded: true })
            })
            .catch(error => {
                console.log(error)
                this.setState({ hasHistoryError: true })
            })
    }

    // Currency input change
    handleCurrencyInputChange(selectedCurrency) {

        if (selectedCurrency === undefined) {
            this.setState({ inputCurrency: '', outputValue: '' })
        } else {
            this.setState({ inputCurrency: selectedCurrency })
            this.setBase(selectedCurrency)

            // Updating History 
            const date = new Date(Date.now())
            const start_date = getDate(date)
            const end_date = getDateBefore(date, 1, 'months')
            this.getGraphInfo(end_date, start_date, selectedCurrency, this.state.outputCurrency)
            setTimeout(() => {
                this.setState({ active: 'month' })
            }, 500)
        }
    }

    // Currency output change
    handleCurrencyOutputChange(selectedCurrency) {

        if (selectedCurrency === undefined) {
            this.setState({ outputCurrency: '', outputValue: '' })
        } else {
            this.setState({ outputCurrency: selectedCurrency })

            // Updating History 
            const date = new Date(Date.now())
            const start_date = getDate(date)
            const end_date = getDateBefore(date, 1, 'months')
            this.getGraphInfo(end_date, start_date, this.state.inputCurrency, selectedCurrency)
            setTimeout(() => {
                this.setState({ active: 'month' })
            }, 500)

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

    // Handle Active
    setActive(active) {
        this.setState({ active: active })
    }

    // --- RENDER ---
    render() {
        const listCurrency = this.state.listCurrency;

        if (this.state.hasError) {
            return (
                <Container>
                    <div className='error_data'>Impossible to fetch data, try again later.</div>
                </Container>
            );
        }

        return (
            <Container>
                <LoadingSpinner />
                {this.state.inputCurrency && this.state.outputCurrency
                    ? <><InformationCurrency state={this.state} /><InformationDate state={this.state} /></>
                    : <div className='select_currency'>
                        <p>Please select currency.</p>
                    </div>
                }

                {/* Input Value & Currency */}
                <Row>
                    <Col xs={12} sm={12} md={12} lg={8}>
                        <Row>
                            <Col xs={12} sm={3} md={3} lg={3} className='inputValue my-auto'>
                                <InputValue inputValue={this.state.inputValue} onValueChange={this.handleValueInputChange} />
                            </Col>
                            <Col xs={12} sm={9} md={8} lg={8} className='inputCurrency mt-2 mt-sm-0' >
                                <InputCurrency listCurrency={listCurrency} onCurrencyChange={this.handleCurrencyInputChange} options={{ value: "USD", label: "USD (United States Dollar)" }} />
                            </Col>
                        </Row>

                        {/* Output Value & Currency */}
                        <Row className='mt-sm-3'>
                            <Col xs={12} sm={3} md={3} lg={3} className='mt-4 mt-sm-0 my-auto inputValue'>
                                <InputValue inputValue={this.state.outputValue} onValueChange={this.handleValueOutputChange} />
                            </Col>
                            <Col xs={12} sm={9} md={8} lg={8} className='inputCurrency mt-2 mt-sm-0'>
                                <InputCurrency listCurrency={listCurrency} onCurrencyChange={this.handleCurrencyOutputChange} options={{ value: "EUR", label: "EUR (Euro)" }} />
                            </Col>
                        </Row>

                        {/* Display Graph */}
                        <Row className='justify-content-center text-center mt-2 mt-md-5'>
                            <Col>
                                {this.state.inputCurrency && this.state.outputCurrency && this.state.isHistoryLoaded && <CurrencyGraph graphValues={this.state.graphValues} graphLegend={this.state.graphLegend} graphTitle={this.state.graphTitle} getGraphInfo={this.getGraphInfo} active={this.state.active} setActive={this.setActive} />}
                            </Col>
                        </Row>
                    </Col>
                </Row>

            </Container>

        )
    }
}

