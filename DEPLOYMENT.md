# Capy: análisis y despliegue

Revisión realizada el 16 de noviembre de 2026. Fuente inicial: `ec35a5ff0f815dd9fb07d0f5f403f97be32851fa`.

## Resultado publicado

- URL pública: https://capy-gestion.vercel.app
- Estado: READY, producción.
- Deployment: `dpl_4STjXb76YQwaHCb338Q1mqPY3fiw`.
- Compilación en Vercel: 26 segundos, Node 24.22.3.
- Identidad del proyecto: `prj_2nDnKjgqCzA2V9gBZaJBOaRa6u6j`; equipo `team_rt7zaPZlV7yHtdr5jSnIElW5`.
- Paquete reproducible: carpeta vecina `CAPY_VERCEL`, con el commit base fijado y los archivos corregidos bajo `overrides`.
- Se comprobó HTTP 200 sin cookies en la página pública y sus assets. No requiere cuenta de Vercel.
- En producción se verificaron acceso con correo, lectura del perfil, escritura de un gasto de prueba de 750, rutas de consulta, cierre de sesión y protección del dashboard después de salir. La consola del navegador no registró errores durante este recorrido.
- Se revisó visualmente el acceso a 390 × 844 px. Las cuentas, perfiles y credenciales temporales de prueba se eliminaron al finalizar.
- Acceso con Google: requiere autorizar `capy-gestion.vercel.app` en Firebase; se dejó preparada esta acción, pendiente de confirmación.

Las correcciones de código se conservan en este checkout. La integración de GitHub rechazó crear blobs con HTTP 403, pese a que los metadatos del colaborador muestran permiso de push. Por ello, estos cambios no están publicados en GitHub y los pushes no despliegan automáticamente. Esto no afecta a la URL ya publicada.

## Arquitectura

| Área | Implementación |
| --- | --- |
| Interfaz | React 18, TypeScript, Vite, CSS por componente y Tailwind |
| Navegación | React Router con rutas hash (`/#/login`, `/#/dashboard`) |
| Estado | Redux Toolkit: usuario, ingresos, gastos, ahorros y recompensas |
| Identidad | Firebase Authentication: correo/contraseña y Google |
| Persistencia | Firestore, documento `realUsers/{uid}`; `users` es el modelo antiguo |
| Hosting | Proyecto nuevo `capy-gestion` del equipo `itssilvas-projects` en Vercel |
| Backend | El navegador accede directamente a Firebase; no hay servidor propio ni Functions en este repositorio |

## Hallazgos corregidos

- Registro simulado y acceso demo ante cualquier error de autenticación: reemplazados por Firebase real y mensajes de error.
- Sesiones basadas únicamente en un UID de sessionStorage: ahora se espera `onAuthStateChanged` y se protegen todas las rutas privadas.
- Inicio con Google consultaba la colección antigua y no restauraba correctamente la sesión: ahora usa el perfil de `realUsers`.
- Alta de perfil idempotente mediante una transacción: iniciar sesión no sobrescribe los datos existentes.
- Cierre de sesión incompleto y estado compartido entre cuentas: ahora cierra Firebase y reinicia Redux.
- Rutas de ahorros y recompensas inexistentes: se añadieron vistas de consulta con estados vacíos.
- Datos financieros ficticios en el estado inicial y gráfico comparativo: se usan ceros, listas vacías y movimientos reales.
- División por cero en el indicador de ahorro, recursos CSS inexistentes, favicon incorrecto y selector CSS inválido.
- Estilos de escritorio limitados a 1200–1600 px: ampliados y formularios ajustados para móviles.
- Dependencia circular del proyecto sobre sí mismo y herramientas sin uso: eliminadas.
- Dependencias vulnerables: versiones actualizadas y dos dependencias transitivas corregidas mediante overrides. Auditoría final: cero vulnerabilidades conocidas.
- Carga por rutas para separar los gráficos y el dashboard de la página inicial.

## Firebase

Proyecto: `capy-b8cd4`. La configuración web incluida en `Firebase.ts` identifica la aplicación y no es una credencial administrativa.

Correo/contraseña y Google están habilitados. Se inspeccionaron las reglas publicadas: cada usuario solo puede leer y escribir sus documentos de `realUsers` y `users`; `feedback` permite crear opiniones del propio usuario. `firestore.rules` conserva una copia de las reglas observadas; el despliegue web no modifica estas reglas.

Para usar Google desde un dominio nuevo, agregar exclusivamente el dominio final en Authentication → Configuración → Dominios autorizados. No se necesitan claves de servicio de Firebase en Vercel.

## Comprobaciones

```sh
npm ci
npm run check:assets
npm run lint
npm run build
npm audit
```

Se verificaron 318 referencias locales, incluyendo mayúsculas/minúsculas para Linux. Se probó con cuentas temporales la autenticación, creación del perfil, escritura de un gasto desde la interfaz, lectura del propietario y denegación a otras cuentas o visitantes anónimos.

El script `scripts/verify-firebase.mjs` usa cuentas desechables y el SDK cliente. `setup` crea dos cuentas y un archivo local ignorado; después de guardar un gasto cuyo sitio sea `Deployment verification`, `verify` comprueba persistencia y aislamiento; `cleanup` elimina únicamente esas cuentas y perfiles de prueba. No ejecutar estas pruebas de integración como parte del build ni con cuentas reales.

## Configuración de Vercel

- Node 24; npm 12.2.2; instalación `npm ci`; compilación `npm run build`; salida `dist`. El lockfile se generó con npm 12 para incluir las dependencias opcionales de WASI que valida Vercel en Linux.
- `vercel.json` conserva el fallback de SPA. Las rutas existentes siguen usando hash.
- La cuenta conectada no tiene la integración de GitHub autorizada para `salazar2356/CAPY_GESTION`. El despliegue por API puede compilar una revisión pública exacta sin conceder acceso adicional a GitHub. Los pushes no disparan despliegues automáticos mientras no se conecte esa integración.

## Límites funcionales heredados

Publicar el proyecto no completa todos los módulos del prototipo. La interfaz todavía no conecta la creación de tarjetas, edición de perfil/contraseña/avatar, registro de movimientos reales, creación/depósito de ahorros ni canje de recompensas. Los servicios o controles parcialmente presentes no equivalen a funciones terminadas. Las vistas de Savings y Rewards son de consulta. El asistente ofrece mensajes predefinidos. No existe integración bancaria, transferencia de dinero ni entrega de regalos reales.

El planificador sí escribe gastos planeados en Firestore. El diseño mantiene imágenes grandes y un paquete Firebase que supera el aviso de 500 kB; la compilación pasa, pero queda margen para optimizar la carga. El servicio está sujeto a las cuotas de Firebase Spark y Vercel Hobby.
