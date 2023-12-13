import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View, Dimensions } from 'react-native';
import * as Location from 'expo-location';
import {Ionicons, Fontisto} from '@expo/vector-icons';
import symbolicateStackTrace from 'react-native/Libraries/Core/Devtools/symbolicateStackTrace';

const {width:SCREEN_WIDTH} = Dimensions.get('window');

const API_KEY = "e48c9cedd3b904ce3d80f88a33babc08"

const icons = {
  Clouds: "cloudy",
  Snow: "snow",
  Clear:"day-sunny",
}

export default function App() {
  const [city,setCity] = useState("Loading...");
  const [days, setDays] = useState([]);
  const [ok,setOk] = useState(true);
  const getWeather = async() => {
    const {granted} = await Location.requestForegroundPermissionsAsync();
    if(!granted){
      setOk(false);
    }
    const {coords:{latitude, longitude}} = await Location.getCurrentPositionAsync({accuracy:5});
    const location = await Location.reverseGeocodeAsync({latitude,longitude},{useGoogleMaps: false});
    setCity(location[0].city);
    const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`)
    const json = await response.json();
    setDays(json.list.filter(i => {
      if(i.dt_txt.includes("00:00:00")){return i}
    }));
  };
  useEffect(() => {
    getWeather();
  },[])

  return (
    <View style={styles.container}>
      <View style={styles.city}>
        <Text style={styles.cityName}>{city}</Text>
      </View>
      <ScrollView 
      pagingEnabled 
      horizontal 
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.weather}>
        {days.length === 0 ? (
          <View style={styles.day}>
            <ActivityIndicator color="white" size="large"/>
          </View>
        ) :(
          days.map((day, index) =>
          <View key={index} style={styles.day}>
            <View style={styles.tempIcon}>
              <Text style={styles.temp}>{parseFloat(day.main.temp).toFixed(1)}</Text>
              <Fontisto style={styles.icon} name={icons[day.weather[0].main]} size={68} color="white" />
            </View>
            <Text style={styles.description}>{day.weather[0].main}</Text>
            <Text style={styles.today}>{day.dt_txt.slice(0,10)}</Text>
          </View>
          )
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor:"tomato"
  },
  city:{
    flex:1.7,
    justifyContent:"center",
    alignItems:"center"
  },
  cityName:{
    fontSize: 60,
    fontWeight: "900",
    color:"white",
  },
  weather:{
  },
  day:{
    width: SCREEN_WIDTH,
    alignItems:"flex-start",
    marginTop:-60,
  },
  tempIcon:{
    flexDirection:"row",
    alignItems:"center",
    justifyContent:"space-between"
  },
  temp: {
    marginTop: 50,
    fontSize: 120,
    color:"white",
    marginLeft: 30,
    fontWeight: "600",
  },
  icon:{
    marginTop:20,
    marginLeft:10,
  },
  description: {
    marginTop: -10,
    fontSize: 50,
    color:"white",
    marginLeft: 30,
    fontWeight: "600",
  },
  today:{
    color:"white",
    fontSize: 20,
    marginLeft: 30,
    fontWeight: "900",
  }
})