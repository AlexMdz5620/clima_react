import axios from "axios";
import { z } from 'zod';
// import { number, object, parse, string, type InferOutput } from "valibot";
import type { SearchType } from "../types";
import { useMemo, useState } from "react";

// TYPE GUARD O ASSERTION
/* function isWeatherResponse(weather: unknown) {
    return (
        Boolean(weather) &&
        typeof weather === 'object' &&
        typeof (weather as Weather).name === 'string' &&
        typeof (weather as Weather).main.temp === 'number' &&
        typeof (weather as Weather).main.temp_max === 'number' &&
        typeof (weather as Weather).main.temp_min === 'number'
    );
} */

// Zod
const WeatherSquema = z.object({
    name: z.string(),
    main: z.object({
        temp: z.number(),
        temp_max: z.number(),
        temp_min: z.number(),
    })
});

export type Weather = z.infer<typeof WeatherSquema>

// Valibot
/* const WeatherSquema = object({
    name: string(),
    main: object({
        temp: number(),
        temp_max: number(),
        temp_min: number(),
    }),
});

type Weather = InferOutput<typeof WeatherSquema>; */

const initialState = {
        name: '',
        main: {
            temp: 0,
            temp_max: 0,
            temp_min: 0,
        },
    }

export default function useWeather() {
    const [weather, setWeather] = useState<Weather>(initialState);
    const [loading, setLoading] = useState(false);
    const [notFound, setNotFound] = useState(false);

    const featchWeather = async (search: SearchType) => {
        const apiId = import.meta.env.VITE_API_KEY;
        setLoading(true);
        setWeather(initialState);

        try {
            const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${search.city},${search.country}&appid=${apiId}`;
            const { data } = await axios(geoUrl);

            if (!data[0]) {
                setNotFound(true);
                return;
            }

            const lat = data[0].lat;
            const lon = data[0].lon;

            const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiId}`;

            // Castear el type | Type Casting
            /* const { data: weatherResult } = await axios<Weather>(weatherUrl);
            console.log(weatherResult.temp);
            console.log(weatherResult.name); */

            // Type Guards
            /* const { data: weatherResult } = await axios<Weather>(weatherUrl);
            const result = isWeatherResponse(weatherResult);

            if (result){
                console.log(weatherResult.name)
            } else {
                console.log('Respuesta mal formada');
            } */

            // Zod
            const { data: weatherResult } = await axios<Weather>(weatherUrl);
            const result = WeatherSquema.safeParse(weatherResult);
            if (result.success) {
                setWeather(result.data);
            } else {
                console.log('Respuesta mal formada');
            }

            // Valibot
            /* const { data: weatherResult } = await axios<Weather>(weatherUrl);
            const result = parse(WeatherSquema, weatherResult);
            if (result) {
                console.log(result.name);
                console.log(result.main.temp);
            } */

        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    const hasWeatherData = useMemo(() => weather.name, [weather])

    return {
        weather,
        loading,
        notFound,
        featchWeather,
        hasWeatherData,
    };
}