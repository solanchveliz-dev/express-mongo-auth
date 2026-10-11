# Express Mongo Auth

Aplicación de autenticación con Express, MongoDB y JWT. El proyecto incluye flujo de login, registro, perfil, administración de usuarios, rutas protegidas y vistas EJS con una interfaz moderna.

## Credenciales por defecto

- Administrador: `admin@local.test` / `Admin@123`
- Usuario demo: `usuario@demo.com` / `Usuario#2026`

## Requisitos

- Node.js 18+
- MongoDB Atlas o base local con `MONGODB_URI` configurado
- `JWT_SECRET` en `.env`

## Variables de entorno

```env
PORT=3000
JWT_SECRET=tu_secret
JWT_EXPIRES_IN=1h
MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/auth_db
```

## Ejecución local

```bash
npm install
npm start
```

La app escucha en `http://localhost:3000`.

## Endpoints principales

- `POST /api/auth/signUp` — registro de usuario
- `POST /api/auth/signIn` — login y obtención de JWT
- `GET /api/users` — listado de usuarios, solo admins
- `GET /api/users/me` — perfil del usuario autenticado
- `PUT /api/users/me` — actualizar perfil propio
- `PUT /api/users/:id` — actualizar un usuario por admin
- `DELETE /api/users/:id` — eliminar usuario por admin
- `GET /health` — estado del servicio

## Flujo de validación

1. Inicia sesión con administrador.
2. GET `/api/users` con token admin debe devolver `200`.
3. Inicia sesión con el usuario demo.
4. GET `/api/users` con token demo debe devolver `403`.
5. Llama a rutas protegidas sin token y confirma `401`.
6. Registra un usuario con contraseña débil y confirma `400`.
7. Intenta registrar el mismo email dos veces y confirma `409`.
8. Actualiza un usuario desde cuenta admin y confirma `200`.
9. Elimina un usuario desde cuenta admin y confirma `200`.
10. Intenta borrar al propio admin y confirma `400`.

## Observaciones

- La ruta web `/admin` usa JavaScript del cliente para redirigir a `/403` cuando el usuario no tiene permiso.
- El proyecto mantiene el contrato de autenticación y middleware actual sin alterar la lógica de autorización original.
- No se modifica `.env` ni la configuración de despliegue para la validación de prueba.
