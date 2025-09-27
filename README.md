# MenuQR - Aplicación Web para Menús QR

Una aplicación web completa para visualizar menús mediante códigos QR, con funcionalidades de edición y integración con WhatsApp.

## 🚀 Características

- **Visualización interactiva**: Menús visuales similares a cartas físicas
- **Edición segura**: Panel administrativo con autenticación
- **Integración WhatsApp**: Subida directa de fotos al estado
- **Responsive**: Optimizado para dispositivos móviles
- **QR Code**: Acceso rápido mediante códigos QR

## 🛠️ Tecnologías

### Backend
- Node.js
- Express.js
- MongoDB/PostgreSQL
- JWT para autenticación
- WhatsApp Business API

### Frontend
- React.js
- React Router
- Tailwind CSS / Material-UI
- Axios para API calls

### Despliegue
- Vercel (Frontend y Serverless Functions)
- MongoDB Atlas / Vercel Postgres

## 📁 Estructura del Proyecto

```
MenuQR/
├── backend/          # API Node.js/Express
├── frontend/         # Aplicación React
├── docs/            # Documentación
└── README.md
```

## 🚀 Desarrollo

### Backend
```bash
cd backend
npm install
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm start
```

## 📝 Funcionalidades

### Para Usuarios
- [x] Escaneo de QR para acceder al menú
- [x] Visualización interactiva del menú
- [ ] Búsqueda y filtros
- [ ] Información nutricional

### Para Administradores
- [ ] Login seguro con contraseña
- [ ] Edición de menús y productos
- [ ] Subida de imágenes
- [ ] Integración con WhatsApp
- [ ] Análisis de estadísticas

## 🔐 Seguridad

- Autenticación JWT
- Validación de entrada
- Rate limiting
- CORS configurado

## 📱 Uso

1. **Acceso público**: `https://tu-app.vercel.app/{restaurante-id}`
2. **Panel admin**: `https://tu-app.vercel.app/editar/{restaurante-id}`

---
Desarrollado con ❤️ para facilitar la digitalización de menús