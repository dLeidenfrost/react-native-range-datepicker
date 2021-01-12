'use strict'
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Text,
  View,
  FlatList,
  StyleSheet,
  Button,
} from 'react-native';
import Month from './Month';
// import styles from './styles';
import moment from 'moment';

export default class RangeDatepicker extends Component {
	constructor(props) {
		super(props);
		this.state = {
			startDate: props.startDate && moment(props.startDate, 'YYYYMMDD'),
			untilDate: props.untilDate && moment(props.untilDate, 'YYYYMMDD'),
			availableDates: props.availableDates || null
		}

		this.onSelectDate = this.onSelectDate.bind(this);
		this.onReset = this.onReset.bind(this);
		this.handleConfirmDate = this.handleConfirmDate.bind(this);
		this.handleRenderRow = this.handleRenderRow.bind(this);
	}

	static defaultProps = {
		initialMonth: '',
		dayHeadings: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
		maxMonth: 12,
		buttonColor: 'green',
		buttonContainerStyle: {},
    confirmButtonTitle: 'Select date',
		showReset: true,
		showClose: true,
		ignoreMinDate: false,
    isHistorical: false,
		onClose: () => {},
		onSelect: () => {},
		onConfirm: () => {},
		placeHolderStart: 'Start Date',
		placeHolderUntil: 'Until Date',
    headerBackgroundColor: 'green',
    closeIcon: null,
		selectedBackgroundColor: 'green',
    startDateBackgroundColor: 'green',
    endDateBackgroundColor: 'green',
    betweenBackgroundColor: 'green',
    headerTitle: '',
    iconPath: '',
		selectedTextColor: 'white',
		todayColor: 'green',
		startDate: '',
		untilDate: '',
		minDate: '',
		maxDate: '',
		infoText: '',
		infoStyle: {color: '#fff', fontSize: 13},
		infoContainerStyle: {marginRight: 20, paddingHorizontal: 20, paddingVertical: 5, backgroundColor: 'green', borderRadius: 20, alignSelf: 'flex-end'},
		showSelectionInfo: true,
		showButton: true,
    confirmButtonTextStyle: { color: 'white' },
	};

	componentWillReceiveProps(nextProps) {
		this.setState({availableDates: nextProps.availableDates});
	}

	onSelectDate(date){
		let startDate = null;
		let untilDate = null;
		const { availableDates } = this.state;

		if(this.state.startDate && !this.state.untilDate)
		{
			if(date.format('YYYYMMDD') < this.state.startDate.format('YYYYMMDD') || this.isInvalidRange(date)){
				startDate = date;
			}
			else if(date.format('YYYYMMDD') > this.state.startDate.format('YYYYMMDD')){
				startDate = this.state.startDate;
				untilDate = date;
			}
			else{
				startDate = null;
				untilDate = null;
			}
		}
		else if(!this.isInvalidRange(date)) {
			startDate = date;
		}
		else {
			startDate = null;
			untilDate = null;
		}

		this.setState({startDate, untilDate});
		this.props.onSelect(startDate, untilDate);
	}

	isInvalidRange(date) {
		const { startDate, untilDate, availableDates } = this.state;

		if(availableDates && availableDates.length > 0){
			//select endDate condition
			if(startDate && !untilDate) {
				for(let i = startDate.format('YYYYMMDD'); i <= date.format('YYYYMMDD'); i = moment(i, 'YYYYMMDD').add(1, 'days').format('YYYYMMDD')){
					if(availableDates.indexOf(i) == -1 && startDate.format('YYYYMMDD') != i)
						return true;
				}
			}
			//select startDate condition
			else if(availableDates.indexOf(date.format('YYYYMMDD')) == -1)
				return true;
		}

		return false;
	}

	getMonthStack(){
		let res = [];
		const { maxMonth, initialMonth, isHistorical } = this.props;
		let initMonth = moment();
		if(initialMonth && initialMonth != '')
			initMonth = moment(initialMonth, 'YYYYMM');

		for(let i = 0; i < maxMonth; i++){
			res.push(
        !isHistorical ? (
          initMonth.clone().add(i, 'month').format('YYYYMM')
        ) : (
          initMonth.clone().subtract(i, 'month').format('YYYYMM')
        )
      );
		}

		return res;
	}

	onReset(){
		this.setState({
			startDate: null,
			untilDate: null,
		});

		this.props.onSelect(null, null);
	}

	handleConfirmDate(){
		this.props.onConfirm && this.props.onConfirm(this.state.startDate,this.state.untilDate);
	}

	handleRenderRow(month, index) {
		const {
      selectedBackgroundColor,
      startDateBackgroundColor,
      endDateBackgroundColor,
      betweenBackgroundColor,
      selectedTextColor,
      todayColor,
      ignoreMinDate,
      minDate,
      maxDate,
      monthTitleStyle,
    } = this.props;
		let { availableDates, startDate, untilDate } = this.state;

		if(availableDates && availableDates.length > 0){
			availableDates = availableDates.filter(function(d){
				if(d.indexOf(month) >= 0)
					return true;
			});
		}

		return (
			<Month
				onSelectDate={this.onSelectDate}
				startDate={startDate}
				untilDate={untilDate}
				availableDates={availableDates}
				minDate={minDate ? moment(minDate, 'YYYYMMDD') : minDate}
				maxDate={maxDate ? moment(maxDate, 'YYYYMMDD') : maxDate}
				ignoreMinDate={ignoreMinDate}
				dayProps={{
          selectedBackgroundColor,
          startDateBackgroundColor,
          endDateBackgroundColor,
          betweenBackgroundColor,
          selectedTextColor,
          todayColor,
        }}
				month={month}
        monthTitleStyle={monthTitleStyle}
      />
		)
	}

	render(){
      const {flatlistProps} = this.props;
			return (
				<View style={{backgroundColor: '#fff', zIndex: 1000, alignSelf: 'center', width: '100%', flex: 1}}>
					{
						this.props.showClose || this.props.showReset ?
							(<View style={{ flexDirection: 'row', justifyContent: "space-between", padding: 20, paddingBottom: 10}}>
								{
									this.props.showClose && <Text style={{fontSize: 20}} onPress={this.props.onClose}>Close</Text>
								}
								{
									this.props.showReset && <Text style={{fontSize: 20}} onPress={this.onReset}>Reset</Text>
								}
							</View>)
							:
							null
					}
					{
						this.props.showSelectionInfo ? 
						(
						<View style={{ flexDirection: 'row', justifyContent: "space-between", paddingHorizontal: 20, paddingBottom: 5, alignItems: 'center'}}>
							<View style={{flex: 1}}>
								<Text style={{fontSize: 34, color: '#666'}}>
									{ this.state.startDate ? moment(this.state.startDate).format("MMM DD YYYY") : this.props.placeHolderStart}
								</Text>
							</View>

							<View style={{}}>
								<Text style={{fontSize: 80}}>
									/
								</Text>
							</View>

							<View style={{flex: 1}}>
								<Text style={{fontSize: 34, color: '#666', textAlign: 'right'}}>
									{ this.state.untilDate ? moment(this.state.untilDate).format("MMM DD YYYY") : this.props.placeHolderUntil}
								</Text>
							</View>
						</View>
						) : null
					}
					
					{
						this.props.infoText != "" &&
						<View style={this.props.infoContainerStyle}>
							<Text style={this.props.infoStyle}>{this.props.infoText}</Text>
						</View>
					}
          <View style={{ backgroundColor: this.props.headerBackgroundColor }}>
            <View style={{ flexDirection: 'row', paddingVertical: 24, justifyContent: 'center' }}>
              <Image
                style={{ width: 50, height: 50, resizeMode: 'contain' }}
                source={this.props.iconPath}
              />
              <TouchableOpacity onPress={this.onClose} style={{ position: 'absolute', right: 0, padding: 24 }}>
                {this.props.closeIcon || <Text>Close</Text>}
              </TouchableOpacity>
            </View>
            <Text style={{ fontSize: 16, alignSelf: 'center', color: 'white' }}>{this.props.headerTitle}</Text>
            <View style={styles.dayHeader}>
              {
                this.props.dayHeadings.map((day, i) => {
                  return (<Text style={{width: "14.28%", textAlign: 'center', color: 'white'}} key={i}>{day}</Text>)
                })
              }
            </View>
          </View>
					<FlatList
						style={{ flex: 1 }}
			            data={this.getMonthStack()}
			            renderItem={ ({item, index}) => { 
							return this.handleRenderRow(item, index)
						}}
						keyExtractor = { (item, index) => index.toString() }
            showsVerticalScrollIndicator={false}
            {...flatlistProps}
					/>

					{
						this.props.showButton ? 
						(
						<TouchableOpacity
              onPress={this.handleConfirmDate}
              style={[styles.buttonWrapper, this.props.buttonContainerStyle, { backgroundColor: this.props.buttonColor }]}
            >
              <Text style={this.props.confirmButtonTextStyle}>
                {this.props.confirmButtonTitle}
              </Text>
						</TouchableOpacity>
						) : null
					}	
				</View>
			)
	}
}

const styles = StyleSheet.create({
	dayHeader : {
		flexDirection: 'row',
		paddingBottom: 10,
		paddingTop: 10,
	},
	buttonWrapper : {
		paddingVertical: 10,
		paddingHorizontal: 15,
		backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'center',
    elevation: 5,
	},
});
