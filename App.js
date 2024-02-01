import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, Image } from "react-native";
import * as Location from "expo-location";

export default function App() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      fetchWeather(location.coords.latitude, location.coords.longitude);
    })();
  }, []);

  const fetchWeather = (lat, lon) => {
    const apiKey = "20ef76bb24da80a53872ce8404193ebe";
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setWeather(data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  let text = "Waiting..";
  if (errorMsg) {
    text = errorMsg;
  } else if (weather) {
    text = `Weather in ${weather.name}: ${weather.main.temp} °C, ${weather.weather[0].description}`;
  }

  return (
    <View style={styles.container}>
      {weather && (
        <>
          <Text style={styles.totoText}>{weather.name}</Text>
          <Text>{weather.main.temp} °C</Text>
          <Text>{weather.weather[0].description}</Text>
          <Image
            style={styles.totoImage}
            source={{ uri: "https://openweathermap.org/img/wn/10d@2x.png" }}
          />
        </>
      )}
      {!weather && <Text>{text}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  totoText: {
    fontWeight: "bold",
  },

  totoImage: {
    height: 100,
    width: 100,
  },
});
