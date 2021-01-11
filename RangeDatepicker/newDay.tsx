import React from 'react';
import {Dimensions, Text, TouchableWithoutFeedback, View, ViewStyle} from 'react-native';
import moment from 'moment';

const DEVICE_WIDTH = Dimensions.get('window').width;

const Day = (props: any) => {
  let {day, dayProps, onSelectDate} = props;
  let dayStyle: ViewStyle = {backgroundColor : 'transparent', position: 'relative', width: "14.28%"};
  let textDayStyle = {color: 'black'};

  if(day.date) {
    if(day.type == 'disabled') {
      return (
        <TouchableWithoutFeedback style={dayStyle}>
          <View style={{...dayStyle, height: Math.floor(DEVICE_WIDTH / 7), justifyContent: 'center'}}>
            <Text style={{...textDayStyle, textAlign: "center", backgroundColor: 'transparent', fontSize: Math.floor(DEVICE_WIDTH / 26)}}>{moment(day.date, 'YYYYMMDD').date()}</Text>
            {day.date == moment().format("YYYYMMDD") ? (<View style={{position: 'absolute', top:0, bottom:0, left:0, right: 0, justifyContent: 'center', backgroundColor: 'transparent'}}><Text style={{fontSize: Math.floor(DEVICE_WIDTH / 17), fontWeight: 'bold', color: '#ccc', textAlign: 'center'}}>__</Text></View>) : null}
          </View>
        </TouchableWithoutFeedback>
      );
    } else if(day.type == 'blockout') {
      const strikeTop = Math.floor(DEVICE_WIDTH / -22);
      return (
        <TouchableWithoutFeedback style={dayStyle}>
          <View style={{...dayStyle, height: Math.floor(DEVICE_WIDTH / 7), justifyContent: 'center'}}>
            <Text style={{...textDayStyle, textAlign: "center", backgroundColor: 'transparent', fontSize: Math.floor(DEVICE_WIDTH / 26)}}>{moment(day.date, 'YYYYMMDD').date()}</Text>
            <View style={{position: 'absolute', top: strikeTop, bottom:0, left:0, right: 0, justifyContent: 'center', backgroundColor: 'transparent'}}><Text style={{fontSize: Math.floor(DEVICE_WIDTH / 17), color: '#ccc', textAlign: 'center'}}>__</Text></View>
          </View>
        </TouchableWithoutFeedback>
      );
    } else {
      return (
        <TouchableWithoutFeedback style={dayStyle} onPress={() => onSelectDate(moment(day.date, 'YYYYMMDD'))}>
          <View style={{...dayStyle, height: Math.floor(DEVICE_WIDTH / 7), justifyContent: 'center'}}>
            <Text style={{...textDayStyle, textAlign: "center", backgroundColor: 'transparent', fontSize: Math.floor(DEVICE_WIDTH / 26)}}>{moment(day.date, 'YYYYMMDD').date()}</Text>
            {day.date == moment().format("YYYYMMDD") ? (<View style={{position: 'absolute', top:0, bottom:0, left:0, right: 0, justifyContent: 'center', backgroundColor: 'transparent'}}><Text style={{fontSize: Math.floor(DEVICE_WIDTH / 17), fontWeight: 'bold', color: dayProps.selectedBackgroundColor, textAlign: 'center'}}>__</Text></View>) : null}
          </View>
        </TouchableWithoutFeedback>
      );
    }
  }
  else {
    return (
      <TouchableWithoutFeedback style={dayStyle}>
        <View style={{...dayStyle, height: Math.floor(DEVICE_WIDTH / 7), justifyContent: 'center'}}>
          <Text style={{ ...textDayStyle, textAlign: "center", backgroundColor: 'transparent', fontSize: Math.floor(DEVICE_WIDTH / 26)}}>{null}</Text>
        </View>
      </TouchableWithoutFeedback>
    );
  }
};

export default Day;

