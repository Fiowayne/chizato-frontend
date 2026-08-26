# Frontend — Chisato Zone (Control de Stock)

Aplicación React para catálogo, compras y panel administrador.

**Demo:** https://chisato-lib2.netlify.app  
**Backend API:** https://chizatoback.onrender.com  
**Backend repo:** https://github.com/LeandroVerdun/chizatoBack

## Tecnologías

- React 19 + Vite
- React Router DOM
- Axios
- Bootstrap 5 + CSS personalizado
- jwt-decode

## Funcionalidades

### Público
- Página principal con catálogo y **filtro por categorías**
- Detalle de producto, búsqueda, carrito
- Registro, login, quiénes somos, **contacto**
- Diseño **responsive**

### Usuario autenticado
- Carrito, checkout, historial de compras, perfil

### Administrador
- **Administrar Productos** (`/admin`) — CRUD con carga de imagen
- **Control de Stock** (`/admin/stock`) — sección separada
- **Usuarios** (`/admin/users`) — editar, suspender, eliminar
- **Órdenes** (`/admin/orders`)

## Estructura

```
d-project-main/src/
├── assets/          # Páginas, layout, imágenes
├── component/       # Componentes UI
│   └── admin/       # Panel administrador
├── services/        # API (axios)
├── utils/           # httpErrors, productImage
└── App.jsx          # Rutas
```

## Rutas principales

| Ruta | Descripción |
|------|-------------|
| `/` | Inicio + catálogo filtrable |
| `/products` | Catálogo completo |
| `/contact` | Contacto |
| `/about` | Quiénes somos |
| `/admin` | CRUD productos |
| `/admin/stock` | Control de stock |
| `/admin/users` | Gestión usuarios |
| `/recurso-no-encontrado` | Error 404 desde API |

## Variables de entorno

Copiá `.env.example` a `.env`:

```env
VITE_API_URL=http://localhost:5000
```

Producción (Netlify):

```env
VITE_API_URL=https://chizatoback.onrender.com
```

## Instalación

```bash
npm install
copy .env.example .env
npm run dev
```

Abrir http://localhost:5173

## Build producción

```bash
npm run build
npm run preview
```

Deploy en Netlify: directorio de publicación `dist`, variable `VITE_API_URL` apuntando al backend.

## Imágenes de productos

- **Subir archivo:** se envía al backend y se guarda en `/uploads/products/`
- **URL externa:** sigue soportada
- Helper `getProductImageUrl()` resuelve rutas locales y URLs

## Manejo de errores

- `utils/httpErrors.js` — mensajes centralizados por código HTTP
- Interceptor Axios adjunta `error.userMessage`
- Login y formularios admin muestran mensajes del backend

## Documentación del proyecto

- [Documentación técnica](../docs/DOCUMENTACION_TECNICA.md)
- [Relevamiento versiones](../docs/RELEVAMIENTO_VERSIONES.md)
- [Mockup](../docs/mockup.html) — abrir en navegador
- [Guía Trello](../docs/TRELLO.md)
- [Generar PDF](../docs/GENERAR_PDF.md)

## Credenciales admin (local)

Tras ejecutar `node initAdmin.js` en el backend:

- Email: `chizato@gmail.com`
- Contraseña: `1234`
