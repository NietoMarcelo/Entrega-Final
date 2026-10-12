# Entrega Final - Turnos y reservas

Sigue de la entrega 8. Dejé filtros/paginación, validación con Zod y populate, y le sumé las vistas con Handlebars y el tiempo real con Socket.io.

## Arrancar

```bash
npm install
```

Copiar `.env.example` a `.env` y poner tu `MONGO_URI`. El `.env` no se sube.

```bash
npm run dev
```

Queda en `http://localhost:8080`. Si anda, `/health` tira ok.

Vistas:

- `http://localhost:8080/views/services`
- `http://localhost:8080/views/availability`

## Cómo está armado

```
ruta -> middleware (zod) -> controller -> service -> repository -> dao -> mongo
```

Las validaciones están en `src/validations` y se aplican con el middleware de `src/middlewares`. Los filtros de servicios los armo en el service, no en el router.

Las vistas también pasan por esa misma cadena. Socket.io está en `src/config/socket.config.js` y el cliente escucha en `public/js/socket.js`.

## Endpoints

- `GET /api/services`
- `GET /api/services/:sid`
- `POST /api/services`
- `PUT /api/services/:sid`
- `DELETE /api/services/:sid`
- `POST /api/bookings`
- `GET /api/bookings/:bid`
- `POST /api/bookings/:bid/services/:sid`

## Filtros, paginación y sort (servicios)

El GET de servicios acepta query params:

- `category` → ej: `belleza`
- `available` → `true` o `false`
- `page` → default 1
- `limit` → default 10
- `sortBy` → `name`, `price`, `duration`, `category`, `available` o `createdAt`
- `order` → `asc` o `desc`

Ejemplos:

```
GET /api/services?category=belleza&available=true&page=1&limit=5&sortBy=price&order=desc
GET /api/services?page=2&limit=3
GET /api/services?sortBy=name&order=asc
```

La respuesta viene así:

```json
{
  "status": "success",
  "payload": [],
  "total": 12,
  "page": 1,
  "limit": 5,
  "totalPages": 3,
  "hasPrevPage": false,
  "hasNextPage": true
}
```

## Validaciones (Zod)

Si mandás cualquier cosa, Zod te corta con 400 y no llega a Mongo.

**Crear servicio** (`POST /api/services`) pide name, description, price, duration, available y category:

```json
{
  "name": "Corte de cabello",
  "description": "Corte clasico",
  "price": 8500,
  "duration": 40,
  "available": true,
  "category": "belleza"
}
```

**Update** (`PUT /api/services/:sid`) los campos son opcionales pero tenés que mandar por lo menos uno:

```json
{
  "price": 9000,
  "available": false
}
```

**Crear reserva** (`POST /api/bookings`): clientName, email, date, time y status. El status solo puede ser pending, confirmed o cancelled. La hora va en HH:MM. Los servicios van como id + quantity, no el objeto entero.

```json
{
  "clientName": "Ana Perez",
  "email": "ana@mail.com",
  "date": "2026-09-20",
  "time": "14:30",
  "status": "pending",
  "service": [
    { "service": "66f1c2a8b4d1e23a9c8f1001", "quantity": 1 }
  ]
}
```

**Agregar servicio a una reserva** (`POST /api/bookings/:bid/services/:sid`). El body es opcional, si no mandás quantity usa 1. Si el servicio ya estaba, le suma a la quantity.

```json
{
  "quantity": 2
}
```

## Populate de reservas

En la reserva no guardo el servicio completo, solo la referencia:

```json
{
  "service": "ObjectId",
  "quantity": 1
}
```

Cuando hago `GET /api/bookings/:bid` uso populate y me trae la reserva (cliente, email, fecha, hora, estado) con los datos completos de cada servicio.

```
GET /api/bookings/66f1c2a8b4d1e23a9c8f2002
```

## Vistas (Handlebars)

`GET /views/services` muestra nombre, descripción, duración, precio, categoría y si está disponible. También hay un form para crear uno.

`GET /views/availability` muestra la disponibilidad de cada servicio y las reservas que hay en la base.

## Socket.io

No tiro un evento al conectar y listo. El evento sale cuando pasa algo de verdad:

- crear un servicio (`POST /api/services`) emite `serviceCreated`
- cambiar disponibilidad (`PUT /api/services/:sid`) emite `serviceUpdated`
- crear una reserva emite `bookingCreated`

Si tenés la vista abierta, se actualiza sola. Podés probarlo creando un servicio desde el form o mandando el POST por Postman con la página abierta.
