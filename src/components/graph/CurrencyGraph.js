import React, { Component } from 'react'

import LineGraph from "./LineGraph";

import Card from 'react-bootstrap/Card'
import classes from "./CurrencyGraph.module.css";

export default class CurrencyGraph extends Component {

    constructor(props) {
        super(props);
        this.state = {
            graphValues: null,
            graphLegend: null,
            graphTitle: {},
            style : {}
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

    render() {

        const { graphValues, graphLegend, graphTitle, style } = this.state;

        return (
            <Card className='card_graph_currency' style={{ padding: '20px' }}>
                <div className={classes.container}>
                    <LineGraph graphValues={graphValues} graphLegend={graphLegend} graphTitle={graphTitle} style={style} />
                </div>
            </Card>
        )
    }
}
