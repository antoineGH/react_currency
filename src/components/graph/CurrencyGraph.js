import React, { Component } from 'react'

import LineGraph from "./LineGraph";

import getDate from '../currency/utils/getDate'
import getDateBefore from '../currency/utils/getDateBefore'

import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card'
import ListGroup from 'react-bootstrap/ListGroup';

import classes from "./CurrencyGraph.module.css";

export default class CurrencyGraph extends Component {

    constructor(props) {
        super(props);
        this.getMonth = this.getMonth.bind(this);
        this.getWeek = this.getWeek.bind(this);
        this.getFiveDays = this.getFiveDays.bind(this);
        this.state = {
            style: {},
            active: '1 Month'
        };
    }

    componentDidMount() {
        this.createMockData()
    }

    createMockData() {
        const { graphValues, graphLegend, graphTitle } = this.props;

        const currency_style = {
            borderColor: 'rgb(255, 93, 93)',
            backgroundColor: 'rgba(255, 10, 13, 0.1)',
            pointRadius: 6,
            pointBackgroundColor: 'rgb(255, 93, 93)',
            pointHoverRadius: 8,
            pointHoverBackgroundColor: 'rgb(255, 93, 93)'
        }

        this.setState({ graphValues: graphValues, graphLegend: graphLegend, graphTitle: graphTitle, style: currency_style })
    }

    // SET REAL DATE DELTA
    getMonth() {
        const date = new Date(Date.now())
        const start_date = getDate(date)
        const end_date = getDateBefore(date, 1, 'months')
        this.props.getGraphInfo(end_date, start_date, this.state.graphTitle.base, this.state.graphTitle.dest )
    }

    getWeek() {
        const date = new Date(Date.now())
        const start_date = getDate(date)
        const end_date = getDateBefore(date, 9, 'days')
        this.props.getGraphInfo(end_date, start_date, this.state.graphTitle.base, this.state.graphTitle.dest )
    }

    getFiveDays() {
        const date = new Date(Date.now())
        const start_date = getDate(date)
        const end_date = getDateBefore(date, 7, 'days')
        this.props.getGraphInfo(end_date, start_date, this.state.graphTitle.base, this.state.graphTitle.dest )
    }


    render() {

        const { graphValues, graphLegend, graphTitle } = this.props;
        const style = this.state.style

        return (
            <>
            <ListGroup horizontal>
                    <Row className="justify-content-center mt-3 mb-2">
                        <Col xs={11} md={'auto'} style={{paddingLeft: '0px', paddingRight: '0px'}} className='ml-xs-0 ml-md-3'>
                            <ListGroup.Item className={this.state.active === 'Temperatures' && 'active'} action onClick={this.getMonth}>1 Month</ListGroup.Item>
                        </Col>
                        <Col xs={11} md={'auto'} style={{paddingLeft: '0px', paddingRight: '0px'}}>
                            <ListGroup.Item className={this.state.active === 'Humidity' && 'active'} action onClick={this.getWeek}>7 Days</ListGroup.Item>
                        </Col>
                        <Col xs={11} md={'auto'} style={{paddingLeft: '0px', paddingRight: '0px'}}>
                            <ListGroup.Item className={this.state.active === 'Wind Speed' && 'active'} action onClick={this.getFiveDays}>5 Days</ListGroup.Item>
                        </Col>
                    </Row>
                </ListGroup>

            <Card className='card_graph_currency'>
                <div className={classes.container}>
                    <LineGraph graphValues={graphValues} graphLegend={graphLegend} graphTitle={graphTitle} style={style} />
                </div>
            </Card>
            </>
        )
    }
}
