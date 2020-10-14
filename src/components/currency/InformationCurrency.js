import React from 'react'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import toCurrency from './utils/toCurrency'

export default function InformationCurrency(props) {
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