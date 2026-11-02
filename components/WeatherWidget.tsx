"use client"
import { useState, useEffect } from 'react'

interface WeatherData {
  temperature: number
  weathercode: number
  windspeed: number
}

const weatherDescriptions: Record<number, { label: string, emoji: string }> = {
  0: { label: 'Céu limpo', emoji: '☀️' },
  1: { label: 'Quase limpo', emoji: '🌤️' },
  2: { label: 'Parcialmente nublado', emoji: '⛅' },
  3: { label: 'Nublado', emoji: '☁️' },
  45: { label: 'Névoa', emoji: '🌫️' },
  48: { label: 'Geada', emoji: '🌫️' },
  51: { label: 'Garoa', emoji: '🌦️' },
  53: { label: 'Garoa moderada', emoji: '🌦️' },
  61: { label: 'Chuva leve', emoji: '🌧️' },
  63: { label: 'Chuva moderada', emoji: '🌧️' },
  71: { label: 'Neve leve', emoji: '🌨️' },
  80: { label: 'Pancadas', emoji: '⛈️' },
  95: { label: 'Trovoada', emoji: '⛈️' },
}

const cityCoords: Record<string, { lat: number, lon: number }> = {
  "Gramado": { lat: -29.374, lon: -50.874 },
  "Canela": { lat: -29.364, lon: -50.816 },
  "Campos do Jordão": { lat: -22.739, lon: -45.590 },
  "Bonito": { lat: -21.126, lon: -56.483 },
  "Fernando de Noronha": { lat: -3.854, lon: -32.425 },
  "Florianópolis": { lat: -27.594, lon: -48.548 },
  "Salvador": { lat: -12.971, lon: -38.501 },
  "Rio de Janeiro": { lat: -22.906, lon: -43.172 },
  "São Paulo": { lat: -23.548, lon: -46.636 },
  "Fortaleza": { lat: -3.717, lon: -38.543 },
  "Manaus": { lat: -3.119, lon: -60.021 },
  "Foz do Iguaçu": { lat: -25.547, lon: -54.588 },
  "Porto Alegre": { lat: -30.034, lon: -51.217 },
  "Recife": { lat: -8.047, lon: -34.877 },
  "Natal": { lat: -5.793, lon: -35.209 },
  "Maceió": { lat: -9.665, lon: -35.735 },
  "Curitiba": { lat: -25.428, lon: -49.273 },
  "Belo Horizonte": { lat: -19.916, lon: -43.934 },
  "Brasília": { lat: -15.779, lon: -47.929 },
  "Belém": { lat: -1.455, lon: -48.502 },
  "Jericoacoara": { lat: -2.793, lon: -40.512 },
  "Paraty": { lat: -23.217, lon: -44.714 },
  "Ouro Preto": { lat: -20.385, lon: -43.503 },
  "Tiradentes": { lat: -21.108, lon: -44.174 },
  "Diamantina": { lat: -18.241, lon: -43.600 },
  "São Thomé das Letras": { lat: -21.718, lon: -44.982 },
  "Barreirinhas": { lat: -2.755, lon: -42.826 },
  "Pirenópolis": { lat: -15.851, lon: -48.961 },
  "Alto Paraíso de Goiás": { lat: -14.124, lon: -47.509 },
  "Chapada dos Guimarães": { lat: -15.462, lon: -55.748 },
  "Porto Seguro": { lat: -16.446, lon: -39.064 },
  "Trancoso": { lat: -16.589, lon: -39.092 },
  "Búzios": { lat: -22.748, lon: -41.882 },
  "Angra dos Reis": { lat: -23.006, lon: -44.318 },
  "Arraial do Cabo": { lat: -22.966, lon: -42.028 },
  "Corumbá": { lat: -19.009, lon: -57.653 },
  "Alter do Chão": { lat: -2.506, lon: -54.951 },
  "Urubici": { lat: -28.015, lon: -49.593 },
  "São Joaquim": { lat: -28.293, lon: -49.932 },
}

interface WeatherWidgetProps {
  city: string
}

export default function WeatherWidget({ city }: WeatherWidgetProps) {
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(true)
  const coords = cityCoords[city]

  useEffect(() => {
    if (!coords) { setLoading(false); return }
    fetch(`https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&current_weather=true`)
      .then(r => r.json())
      .then(d => {
        if (d.current_weather) {
          setWeather({
            temperature: Math.round(d.current_weather.temperature),
            weathercode: d.current_weather.weathercode,
            windspeed: Math.round(d.current_weather.windspeed),
          })
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [city, coords?.lat, coords?.lon])

  if (!coords || (!loading && !weather)) return null

  const desc = weather ? (weatherDescriptions[weather.weathercode] ?? { label: 'Variável', emoji: '🌡️' }) : null

  return (
    <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-xl px-3 py-2 text-sm">
      {loading ? (
        <span className="text-gray-400 text-xs animate-pulse">Carregando clima...</span>
      ) : weather && desc ? (
        <>
          <span className="text-xl">{desc.emoji}</span>
          <div>
            <p className="font-bold text-gray-800 leading-none">{weather.temperature}°C</p>
            <p className="text-gray-500 text-xs leading-tight">{desc.label}</p>
          </div>
          <div className="text-gray-400 text-xs border-l border-blue-200 pl-2">
            💨 {weather.windspeed} km/h
          </div>
        </>
      ) : null}
    </div>
  )
}
