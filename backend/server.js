import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const app = express();

// Middleware
app.use(
  cors({
    origin: "https://clima-app-y2dw.onrender.com",
    methods: ["GET"],
  })
);

app.use(express.json());

// Health check
app.get("/", (req, res) => {
  res.json({ ok: true, message: "Backend clima-app funcionando ✅" });
});

// Endpoint para clima: /api/weather?city=Santo%20Domingo
app.get("/api/weather", async (req, res) => {
  try {
    const city = (req.query.city || "").trim();
    if (!city) {
      return res.status(400).json({ error: "Falta el parámetro city" });
    }

    const API_KEY = process.env.OPENWEATHER_API_KEY;
    if (!API_KEY) {
      return res.status(500).json({ error: "Falta OPENWEATHER_API_KEY en variables de entorno" });
    }

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
      city
    )}&units=metric&lang=es&appid=${API_KEY}`;

    const response = await axios.get(url);

    // devolvemos la data tal cual (o puedes filtrar campos luego)
    return res.json(response.data);

  } catch (error) {
    // Axios: si hubo respuesta del servidor (ej 404)
    if (error.response) {
      const status = error.response.status;

      if (status === 404) {
        return res.status(404).json({ error: "Ciudad no encontrada" });
      }

      return res.status(status).json({ error: "Error de la API OpenWeather" });
    }

    // Error de red
    if (error.request) {
      return res.status(503).json({ error: "Sin conexión / servidor no disponible" });
    }

    // Error inesperado
    return res.status(500).json({ error: "Error inesperado en el servidor" });
  }
});

//--RUTA--//
const PORT = process.env.PORT || 3001;

// Health check
app.get("/health", (req, res) => {
  res.json({ ok: true, status: "healthy" });
});

//==⚠️ COMENTADO TEMPORALMENTE ⚠️==//
// Weather endpoint
/*app.get("/weather", async (req, res) => {
  try {
    const city = req.query.city || "Santo Domingo";
    const apiKey = process.env.OPENWEATHER_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ ok: false, error: "Falta OPENWEATHER_API_KEY en .env" });
    }

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
      city
    )},DO&appid=${apiKey}&units=metric&lang=es`;

    const response = await fetch(url);
    const data = await response.json();

    return res.status(response.status).json({
      city: data?.name,
      country: data?.sys?.country,
      coords: data?.coord,
      temp: data?.main?.temp,
      feels_like: data?.main?.feels_like,
      humidity: data?.main?.humidity,
      description: data?.weather?.[0]?.description,
      icon: data?.weather?.[0]?.icon,
    });
  } catch (err) {
    return res.status(500).json({ ok: false, error: "Error consultando OpenWeather", detail: String(err) });
  }
});*/

//==⚠️ COMENTADO TEMPORALMENTE ⚠️==//
/*app.get("/forecast", async (req, res) => {
  try {
    const city = req.query.city || "Santo Domingo";
    const apiKey = process.env.OPENWEATHER_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ ok: false, error: "Falta OPENWEATHER_API_KEY en variables de entorno"});
    }

    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(
      city
    )},DO&appid=${apiKey}&units=metric&lang=es`;

    const response = await fetch(url);
    const data = await response.json();

    // Resumen (8 items = ~24 horas si viene cada 3 horas)
    return res.status(response.status).json({
      city: data?.city?.name,
      country: data?.city?.country,
      coords: data?.city?.coord,
      cnt: (data?.list || []).slice(0, 8).length,
      list: (data?.list || []).slice(0, 8).map((item) => ({
        dt: item.dt,
        dt_txt: item.dt_txt,
        temp: item?.main?.temp,
        feels_like: item?.main?.feels_like,
        humidity: item?.main?.humidity,
        description: item?.weather?.[0]?.description,
        icon: item?.weather?.[0]?.icon,
      })),
    });
  } catch (err) {
    return res.status(500).json({
      ok: false,
      error: "Error consultando OpenWeather forecast",
      detail: String(err),
    });
  }
});*/


app.listen(PORT, () => {
  console.log(`✅ Backend corriendo en puerto ${PORT}`);
});
