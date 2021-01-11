import React, {useCallback, useEffect, useState} from 'react';
import {Button, FlatList, Text, View} from 'react-native';
import moment from 'moment';
import Month from './newMonth';
import styles from './styles';

const RangeDatepicker = (props: any) => {
  const {
    availableDatesProp,
    onSelect,
    onConfirm,
    maxMonth,
    initialMonth,
    isHistorical,
    showClose,
    showReset,
    showSelectionInfo,
    placeHolderUntil,
    placeHolderStart,
    infoText,
    infoContainerStyle,
    infoStyle,
    dayHeadings,
    showButton,
    buttonContainerStyle,
    buttonColor,
    onClose,
  } = props;
  const [startDate, setStartDate] = useState<any>();
  const [untilDate, setUntilDate] = useState<any>();
  const [availableDates, setAvailableDates] = useState<any[]>();

  const isInvalidRange = useCallback((date: any) => {
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
  }, []);

  const getMonthStack = useCallback(() => {
		let res = [];
		let initMonth = moment();
    if(initialMonth && initialMonth != '') {
      initMonth = moment(initialMonth, 'YYYYMM');
    }

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
  }, []);

  const onSelectDate = useCallback((date: any) => {
		let currentStartDate = null;
		let currentUntilDate = null;

		if(startDate && !untilDate) {
			if(date.format('YYYYMMDD') < startDate.format('YYYYMMDD') || isInvalidRange(date)){
				currentStartDate = date;
			} else if(date.format('YYYYMMDD') > startDate.format('YYYYMMDD')){
				currentStartDate = startDate;
				currentUntilDate = date;
			} else{
        currentStartDate = null;
        currentUntilDate = null;
			}
		} else if(!isInvalidRange(date)) {
			currentStartDate = date;
		} else {
			currentStartDate = null;
			currentUntilDate = null;
		}
    setStartDate(currentStartDate);
    setUntilDate(currentUntilDate);
    if (onSelect) {
      onSelect(currentStartDate, currentUntilDate);
    }
  }, [startDate, untilDate]);

  const onReset = useCallback(() => {
    setStartDate(null);
    setUntilDate(null);
    if (onSelect) {
      onSelect(null, null);
    }
  }, []);

  const handleConfirmDate = useCallback(() => {
		onConfirm && onConfirm(startDate, untilDate);
  }, []);

  const handleRenderRow = useCallback((month: any) => {
    const {
      selectedBackgroundColor,
      selectedTextColor,
      todayColor,
      ignoreMinDate,
      minDate,
      maxDate
    } = props;
    let currentAvailableDates = availableDates;
    let currentStartDate = startDate;
    let currentUntilDate = untilDate;

		if(currentAvailableDates && currentAvailableDates.length > 0){
			currentAvailableDates = currentAvailableDates.filter(function(d){
				if(d.indexOf(month) >= 0)
					return true;
			});
		}
		return (
			<Month
				onSelectDate={onSelectDate}
				startDate={currentStartDate}
				untilDate={currentUntilDate}
				availableDates={currentAvailableDates}
				minDate={minDate ? moment(minDate, 'YYYYMMDD') : minDate}
				maxDate={maxDate ? moment(maxDate, 'YYYYMMDD') : maxDate}
				ignoreMinDate={ignoreMinDate}
        dayProps={{
          selectedBackgroundColor,
          selectedTextColor,
          todayColor
        }}
        month={month}
      />
		)
  }, []);

  useEffect(() => {
    setAvailableDates(availableDatesProp);
  }, [availableDatesProp]);

  return (
    <View style={{backgroundColor: '#fff', zIndex: 1000, alignSelf: 'center', width: '100%', flex: 1}}>
      {
        showClose || showReset ?
          (<View style={{ flexDirection: 'row', justifyContent: "space-between", padding: 20, paddingBottom: 10}}>
            {
              showClose && <Text style={{fontSize: 20}} onPress={onClose}>Close</Text>
            }
            {
              showReset && <Text style={{fontSize: 20}} onPress={onReset}>Reset</Text>
            }
          </View>)
          :
          null
      }
      {
        showSelectionInfo ? 
        (
        <View style={{ flexDirection: 'row', justifyContent: "space-between", paddingHorizontal: 20, paddingBottom: 5, alignItems: 'center'}}>
          <View style={{flex: 1}}>
            <Text style={{fontSize: 34, color: '#666'}}>
              {startDate ? moment(startDate).format("MMM DD YYYY") : placeHolderStart}
            </Text>
          </View>

          <View style={{}}>
            <Text style={{fontSize: 80}}>
              /
            </Text>
          </View>

          <View style={{flex: 1}}>
            <Text style={{fontSize: 34, color: '#666', textAlign: 'right'}}>
              {untilDate ? moment(untilDate).format("MMM DD YYYY") : placeHolderUntil}
            </Text>
          </View>
        </View>
        ) : null
      }
      
      {
        infoText != "" &&
        <View style={infoContainerStyle}>
          <Text style={infoStyle}>{infoText}</Text>
        </View>
      }
      <View style={styles.dayHeader}>
        {
          dayHeadings.map((day: any, i: number) => {
            return (<Text style={{width: "14.28%", textAlign: 'center'}} key={i}>{day}</Text>)
          })
        }
      </View>
      <FlatList
        style={{ flex: 1 }}
        data={getMonthStack()}
        renderItem={({item}) => { 
          return handleRenderRow(item)
        }}
        keyExtractor = {(item: any, index) => index.toString() }
        showsVerticalScrollIndicator={false}
      />
      {
        showButton ? 
        (
          <View style={[styles.buttonWrapper, buttonContainerStyle]}>
            <Button
              title="Select Date" 
              onPress={handleConfirmDate}
              color={buttonColor} />
          </View>
        )
        :
        null
      }	
    </View>
  );
};

RangeDatepicker.defaultProps = {
  initialMonth: '',
  dayHeadings: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  maxMonth: 12,
  buttonColor: 'green',
  buttonContainerStyle: {},
  showReset: true,
  showClose: true,
  ignoreMinDate: false,
  isHistorical: false,
  onClose: () => {},
  onSelect: () => {},
  onConfirm: () => {},
  placeHolderStart: 'Start Date',
  placeHolderUntil: 'Until Date',
  selectedBackgroundColor: 'green',
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
};

export default RangeDatepicker;

