import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Image,
  FlatList,
} from "react-native";
import * as Location from "expo-location";
import { useEffect, useState } from "react";

const myAPI = "f78a09c17d23daf101868fff5e523cc0";

export default function App() {
  const [location, setLocation] = useState(null);
  const [cityData, setCityData] = useState("");
  const [weatherIcon, setWeatherIcon] = useState("");
  const [prevision, setPrevision] = useState("");

  const getWeather = async (lat, long) => {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${myAPI}&units=metric&lang=fr`
    );
    const data = await response.json();
    setCityData(data);
    setWeatherIcon(data.weather[0].icon);
    //console.log(data);
  };
  {
    /*Configuration des données pour les prévisions*/
  }

{/* Ici grace à GetPrevisionWeather je récupère les données de l'api */} 
  const getPrevisionWeather = async (lat, lon) => {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${myAPI}&units=metric&lang=fr`
    );
    const datas = await response.json();
    setPrevision(datas.list);
  };
 
 {/* J'utilise le useEffect pour récupérer les données de l'api pour récupérer la localisation */} 
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission n'est pas accepter");
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      getWeather(location.coords.latitude, location.coords.longitude);
      getPrevisionWeather(location.coords.latitude, location.coords.longitude);
      console.log(location);
    })();
  }, []);

  return (
    <View style={styles.container}>
      {/* Affichage du nom de la ville */}
      {cityData ? (
        <View
          style={{
            flex: 0.2,
            alignItems: "center",
            justifyContent: "space-around",
            width: "100%",
            paddingTop: 100,
          }}
        >
          <Text
            style={{
              fontSize: 32,
            }}
          >
          <Text style={{ fontSize: 38, paddingTop: 10 }}> Hassad de  </Text>
            {cityData.name}
          </Text>
          <Text style={{ fontSize: 48, paddingTop: 25 }}>
            {Math.floor(cityData.main.temp)} °C
          </Text>
        </View>

      ) : (
        <ActivityIndicator size="large" color="#00ff00" />
      )}
      
      {weatherIcon ? (
        <View
          style={{
            flex: 0.5,
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
          }}
        >
          <Image
            source={{
              uri: `https://openweathermap.org/img/wn/${weatherIcon}@4x.png`,
            }}
            style={{ width: 200, height: 200 }}
          />
          <Text style={{ fontSize: 28, paddingTop: 14 }}>
            {cityData.weather[0].description}
          </Text>
        </View>
      ) : (
        <ActivityIndicator size="large" color="#00ff00" />
      )}

      {/* Affichage de la température*/}

      {prevision ? (
        <View style={{ flex: 0.3 }}>
          {console.log(prevision)}

          <FlatList
            data={prevision}
            keyExtractor={(item) => item.dt.toString()}
            horizontal={true}
            renderItem={({ item }) => (
              <>
                <View
                  style={{
                    marginHorizontal: 5,
                    paddingHorizontal: 20,
                    paddingVertical: 10,
                    flexDirection: "column",
                    backgroundColor: "lightpink",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 12,
                      fontWeight: "italic",
                      textTransform: "bold",
                    }}
                  >
                  {/* Ici je récupère les données convertie en chaine de caractère */}
                    {new Date(item.dt_txt).toLocaleDateString("fr-FR", { 
                      weekday: "short",
                      day: "numeric",
                      month: "short",
                      hour: "numeric",
                    })}
                  </Text>
                  {/* Ici je récupère les icons grâce à l'uri*/}
                  <Image
                    source={{
                      uri: `http://openweathermap.org/img/wn/${item.weather[0].icon}@4x.png`,
                    }}
                    style={{ height: 150, width: 150 }}
                  ></Image>
                  <Text
                    style={{
                      fontSize: 24,
                      color: "#222222",
                      fontWeight: "bold",
                    }}
                  >
                    {Math.floor(item.main.temp)} <Text>°C</Text>
                  </Text>
                </View>
              </>
            )}
          />
        </View>
      ) : (
        <ActivityIndicator size="large" color="#00ff00" />
      )}

      <StatusBar style="auto" />
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
});
