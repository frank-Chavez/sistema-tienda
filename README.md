# E.F.D. - Tienda Naturista Online

Plataforma de comercio electrónico especializada en productos naturales, orgánicos y de bienestar. Un sistema completo construido con Astro, Firebase y Tailwind CSS.

## 🌐 Sitio en Producción

**URL:** https://tienda-naturista-efd.netlify.app/

## ✨ Características Principales

### Para Clientes

- 🛍️ Catálogo completo de productos naturales y orgánicos
- 🔍 Filtrado de productos por categorías
- 🛒 Carrito de compras con persistencia en localStorage
- 👤 Autenticación y registro con Firebase
- 📱 Diseño completamente responsive (desktop y móvil)
- 📞 Integración directa con WhatsApp para pedidos
- 🗺️ Ubicación en Google Maps
- ✅ Órdenes guardadas en Firestore

### Para Administradores

- 📊 Dashboard administrativo protegido
- ➕ Gestión completa de productos (crear, editar, eliminar)
- 📂 Administración de categorías
- 👥 Gestión de usuarios del sistema
- 📦 Seguimiento de pedidos
- 🔐 Control de acceso por roles

## 🛠️ Tecnologías Utilizadas

- **Framework:** Astro 4.x
- **Autenticación:** Firebase Auth
- **Base de Datos:** Firestore (Firebase)
- **Frontend:** Tailwind CSS + HTML5
- **Estado:** Stores personalizados con localStorage
- **Hosting:** Netlify
- **Integración:** WhatsApp Web API, Google Maps

## 📁 Estructura del Proyecto

Vea los detalles de estructura en [logs de sistema].

## 🚀 Comandos

| Comando           | Descripción                            |
| ----------------- | -------------------------------------- |
| `npm install`     | Instala las dependencias necesarias    |
| `npm run dev`     | Inicia el servidor de desarrollo local |
| `npm run build`   | Compila la aplicación para producción  |
| `npm run preview` | Previsualizá el build localmente       |

## 🔐 Autenticación y Seguridad

- ✅ Autenticación con Firebase Auth (email/password)
- ✅ Protección de rutas administrativas con AdminGuard
- ✅ Verificación de rol admin en cliente y servidor
- ✅ Datos de usuario almacenados de forma segura en Firestore
- ✅ Tokens de sesión en localStorage (con control de expirabilidad)

## 📊 Módulos Principales

### Catálogo de Productos

- Visualización de todos los productos
- Filtrado por categorías
- Búsqueda y ordenamiento
- Imágenes optimizadas (object-contain para ver producto completo)
- Stock en tiempo real

### Carrito de Compras

- Adición/eliminación de productos
- Actualización de cantidades
- Persistencia en localStorage
- Integración con WhatsApp para finalizar pedidos
- Cálculo automático de totales

### Panel Administrativo

- Acceso solo para usuarios con rol "admin"
- Gestión de inventario
- Seguimiento de órdenes
- Administración de usuarios y categorías

## 📱 Contacto y Soporte

**WhatsApp:** +51 975279174  
**Email:** elsachavez9752@gmail.com  
**Ubicación:** Santarrosa Señor de los milagros

Mensaje de contacto predefinido:  
_"Hola, quisiera información sobre sus consultas y productos. ¿Tienen disponibilidad?"_

## 📝 Notas Importantes

- El sistema usa localStorage para mantener el carrito entre sesiones
- Las imágenes de productos usan `object-contain` para mostrarse completas
- Los pedidos se envían a través de WhatsApp Web
- El panel admin requiere ser registrado como usuario con rol administrador
- Firebase debe estar configurado correctamente en `src/lib/firebase.js`

## 🔧 Configuración Necesaria

Para ejecutar localmente, necesitas:

1. Configurar las variables de entorno de Firebase
2. Tener una base de datos Firestore creada
3. Habilitar autenticación por email en Firebase Console
4. Las colecciones necesarias: usuarios, productos, categorías, pedidos

## 📄 Licencia

Todos los derechos reservados © E.F.D. 2026

---

**Desarrollado con ❤️ usando Astro, Firebase y Tailwind CSS**
