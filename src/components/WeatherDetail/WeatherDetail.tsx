import type { Weather } from "../../hooks/useWeather";
import { formatTemp } from "../../utils";
import styles from './WeatherDetail.module.css';

type WeatherDetailProps = {
    weather: Weather;
}

export default function WeatherDetail({ weather }: WeatherDetailProps) {
  return (
    <div className={styles.container}>
        <h2>Clima de: {weather.name}</h2>
        <p className={styles.current}>{formatTemp(weather.main.temp)} °C</p>
        <div className={styles.temps}>
            <p>Min: <span>{formatTemp(weather.main.temp_min)} °C</span> </p>
            <p>Max: <span>{formatTemp(weather.main.temp_max)} °C</span> </p>
        </div>
    </div>
  )
}
