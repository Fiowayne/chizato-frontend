# Documentación Técnica — Chisato Zone (Control de Stock)

**Proyecto:** Sistema de control de stock para local comercial  
**Autor:** Equipo Chisato Zone  
**Fecha:** Agosto 2026  
**Versión:** 1.0  

---

## 1. Introducción

### 1.1 Objetivo del sistema

Permitir al administrador de un local comercial controlar el stock de productos a la venta, administrar el catálogo, gestionar usuarios registrados y ofrecer a los clientes una interfaz para explorar productos, filtrarlos por categoría y realizar compras.

### 1.2 Alcance

- Catálogo público con filtro por categorías
- Registro e inicio de sesión de usuarios
- Carrito de compras y órdenes
- Panel administrador: CRUD productos, control de stock, usuarios y órdenes
- Carga de imágenes de productos al servidor
- Suspensión de cuentas de usuario

### 1.3 Repositorios

| Componente | Repositorio | URL demo |
|------------|-------------|----------|
| Frontend | Repositorio React independiente | https://chisato-lib2.netlify.app |
| Backend | https://github.com/LeandroVerdun/chizatoBack | https://chizatoback.onrender.com |

---

## 2. Arquitectura del sistema

### 2.1 Diagrama general

```
┌─────────────────┐         HTTP/REST          ┌─────────────────┐
│   React (Vite)  │  ◄──────────────────────►  │  Express API    │
│   Puerto 5173   │         Axios + JWT        │  Puerto 5000    │
└─────────────────┘                            └────────┬────────┘
                                                        │
                        ┌───────────────────────────────┼───────────────┐
                        │                               │               │
                        ▼                               ▼               ▼
                 ┌─────────────┐              ┌─────────────┐  ┌─────────────┐
                 │   MongoDB   │              │  /uploads   │  │    JWT      │
                 │  (Mongoose) │              │  (imágenes) │  │   bcrypt    │
                 └─────────────┘              └─────────────┘  └─────────────┘
```

### 2.2 Patrón de diseño

El backend sigue una arquitectura **MVC adaptada**:

- **Models** (`src/models/`): esquemas Mongoose
- **Controllers** (`src/controllers/`): lógica de negocio
- **Routes** (`src/routes/`): definición de endpoints
- **Middleware** (`src/middleware/`): autenticación, autorización, upload

El frontend usa **componentes + servicios**:

- **Components**: UI y páginas
- **Services**: consumo de API con Axios
- **Utils**: helpers (imágenes, errores HTTP)

---

## 3. Modelo de datos (MongoDB)

### 3.1 Colección `users`

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `_id` | ObjectId | Identificador único |
| `name` | String | Nombre completo |
| `email` | String | Email único |
| `password` | String | Hash bcrypt |
| `isAdmin` | Boolean | Rol administrador (default: false) |
| `isSuspended` | Boolean | Cuenta suspendida (default: false) |

### 3.2 Colección `products`

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `_id` | ObjectId | Identificador único |
| `name` | String | Nombre del producto (único) |
| `stock` | Number | Unidades disponibles (min: 0) |
| `description` | String | Descripción |
| `category` | String | Categoría para filtros |
| `author` | String | Autor (contexto librería) |
| `image` | String | Ruta local `/uploads/...` o URL externa |
| `rating` | Number | Valoración 1-5 |
| `price` | Number | Precio en ARS |
| `lastStockControlDate` | Date | Fecha último control de stock |
| `createdAt` / `updatedAt` | Date | Timestamps automáticos |

### 3.3 Colecciones adicionales

- **carts**: carrito por usuario autenticado
- **orders**: órdenes de compra con items y estado

---

## 4. Roles y permisos

| Rol | Permisos |
|-----|----------|
| **Visitante** | Ver catálogo, registrarse, contacto, quiénes somos |
| **Usuario** | Comprar, carrito, perfil, historial de compras |
| **Administrador** | CRUD productos, control stock, gestionar usuarios, ver órdenes, subir imágenes |

### Middleware de seguridad

- `verifyToken`: valida JWT en header `Authorization: Bearer <token>`
- `isAdmin`: exige `isAdmin: true` en el token
- `isAdminOrSelf`: admin o propio usuario (perfil)

---

## 5. API REST — Endpoints principales

### 5.1 Usuarios (`/api/users`)

| Método | Ruta | Acceso | Descripción |
|--------|------|--------|-------------|
| POST | `/register` | Público | Registro |
| POST | `/login` | Público | Login → JWT |
| GET | `/` | Admin | Listar usuarios |
| GET | `/:id` | Admin o self | Obtener usuario |
| PUT | `/:id` | Admin o self | Actualizar usuario |
| DELETE | `/:id` | Admin | Eliminar usuario |
| POST | `/forgot-password` | Público | Recuperación simulada |

### 5.2 Productos (`/api/products`)

| Método | Ruta | Acceso | Descripción |
|--------|------|--------|-------------|
| GET | `/` | Público | Listar productos |
| GET | `/search?q=` | Público | Buscar |
| GET | `/:id` | Público | Detalle |
| POST | `/upload-image` | Admin | Subir imagen (multipart) |
| POST | `/` | Admin | Crear producto |
| PUT | `/:id` | Admin | Actualizar producto |
| DELETE | `/:id` | Admin | Eliminar producto |
| PATCH | `/adjust-stock/:id` | Admin | Ajustar stock |

### 5.3 Códigos de estado HTTP

| Código | Uso |
|--------|-----|
| 200 | Operación exitosa |
| 201 | Recurso creado |
| 400 | Datos inválidos |
| 401 | No autenticado |
| 403 | Sin permisos / cuenta suspendida |
| 404 | Recurso o ruta no encontrada |
| 500 | Error interno |

El frontend consume estos códigos mediante `utils/httpErrors.js` y muestra mensajes al usuario. Las rutas inexistentes de API devuelven 404 desde el backend; el frontend tiene `/recurso-no-encontrado` para errores de recursos.

---

## 6. Frontend — Estructura y rutas

### 6.1 Rutas públicas

| Ruta | Componente | Descripción |
|------|------------|-------------|
| `/` | HomePage | Destacados + catálogo con filtro |
| `/products` | ProductList | Catálogo completo |
| `/products/:id` | ProductDetail | Detalle de producto |
| `/about` | AboutUs | Quiénes somos |
| `/contact` | Contact | Formulario de contacto |
| `/login` | Login | Inicio de sesión |
| `/register` | Register | Registro |

### 6.2 Rutas administrador

| Ruta | Componente | Descripción |
|------|------------|-------------|
| `/admin` | AdminPage | CRUD productos |
| `/admin/stock` | StockManagementPage | Control de stock |
| `/admin/users` | UserManagementPage | Gestión usuarios |
| `/admin/orders` | AdminOrderHistoryPage | Historial órdenes |

### 6.3 Carga de imágenes

1. Admin selecciona archivo en el modal de producto
2. Frontend envía `POST /api/products/upload-image` (FormData)
3. Backend guarda en `uploads/products/` con Multer
4. Retorna ruta `/uploads/products/<archivo>`
5. Se almacena en MongoDB y se sirve vía `express.static`

---

## 7. Variables de entorno

### Backend (`.env`)

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/control-stock
JWT_SECRET=clave_secreta_larga
CORS_ORIGINS=http://localhost:5173,https://chisato-lib2.netlify.app
```

### Frontend (`.env`)

```env
VITE_API_URL=http://localhost:5000
```

---

## 8. Instalación y ejecución

### Requisitos

- Node.js 18+ LTS
- MongoDB local o MongoDB Atlas
- npm

### Backend

```bash
cd chizatoBack-main
npm install
copy .env.example .env
node initAdmin.js
npm start
```

### Frontend

```bash
cd d-project-main
npm install
copy .env.example .env
npm run dev
```

---

## 9. Validaciones implementadas

### Backend

- Email formato válido y contraseña mín. 6 caracteres en registro
- Stock y precio no negativos
- Ajuste de stock no puede dejar inventario negativo
- Solo admin modifica roles y suspensiones
- Upload: solo imágenes JPG/PNG/WEBP/GIF, máx. 5 MB

### Frontend

- Validación de formularios (registro, contacto, productos)
- Mensajes de error desde respuesta API
- Protección de rutas admin con `ProtectedUserAdmin`

---

## 10. Deploy

| Servicio | Uso |
|----------|-----|
| Netlify | Frontend estático (build Vite) |
| Render | Backend Node.js |
| MongoDB Atlas | Base de datos en producción |

**Nota:** En Render el filesystem es efímero; las imágenes subidas localmente se pierden al reiniciar. Para producción con uploads persistentes se recomienda Cloudinary o S3.

---

## 11. Mockup y gestión del proyecto

- **Mockup visual:** `docs/mockup.html` — wireframes de pantallas principales
- **Tablero Trello:** ver `docs/TRELLO.md` para estructura de columnas y tareas
- **Relevamiento de versiones:** ver `docs/RELEVAMIENTO_VERSIONES.md` — comparativa entre el estado inicial del proyecto y la versión actual

---

## 12. Conclusión

El sistema cumple los requisitos del proyecto académico de Control de Stock: arquitectura desacoplada, autenticación segura, CRUD protegido, control de inventario separado de la gestión de productos, filtro por categorías, gestión de usuarios con suspensión, manejo de errores HTTP y documentación completa.

---

*Para exportar este documento a PDF, ver `docs/GENERAR_PDF.md`.*
