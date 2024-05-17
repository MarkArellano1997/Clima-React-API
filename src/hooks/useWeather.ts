import axios from 'axios'
import { z } from 'zod'
// import {object,string,number, Output, parse} from 'valibot'
import { SearchType } from '../types';
import { useMemo, useState } from 'react';

//type Guard
// function isWeatherResponse(weather: unknown): weather is Wheater {
//   return(
//     Boolean(weather) &&
//     typeof weather === 'object' &&
//     typeof( weather as Wheater).name === 'string' &&
//     typeof(weather as Wheater).main.temp === 'number'&&
//     typeof(weather as Wheater).main.temp_max === 'number'&&
//     typeof(weather as Wheater).main.temp_min === 'number'
//   )
// }

//zod

const Weather = z.object({
  name: z.string(),
  main: z.object({
    temp: z.number(),
    temp_max: z.number(),
    temp_min: z.number()
  })
})

export type Weather = z.infer<typeof Weather>

//Valibot

// const WeatherSchema =  object({
//   name: string(),
//   main: object({
//     temp: number(),
//     temp_max: number(),
//     temp_min: number()
//   })
// })

// type Weather = Output<typeof WeatherSchema>



export default function useWeather() {

  const initialState = {
    name: '',
    main: {
      temp: 0,
      temp_max: 0,
      temp_min: 0
    }
  }

  const [loading, setLoading] = useState(false)

  const [weather, setWeather] = useState<Weather>(initialState)



  const fetchWeather = async (search: SearchType) => {

    const appId = import.meta.env.VITE_API_KEY

    setLoading(true)

    setWeather(initialState)

    try {

      const geoUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${search.city},${search.country}&appid=${appId}`

      const { data } = await axios(geoUrl)

      const lat = data[0].lat

      const lon = data[0].lon

      const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${appId}`

      //Type Guards

      // const { data: weatherResult } = await axios(weatherUrl)

      // const result = isWeatherResponse(weatherResult)

      // if (result) {
      //   console.log(weatherResult.name);

      // }

      //Zod

      const { data: weatherResult } = await axios(weatherUrl)

      const result = Weather.safeParse(weatherResult)

      if (result.success) {
        setWeather(result.data)

      }

      //Valibot

      // const { data: weatherResult } = await axios(weatherUrl)

      // const result = parse(WeatherSchema, weatherResult)

      // console.log(result);



    } catch (error) {
      console.log(error);

    } finally {
      setLoading(false)
    }

  }

  const hasWeatherData = useMemo(() =>
    weather.name
    , [weather])

  return {
    weather,
    loading,
    fetchWeather,
    hasWeatherData
  }
}
