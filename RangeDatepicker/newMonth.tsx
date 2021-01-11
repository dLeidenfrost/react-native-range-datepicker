import React, {useCallback} from 'react';
import {Text, View} from 'react-native';
import moment from 'moment';
import DayRow from './newDayRow';

const Month = (props: any) => {
  const { month, dayProps, onSelectDate } = props;

  const getDayStack = useCallback((month: any) => {
		let currMonth = moment(month).month(); //get this month
		let currDate = moment(month).startOf("month"); //get first day in this month
		let dayColumn = [];
		let dayRow = [];
		let dayObject: any = {};
    let {
      startDate,
      untilDate,
      availableDates,
      minDate,
      maxDate,
      ignoreMinDate
    } = props;

		do {
			dayColumn = [];
			for(let i = 0; i < 7; i++){
				dayObject = {
					type : null,
					date: null
				};
				if(i == currDate.days() && currDate.month() == currMonth)
				{
					if(minDate && minDate.format("YYYYMMDD") && currDate.format("YYYYMMDD") < minDate.format("YYYYMMDD")){
						if(startDate && startDate.format('YYYYMMDD') > currDate.format("YYYYMMDD") && currDate.format("YYYYMMDD") > moment().format("YYYYMMDD") && ignoreMinDate){}
						else{
							dayObject.type = 'disabled';
						}
					}
					if(maxDate && maxDate.format("YYYYMMDD") && currDate.format("YYYYMMDD") > maxDate.format("YYYYMMDD")){
						dayObject.type = 'disabled';
					}
					if(availableDates && availableDates.indexOf(currDate.format("YYYYMMDD")) == -1){
						dayObject.type = 'blockout';
					}
					if(startDate && startDate.format('YYYYMMDD') == currDate.format('YYYYMMDD')){
						if(!untilDate)
							dayObject.type = 'single';
						else{
							dayObject.type = 'first';
						}
					}
					if(untilDate && untilDate.format('YYYYMMDD') == currDate.format('YYYYMMDD')){
						dayObject.type = 'last';
					}
					if((startDate && startDate.format('YYYYMMDD') < currDate.format('YYYYMMDD')) && 
						(untilDate && untilDate.format('YYYYMMDD') > currDate.format('YYYYMMDD')))
						dayObject.type = 'between';

					dayObject.date = currDate.clone().format('YYYYMMDD');
					dayColumn.push(dayObject);
					currDate.add(1, 'day');
				}
				else{
					if(startDate && untilDate &&
						(
							startDate.format('YYYYMMDD') < currDate.format('YYYYMMDD')  && 
							untilDate.format('YYYYMMDD') >= currDate.format('YYYYMMDD')
						)
					)
						dayObject.type = 'between';

					dayColumn.push(dayObject);
				}
			}

			dayRow.push(dayColumn);
		} while (currDate.month() == currMonth);

		return dayRow;
  }, []);

  const dayStack = getDayStack(moment(month, 'YYYYMM'));
  return (
    <View>
      <Text
        style={{fontSize: 14, padding: 14}}
      >
        {moment(month, 'YYYYMM').format("MMMM YYYY")}
      </Text>
      <View>
        {
          dayStack.map((days, i) => {
            return (
              <DayRow
                days={days}
                dayProps={dayProps}
                key={i}
                onSelectDate={onSelectDate}
              />
            )
          })
        }
      </View>
    </View>
  );
};

export default Month;

