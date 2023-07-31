# Tickets-Web-App

Proyecto Web React para Gestión y Generación de Tickets para Eventos.

## Tech Stack

* React
* React-bootstrap
* Formik
* React-Data-Table-Component
* React-Router-Dom
* React-Select
* Yup
* Docker


## Installation

Instalar con npm

```bash
  npm install my-project
  cd my-project
```
## Ejecutar Proyecto

#### Ejecutar Local
    
```bash
  npm start
```
#### Ejecutar desde Docker
##### Build

```bash
  docker build -t web-tickets-app .
```

#### Ejecutar Ambiente Dev
```bash
  docker compose -f docker-compose.dev.yml up
```
#### Ejecutar Ambiente Prod
```bash
  docker compose -f docker-compose.prod.yml up
```