import React from 'react'

import getDatetime from './utils/getDatetime'

import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

export default function InformationDate(props) {
	if (props.state.date) {
		return (
			<Row className='row_info_date'>
				<Col xs={12} sm={12} md={6} className='col_info_date'>
					{props.state.date && <p>{getDatetime(Date.parse(props.state.date))}</p>}
				</Col>
			</Row>
		)
	}
	return null
}
