# 🌤️ Clima App

Aplicación del clima con **frontend en HTML/CSS/JS** y **backend en Node.js**, dockerizado.

## 🚀 Funcionalidades
- Consulta del clima actual por ciudad
- Pronóstico por horas
- Backend con Express
- API externa de clima
- Docker listo para despliegue

## 🧱 Tecnologías
- HTML, CSS, JavaScript
- Node.js + Express
- Docker
- Git & GitHub

## ▶️ Uso local

```bash
cd backend
docker build -t clima-backend .
docker run -p 3001:3001 clima-backend
