import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View, Dimensions } from 'react-native';
import * as Location from 'expo-location';

const {width:SCREEN_WIDTH} = Dimensions.get('window');

const API_KEY = "e48c9cedd3b904ce3d80f88a33babc08"

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
            <Text style={styles.temp}>{day.main.temp}</Text>
            <Text style={styles.description}>{day.weather[0].main}</Text>
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
    flex:1,
    justifyContent:"center",
    alignItems:"center"
  },
  cityName:{
    fontSize: 68,
    fontWeight: "500",
  },
  weather:{
  },
  day:{
    width: SCREEN_WIDTH,
    alignItems:"center"
  },
  temp: {
    marginTop: 50,
    fontSize: 150,
    fontWeight: "600",
  },
  description: {
    marginTop: -30,
    fontSize: 60,
  }
})