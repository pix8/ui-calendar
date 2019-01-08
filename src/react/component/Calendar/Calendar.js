'use strict';

import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import Month from './Month'
import './calendar.style.scss'

import { 
	StyledCalendar,
	StyledMonth,
	StyledDay
} from './calendar.style'

import CalendarService from '@pix8/calendar'
import Moment from "moment"


const LOOKUP = {
	MONTH: "January,February,March,April,May,June,July,August,September,October,November,December".split(","),
	DAY: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
}

const epoch = new Date().toISOString();

//console.log("-- 1. REACT:CALENDAR component initialised -- ");
/*********************************************************************************************/
export default class Calendar extends Component {

	// static propTypes = {
	// 	epoch: PropTypes.oneOfType([
	// 				PropTypes.string,
	// 				PropTypes.number,
	// 				PropTypes.array,
	// 				PropTypes.instanceOf(Date)
	// 			])
	// }

	// static defaultProps = {
	// 	epoch: new Date()
	// }

	state = {
		source: epoch,
		target: epoch,
		apiCalendar: [],
		everything: []
	}

	constructor() {
		super();

		this.calendar = new CalendarService();
	}

	getCalendarData(value) {
		this.calendar.getYear(value)
			.then( (data) => {
				this.setState({
					source: value,
					apiCalendar: data[ Moment(value).format("Y") ],
					everything: data
				});
			})
	}

	incrementYear(event) {
		const { source } = this.state;

		let value = Moment(this.state.source).add(1, "years").toDate().toISOString();

		this.getCalendarData(value);
		
	}

	decrementYear = (event) => {
		const { source } = this.state;

		let value = Moment(this.state.source).subtract(1, "years").toDate().toISOString();

		this.getCalendarData(value);
	}

	setTarget(year, month, day, event) {
		event.preventDefault();

		let target = [year, month, day];
		//console.log("you clicked :: ", event.target, " :: ", `${year} / ${month} / ${day}`);

		this.setState({
			target
		});
	}

	componentWillMount() {
		this.getCalendarData(this.state.source);
	}

	render() {
		return (
			<React.Fragment>
				{/*<h3 style={ {width: '100%'} }>{ this.state.apiCalendar }</h3>*/}
				

				{ this.state.apiCalendar.length === 0 && <p>No calendar data</p> }

				<nav className="navbar navbar-default" style={ {border:'none', borderRadius:'0', background:'whitesmoke'} }>
					<button className="btn btn-sm btn-primary navbar-btn" onClick={ this.decrementYear } style={ {display:'inline-block'} }>&lt;</button>
					<h2 className="navbar-brand" style={ {display: 'inline-block', margin: '0 20px'} }>
						React Calendar 
						<span>{ this.state.everything.indexOf(this.state.apiCalendar) }</span>
					</h2>
					<button className="btn btn-sm btn-primary navbar-btn" onClick={ this.incrementYear.bind(this) } style={ {display:'inline-block'} }>&gt;</button>
					<p className="navbar-brand" style={ {float:'right', margin: '0 20px'} }>Target date: { Moment(this.state.target).format("dddd, Do MMM Y") }</p>
				</nav>
				
				<StyledCalendar className="calendar">
					{
						this.state.apiCalendar.map((month, i, arr) => {

							return (
								<StyledMonth className="calendar__month" key={ i }>
									<dt>{ LOOKUP.MONTH[i] }</dt>

									<dd>
										<ol className="list-unstyled">
											{
												month.map((week, j, arr) => {

													if(week.length < 7) {

														if(week[0] > 0) {
															return (
																[...Array(7-week.length).fill(null)].concat(week).map( (day, k, arr) => {
																	return (
																		<li className="calendar__date" key={ [this.state.everything.indexOf(this.state.apiCalendar), (i+1), (j+1), k+1].join('-') }>
																			{
																				(day !== null) ?
																					<a href="" onClick={ this.setTarget.bind(this, this.state.everything.indexOf(this.state.apiCalendar), i, (k+1)+(j*7)-(7-month[0].length)) }>
																						<span className="data__day">{ LOOKUP.DAY[day].slice(0,3) }</span>
																						<span className="data__date">{ (k+1)+(j*7)-(7-month[0].length) }</span>
																					</a> : null
																			}
																		</li>
																	)
																})
															)
														}
														return (
															week.concat([...Array(7-week.length).fill(null)]).map( (day, k, arr) => {
																return (
																	<li className="calendar__date" key={ [this.state.everything.indexOf(this.state.apiCalendar), (i+1), (j+1), k+1].join('-') }>
																		{
																			(day !== null) ?
																			<a href="" onClick={ this.setTarget.bind(this, this.state.everything.indexOf(this.state.apiCalendar), i, (k+1)+(j*7)-(7-month[0].length)) }>
																				<span className="data__day">{ LOOKUP.DAY[day].slice(0,3) }</span>
																				<span className="data__date">{ (k+1)+(j*7)-(7-month[0].length) }</span>
																			</a> : null
																		}
																	</li>
																)
															})
														)
													}
													return (
														week.map( (day, k, arr) => {
															return (
																<li className="calendar__date" key={ [this.state.everything.indexOf(this.state.apiCalendar), (i+1), (j+1), k+1].join('-') }>
																	<a href="" onClick={ this.setTarget.bind(this, this.state.everything.indexOf(this.state.apiCalendar), i, (k+1)+(j*7)-(7-month[0].length)) }>
																		<span className="data__day">{ LOOKUP.DAY[day].slice(0,3) }</span>
																		<span className="data__date">{ (k+1)+(j*7)-(7-month[0].length) }</span>
																	</a>
																</li>
															)
														})
													)
												})
											}
										</ol>
									</dd>
								</StyledMonth>
							)
						})
					}
				</StyledCalendar>
			</React.Fragment>
		)
	}
}
