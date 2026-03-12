# Bitácora de Desarrollo del Sistema JARVIS
**Materia:** Programación 3  
**Proyecto:** Sistema de Gestión de Tareas y Proyectos  
**Fecha de Inicio:** 15 de Febrero, 2026

---

## 📅 Día 1: Inicialización y Arquitectura

### 1. Selección de Tecnologías
Para cumplir con los requisitos de escalabilidad, seguridad y modernidad, el equipo ha seleccionado el siguiente stack tecnológico:
- **Frontend:** Next.js 14 (React) con TypeScript.
- **Estilos:** Tailwind CSS y Shadcn/UI para una interfaz profesional.
- **Backend:** Server Actions de Next.js (Arquitectura Serverless).
- **Base de Datos:** SQLite (Desarrollo) gestionada con Prisma ORM.

### 2. Estructura de la Base de Datos
Se ha diseñado un esquema relacional normalizado con las siguientes entidades:
- **User:** Gestión de usuarios con roles (ADMIN/USER) y contraseñas encriptadas.
- **Project:** Contenedor principal de tareas, con estados y fechas.
- **Task:** Unidad de trabajo con prioridades, fechas límite y asignación a usuarios.
- **AuditLog:** Tabla de seguridad para registrar todas las acciones del sistema (quién hizo qué y cuándo).

### 3. Evidencia de Código (Schema)
El modelo de datos se ha definido utilizando Prisma Schema Language (PSL):

```prisma
model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  role      String   @default("USER")
  // ...
}

model Task {
  id          Int      @id @default(autoincrement())
  title       String
  status      String   @default("TODO")
  priority    String   @default("MEDIUM")
  // ...
}
```

### 4. Hitos Alcanzados
- [x] Creación del repositorio y estructura de carpetas.
- [x] Configuración del entorno de desarrollo (Node.js, Git).
- [x] Diseño del Diagrama Entidad-Relación (ERD).
- [x] Ejecución de la primera migración de base de datos (`init_db_structure`).

---

## 📅 Día 2: Autenticación y Seguridad

### 1. Implementación de Páginas de Acceso
Se han creado las interfaces de usuario para el control de acceso:
- **Login:** `/login` con validación de credenciales.
- **Registro:** `/register` con encriptación de contraseñas mediante `bcryptjs`.

### 2. Lógica de Negocio (Server Actions)
Se implementaron `registerAction` y `loginAction` en `src/app/actions.ts`:
- Validación de campos requeridos.
- Verificación de duplicados en base de datos.
- Generación de logs de auditoría automáticos.
- Gestión de sesiones seguras con JWT (`jose`).

### 3. Hitos Alcanzados
- [x] Actualización de metadatos del proyecto.
- [x] Creación de utilidades de base de datos y autenticación.
- [x] Desarrollo de flujos de Registro e Inicio de Sesión.
- [x] Implementación de Middleware de seguridad para proteger rutas privadas.

---

## 📅 Día 3: Gestión de Proyectos y Tareas (Kanban)

### 1. Módulo de Proyectos
Se ha implementado el ciclo de vida básico de los proyectos:
- **Dashboard Dinámico:** Ahora muestra los proyectos reales desde SQLite.
- **Creación de Proyectos:** Formulario en modal con revalidación de datos en tiempo real.
- **Autorización:** Los usuarios solo pueden ver y gestionar sus propios proyectos.

### 2. Sistema de Tareas (Tablero Kanban)
Se desarrolló una interfaz de gestión de tareas intuitiva:
- **Organización por Columnas:** To Do, In Progress y Done.
- **Cambio de Estado:** Botones rápidos para mover tareas entre columnas.
- **Prioridades:** Clasificación visual (Urgent, High, Medium, Low) con códigos de color.
- **Registro de Auditoría:** Cada tarea creada o movida genera un log automático para trazabilidad.

### 3. Hitos Alcanzados
- [x] Corrección de estabilidad del ORM Prisma (v5.22).
- [x] Implementación de `createProjectAction` y `createTaskAction`.
- [x] Creación de la página de detalles del proyecto con tablero Kanban.
- [x] Integración de iconos profesionales con `lucide-react`.

---

## 📅 Día 4: Auditoría y Trazabilidad del Sistema

### 1. Módulo de Auditoría (Audit Logs)
Para cumplir con los requisitos de seguridad y control, se ha implementado un sistema de registro de eventos:
- **Visualización Centralizada:** Nueva ruta `/audit` que muestra un historial cronológico de todas las acciones importantes.
- **Detalle de Usuario:** El sistema vincula cada acción con el usuario responsable (Nombre/Email).
- **Trazabilidad:** Registro de:
    *   Inicios de sesión y registros de nuevos usuarios.
    *   Creación de proyectos.
    *   Gestión de tareas (creación y cambios de estado).
- **Interfaz Profesional:** Lista estilizada con sellos de tiempo (Timestamps) e iconos intuitivos.

### 2. Hitos Alcanzados
- [x] Creación de la página `/audit` con consulta optimizada a SQLite.
- [x] Integración de navegación entre Dashboard y Auditoría.
- [x] Validación de seguridad: solo usuarios autenticados pueden ver los logs.

---

## 📅 Día 5: CRUD Completo y Refinamiento de UI

### 1. Gestión Avanzada de Datos (Update & Delete)
Se completó el ciclo de vida de la información en el sistema:
- **Edición de Proyectos:** Los usuarios ahora pueden modificar el nombre, descripción y estado (Active/Completed/Archived) de sus proyectos.
- **Eliminación Segura:** Implementación de borrado de proyectos con confirmación, incluyendo la eliminación en cascada de sus tareas asociadas.
- **Gestión de Tareas:** Se añadió la capacidad de editar el título, descripción y prioridad de las tareas existentes, así como su eliminación definitiva.

### 2. Mejoras en la Experiencia de Usuario (UX)
- **Modales Reutilizables:** Optimización de componentes para manejar tanto la creación como la edición de registros.
- **Feedback Visual:** Implementación de estados de "hover" y transiciones de opacidad para los botones de gestión.
- **Logs de Auditoría Detallados:** Cada edición y eliminación queda registrada con el ID del objeto afectado para máxima trazabilidad.

### 3. Hitos Alcanzados
- [x] Implementación de `updateProjectAction`, `deleteProjectAction`, `updateTaskAction` y `deleteTaskAction`.
- [x] Refactorización de `ProjectForm` y `TaskBoard` para soportar edición.
- [x] Verificación de la integridad de los datos en SQLite tras operaciones de borrado.

---

## 📅 Día 6: Colaboración y Asignación de Tareas

### 1. Sistema de Asignación Multi-usuario
Se ha extendido el modelo de tareas para permitir el trabajo colaborativo:
- **Selector de Responsables:** Al crear o editar una tarea, el sistema ahora permite seleccionar a cualquier usuario registrado de una lista dinámica.
- **Visualización de Responsables:** Cada tarjeta en el tablero Kanban muestra visualmente quién es la persona asignada mediante etiquetas con iconos intuitivos.
- **Relaciones de Base de Datos:** Se optimizaron las consultas de Prisma para incluir la información de los usuarios asignados (join entre tablas Task y User).

### 2. Refinamiento de Trazabilidad
- **Logs de Asignación:** El sistema de auditoría ahora registra específicamente a quién se le asignó cada tarea, permitiendo un seguimiento claro de las responsabilidades dentro de cada proyecto.

### 3. Hitos Alcanzados
- [x] Actualización de `createTaskAction` y `updateTaskAction` para soportar `assigneeId`.
- [x] Implementación de lógica de selección de usuarios en `TaskBoard`.
- [x] Mejora visual de las tarjetas Kanban con badges de usuario.

---

## 📅 Día 7: Búsqueda Avanzada y Filtrado Dinámico

### 1. Sistema de Búsqueda (Global y Local)
Se implementó una lógica de búsqueda reactiva en los puntos clave de la aplicación:
- **Dashboard de Proyectos:** Los usuarios pueden filtrar su lista de proyectos por nombre o descripción mediante una barra de búsqueda en tiempo real.
- **Tablero Kanban:** Integración de un buscador de tareas que permite localizar rápidamente cualquier actividad dentro de un proyecto específico.

### 2. Filtros de Estado y Prioridad
Se añadieron controles de filtrado para mejorar la organización visual:
- **Filtro por Estado:** En el Dashboard, los proyectos pueden filtrarse por su estado actual (Active, Completed, Archived).
- **Filtro por Prioridad:** En el tablero Kanban, se habilitó un selector para visualizar únicamente las tareas con una prioridad específica (Urgent, High, Medium, Low).
- **Limpieza de Filtros:** Implementación de botones rápidos para restablecer los criterios de búsqueda y visualización.

### 3. Hitos Alcanzados
- [x] Desarrollo de lógica de filtrado en el cliente para mayor velocidad de respuesta.
- [x] Mejora visual de la barra de herramientas (Toolbar) con iconos de `lucide-react`.
- [x] Implementación de estados vacíos (Empty States) dinámicos basados en los resultados de búsqueda.

---

## 📅 Día 8: Panel de Estadísticas y Análisis Visual

### 1. Cuadro de Mando (Dashboard) de Inteligencia
Se implementó un módulo de visualización de datos para ofrecer una visión global del progreso:
- **Indicadores Clave (KPIs):** Tarjetas de resumen con el conteo total de proyectos, tareas en progreso, tareas completadas y tareas urgentes.
- **Gráficos Dinámicos:** Integración de la librería `recharts` para representar la distribución de carga de trabajo.
- **Análisis por Estado:** Gráfico de barras que muestra la cantidad de tareas en cada etapa del flujo (To Do, In Progress, Done).
- **Análisis por Prioridad:** Gráfico horizontal que identifica visualmente los cuellos de botella mediante la clasificación de prioridades.

### 2. Optimización de Consultas (Server-side)
- **Agregación de Datos:** Uso de funciones avanzadas de Prisma (`groupBy` y `_count`) para calcular estadísticas directamente en la base de datos, garantizando rapidez incluso con grandes volúmenes de información.
- **Renderizado Adaptativo:** Los gráficos se ajustan automáticamente al tamaño de la pantalla y solo se cargan en el cliente para optimizar el rendimiento (No-SSR pattern).

### 3. Hitos Alcanzados
- [x] Creación del componente `DashboardStats` con soporte para múltiples tipos de gráficos.
- [x] Actualización de la lógica del servidor para proveer datos estadísticos en tiempo real.
- [x] Mejora estética del Dashboard con un diseño más orientado a "Business Intelligence".

---

## 📅 Día 9: Control de Acceso basado en Roles (RBAC)

### 1. Implementación de Jerarquía de Usuarios
Se introdujo un sistema de permisos para diferenciar las capacidades de los usuarios:
- **Rol ADMIN:** Posee acceso total al sistema, incluyendo la capacidad de ver el módulo de Auditoría Global para supervisar todas las acciones de todos los usuarios.
- **Rol USER:** Limitado a la gestión de sus propios proyectos y tareas. No tiene acceso visual ni por ruta a los logs del sistema.
- **Asignación Automática:** El sistema detecta al primer usuario registrado y le otorga el rol de `ADMIN` para facilitar la gestión inicial.

### 2. Seguridad a Nivel de Ruta y UI
- **Protección de Rutas:** Implementación de validaciones en el lado del servidor para bloquear el acceso a `/audit` si el rol no es autorizado.
- **Interfaz Condicional:** El menú de navegación se adapta dinámicamente, mostrando u ocultando opciones críticas según los privilegios del usuario autenticado.

### 3. Hitos Alcanzados
- [x] Actualización de la lógica de registro para soportar roles dinámicos.
- [x] Implementación de guardias de seguridad en la página de auditoría.
- [x] Refactorización de componentes cliente para renderizado basado en roles.

---

## 📅 Día 10: Gestión de Perfiles y Estructura Organizativa

### 1. Perfil de Usuario y Datos Personales
Se implementó un módulo dedicado para que los usuarios gestionen su identidad dentro de la plataforma:
- **Gestión de Identidad:** Nueva página `/profile` con una interfaz moderna y profesional.
- **Puestos de Trabajo (Job Positions):** Se extendió el modelo de datos para permitir que los usuarios definan su cargo o rol dentro de la organización.
- **Visualización de Permisos:** El perfil muestra de forma transparente el nivel de acceso del usuario (Administrador vs. Usuario Estándar).

### 2. Refinamiento de la Lógica de Administración
- **Seguridad por Email:** Se configuró el sistema para reconocer automáticamente a `bryan-rojas@hotmail.com` como el Administrador Principal de la plataforma, independientemente del orden de registro.
- **Persistencia de Sesión:** Al actualizar el nombre en el perfil, la sesión se refresca automáticamente para reflejar los cambios en toda la aplicación sin necesidad de cerrar sesión.

### 3. Hitos Alcanzados
- [x] Migración de base de datos para añadir el campo `position` a la tabla `User`.
- [x] Creación de `updateProfileAction` con registro de auditoría.
- [x] Implementación de navegación intuitiva hacia el perfil desde el Dashboard principal.

---

## 📅 Día 11: Espacio Personal y Navegación Universal

### 1. Espacio de Trabajo Dedicado (My Tasks)
Se introdujo una nueva dimensión de productividad para el usuario individual:
- **Vista Unificada:** Nueva sección `/my-tasks` que consolida todas las tareas asignadas al usuario desde múltiples proyectos en una sola lista inteligente.
- **Enfoque en Pendientes:** El sistema filtra automáticamente las tareas completadas, permitiendo que el usuario se centre exclusivamente en su carga de trabajo activa.
- **Acceso Rápido:** Integración de enlaces directos para saltar del workspace personal al tablero Kanban del proyecto original en un solo clic.

### 2. Estándar de Navegación Universal (UX)
Para mejorar la usabilidad y reducir la carga cognitiva, se rediseñó el sistema de navegación:
- **Botón Home/Dashboard:** Se implementó un botón de acceso directo al Dashboard principal en todas las ventanas de la plataforma (Perfil, Auditoría, Proyectos, Workspace).
- **Consistencia Visual:** Unificación de la barra de navegación superior (Navbar) para mantener una identidad de marca coherente en toda la experiencia.
- **Migración a la Nube (Vercel):** El proyecto ahora es compatible con entornos Serverless mediante el uso de Neon PostgreSQL y scripts de autogeneración de Prisma.

### 3. Hitos Alcanzados
- [x] Implementación de la ruta `/my-tasks` con lógica de filtrado cruzado.
- [x] Unificación de Navbars en toda la arquitectura del Frontend.
- [x] Configuración de `build scripts` para despliegue continuo en Vercel.

---

## 📅 Día 12: Despliegue en Producción y Refinamiento Estético Final

### 1. Despliegue Cloud (Vercel + Neon)
El sistema ha migrado de un entorno local a una infraestructura profesional en la nube:
- **Base de Datos:** Migración exitosa de SQLite a **PostgreSQL (Neon.tech)**, garantizando persistencia de datos y concurrencia.
- **CI/CD:** Configuración de despliegue automático mediante GitHub Actions y Vercel, permitiendo actualizaciones en tiempo real.
- **Seguridad en Producción:** Implementación de variables de entorno y encriptación SSL para todas las conexiones a la base de datos.

### 2. Rediseño Visual de Alta Fidelidad (UI/UX)
Se realizó una transformación total de la interfaz para alcanzar un estándar de producto comercial:
- **Nueva Identidad Visual:** Adopción de una paleta de colores profesional (Indigo/Slate) con un sistema de diseño coherente.
- **Experiencia de Usuario:** Implementación de micro-interacciones, sombras con profundidad y bordes extra redondeados para una sensación moderna.
- **Optimización de Accesos:** Rediseño completo de las páginas de Login y Registro para una bienvenida impactante.

### 3. Hitos Alcanzados
- [x] Configuración exitosa de `Prisma Client` para entornos Serverless en Vercel.
- [x] Unificación del Navbar con botones de navegación rápida (Home/Dashboard).
- [x] Lanzamiento oficial de la plataforma en la web.

---

## 📅 Día 13: Colaboración de Proyectos en Tiempo Real

### 1. Sistema de Membresía Multi-usuario
Se transformó la arquitectura del sistema para permitir el trabajo en equipo real:
- **Relaciones Muchos-a-Muchos:** El modelo de datos ahora permite que un proyecto tenga múltiples colaboradores simultáneos.
- **Gestión de Miembros:** Los dueños de los proyectos pueden buscar usuarios registrados por nombre o email y agregarlos instantáneamente a su equipo.
- **Dashboard Colaborativo:** El panel principal ahora consolida tanto los proyectos creados por el usuario como aquellos en los que ha sido invitado a colaborar.

### 2. Control de Acceso y Seguridad Compartida
- **Autorización Granular:** Se implementó una lógica de seguridad que valida la identidad del usuario contra la lista de miembros del proyecto antes de conceder acceso a los datos.
- **Trazabilidad de Equipo:** Las acciones realizadas por los colaboradores quedan registradas en el Audit Log, permitiendo saber quién agregó a quién y qué cambios se realizaron en el equipo.

### 3. Hitos Alcanzados
- [x] Migración de base de datos para la tabla `ProjectMember`.
- [x] Implementación de Server Actions para gestión de miembros.
- [x] Unificación de la vista de proyectos (Propios + Compartidos) en el Dashboard.

---

## 📅 Día 14: Gestión de Tiempos y Fechas Límite (Deadlines)

### 1. Sistema de Vencimiento Opcional
Se implementó una funcionalidad avanzada para el control de cronogramas:
- **Deadlines Manuales:** Tanto proyectos como tareas ahora cuentan con un selector de fecha opcional. El usuario puede decidir si un elemento tiene una fecha de expiración o si es de duración abierta.
- **Selector de Calendario:** Integración de un control dinámico que permite elegir fechas de forma visual, minimizando errores de entrada.
- **Alertas de Tiempo:** Las tarjetas del Dashboard y del Kanban muestran automáticamente la fecha de vencimiento con una codificación de color inteligente (Rojo si el plazo ha vencido).

### 2. Actualización de Infraestructura
- **Extensión del Modelo:** Actualización del esquema Prisma para soportar el campo `dueDate` en la entidad `Project`.
- **Lógica de Servidor Robusta:** Las Server Actions fueron optimizadas para procesar fechas de forma segura y registrarlas en el historial de auditoría.

### 3. Hitos Alcanzados
- [x] Implementación de toggles de activación para fechas límite.
- [x] Visualización de "Deadlines" en tarjetas de proyecto y tablero Kanban.
- [x] Sincronización exitosa con la base de datos PostgreSQL en la nube.

---

## 📅 Día 15: Generación de Reportes y Auditoría de Proyecto

### 1. Sistema de Reportes Ejecutivos
Se implementó un módulo profesional para la exportación de resultados:
- **Vista de Reporte Formal:** Nueva página `/projects/[id]/report` diseñada específicamente para impresión y exportación a PDF.
- **Resumen Ejecutivo:** Generación automática de métricas de progreso (KPIs) mediante gráficos circulares dinámicos.
- **Inventario de Tareas:** Listado estructurado de todas las actividades, responsables, prioridades y fechas límite en formato tabular.
- **Hoja de Firmas y Validación:** El reporte incluye sellos de tiempo y detalles del equipo autorizado para su presentación formal.

### 2. Optimización de Navegación de Reportes
- **Acceso Contextual:** Integración de un botón "Project Report" en la barra de navegación de cada proyecto para un acceso inmediato.
- **Lógica de Impresión:** Optimización mediante CSS (media queries) para ocultar elementos innecesarios durante la exportación física del documento.

### 3. Hitos Alcanzados
- [x] Creación de la arquitectura de reportes dinámicos.
- [x] Implementación de lógica de cálculo de porcentajes de avance en el servidor.
- [x] Sincronización final de todos los hitos en el repositorio de producción.

---

## 📅 Día 16: Estabilización de Arquitectura y Reportes Híbridos

### 1. Resolución de Excepciones del Servidor
Se identificó y resolvió un conflicto crítico de arquitectura en el módulo de reportes:
- **Arquitectura Híbrida (SSR + CSR):** Se refactorizó la generación de reportes para separar la lógica de obtención de datos (Server-side) de la lógica interactiva de impresión (Client-side). Esto eliminó las excepciones en tiempo de ejecución en entornos de producción (Vercel).
- **Programación Defensiva:** Implementación de "Optional Chaining" y valores de respaldo (fallbacks) en todo el motor de reportes para garantizar que el sistema nunca falle ante datos incompletos o nulos en la base de datos.

### 2. Refinamiento de Accesos y Seguridad
- **Permisos de Reporte:** Se expandió la lógica de autorización para permitir que tanto los dueños de proyectos como los Administradores Globales puedan auditar los resultados mediante el nuevo módulo.
- **Sincronización de Base de Datos:** Optimización de las consultas relacionales en Neon PostgreSQL para mejorar la velocidad de carga de los documentos ejecutivos.

### 3. Hitos Alcanzados
- [x] Creación del componente `ReportView` para manejo de eventos del DOM en Next.js.
- [x] Corrección de la lógica de revalidación de caché en reportes dinámicos.
- [x] Sincronización exitosa del repositorio final con las correcciones de estabilidad.

---

## 📅 Día 17: Globalización y Comunicación Proactiva

### 1. Sistema Multi-idioma (i18n) con Detección Automática
Se implementó una arquitectura de internacionalización para hacer el sistema accesible globalmente:
- **Detección Automática:** El sistema ahora identifica el idioma del navegador del usuario y ajusta la interfaz (Español/Inglés) automáticamente.
- **Selector de Idioma Dinámico:** Inclusión de controles en tiempo real para alternar entre idiomas sin recargar la página.
- **Diccionarios Centralizados:** Implementación de archivos JSON de traducción para garantizar la consistencia en todos los módulos (Dashboard, Kanban, Reportes).

### 2. Sistema de Notificaciones In-App
Para mejorar el flujo de trabajo colaborativo, se desarrolló un motor de avisos internos:
- **Campana de Notificaciones:** Interfaz visual con contador de mensajes no leídos y estados pulsantes para alertas críticas.
- **Disparadores Automáticos:** Generación de notificaciones al asignar tareas o invitar colaboradores a proyectos.
- **Persistencia de Alertas:** Los mensajes se almacenan en PostgreSQL para que el usuario pueda consultarlos en cualquier momento.

### 3. Hitos Alcanzados
- [x] Creación del `LanguageProvider` y lógica de contexto global.
- [x] Migración de base de datos para la tabla `Notification`.
- [x] Unificación de la experiencia de usuario (UX) con navegación y alertas globales.

---

## 📅 Día 18: Implementación de Acceso Maestro (God Mode)

### 1. Sistema de Super-Administración "God Mode"
Se ha implementado una capa de acceso de alto nivel diseñada exclusivamente para la supervisión global del sistema:
- **Visibilidad Total:** El usuario `bryan-rojas@hotmail.com` ahora tiene la capacidad de visualizar **todos los proyectos** registrados en la plataforma, independientemente de quién sea el dueño o los miembros asignados.
- **Bypass de Seguridad:** Se modificó la lógica de autorización en el Dashboard, la Vista Kanban y los Reportes para permitir el acceso administrativo sin restricciones de membresía.
- **Acciones Administrativas Extendidas:** El modo Dios permite realizar acciones críticas en proyectos ajenos, como la eliminación de proyectos, gestión de tareas y administración de colaboradores (añadir/quitar miembros).

### 2. Interfaz de Usuario y Auditoría Especializada
- **Indicador Visual de Seguridad:** Se implementó un banner superior de advertencia (color ámbar) que se activa automáticamente al entrar en Modo Dios, alertando al administrador sobre su nivel de acceso.
- **Trazabilidad de Acciones Maestro:** Todas las operaciones realizadas bajo este modo se registran en el Audit Log con la etiqueta especial `[GOD MODE]`, garantizando que el uso de estos privilegios sea auditable y transparente.
- **Estadísticas Globales:** El Dashboard de inteligencia ahora refleja métricas de todo el ecosistema (Total de tareas y proyectos en la plataforma) cuando el Super-Admin inicia sesión.

### 3. Hitos Alcanzados
- [x] Implementación de lógica condicional en `Server Actions` para reconocimiento de Super-Admin.
- [x] Actualización del Dashboard para soporte de visualización global.
- [x] Inyección de privilegios de "Owner" virtuales en la vista de detalles del proyecto.
- [x] Registro de logs de auditoría especializados para acciones de God Mode.

---

## 📅 Día 19: Recuperación de Accesos y Documentación Técnica (Diccionarios)

### 1. Sistema de Recuperación de Contraseña
Se ha implementado un flujo de seguridad crítico para la recuperación de cuentas:
- **Página de Recuperación:** Nueva ruta `/forgot-password` que permite a los usuarios restablecer sus credenciales de forma autónoma.
- **Validación de Identidad:** El sistema verifica la existencia del correo electrónico antes de permitir cualquier cambio, evitando enumeración de usuarios.
- **Audit Logs de Seguridad:** Cada restablecimiento de contraseña queda registrado en el sistema de auditoría para prevenir y monitorear accesos no autorizados.

### 2. Estandarización de Datos (Diccionario de Datos)
Para cumplir con los estándares de ingeniería de software y la documentación académica:
- **Análisis de Metadatos:** Se elaboró un Diccionario de Datos completo que documenta los 8 campos críticos del sistema (User ID, Email, Task Status, etc.).
- **Formalización:** Creación de documentos técnicos en formato Markdown y Word para la entrega y discusión del grupo de trabajo.
- **Integración:** El diccionario ha sido añadido al repositorio como parte de la documentación técnica oficial del proyecto.

### 3. Hitos Alcanzados
- [x] Implementación de `resetPasswordAction` con encriptación bcrypt.
- [x] Creación de la UI de recuperación con enlace desde el Login.
- [x] Generación y commit del Diccionario de Datos (`Diccionario_de_Datos_JARVIS.md`).
- [x] Actualización general del repositorio y documentación de bitácora.

---
*Documento generado automáticamente por el Asistente de Desarrollo.*
