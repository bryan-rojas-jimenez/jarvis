# Informe: Diccionario de Datos - Proyecto JARVIS

## 1. Definición de Diccionario de Datos
Un diccionario de datos es un conjunto de metadatos que contiene las definiciones y características de los elementos de datos que se utilizan en un sistema de información. No almacena los datos en sí, sino la descripción de su estructura, origen, significado, uso y formato.

## 2. Importancia de los Diccionarios de Datos
*   **Consistencia:** Asegura que todos los miembros del equipo utilicen los mismos términos y formatos.
*   **Integridad:** Define reglas de validación (obligatoriedad, tipos) para evitar errores en la base de datos.
*   **Mantenimiento:** Facilita la identificación de impactos al realizar cambios en el esquema del sistema.
*   **Comunicación:** Actúa como un lenguaje común entre analistas, desarrolladores y stakeholders.

## 3. Estructura Sugerida
Para que sea efectivo, un ejemplo de diccionario de datos debe incluir:
*   **Nombre del Campo:** Identificador técnico.
*   **Descripción:** Propósito funcional del dato.
*   **Tipo de Datos:** (String, Integer, Boolean, DateTime, etc.)
*   **Tamaño:** Longitud máxima o precisión.
*   **Ejemplo:** Un valor representativo.
*   **Obligatoriedad:** Indica si el campo admite valores nulos (Null/Not Null).

## 4. Actividad Práctica: Diccionario de Datos Sistema JARVIS
Basado en el análisis de los modelos de Prisma y la lógica de Programación 3 implementada en el sistema.

### Tabla de Diccionario de Datos

| Nombre del Campo | Descripción | Tipo de Datos | Tamaño | Ejemplo | Obligatorio |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id` (User) | Identificador único universal del usuario. | String (UUID) | 36 | `clx123...` | Sí |
| `email` | Dirección de correo para autenticación. | String | 255 | `bryan@jarvis.com` | Sí |
| `name` (Project) | Título del proyecto o tablero Kanban. | String | 100 | `Migración DB` | Sí |
| `status` (Task) | Estado de la tarea en el flujo de trabajo. | Enum/String | 20 | `DONE` | Sí |
| `priority` | Prioridad asignada para el reporte BI. | Enum/String | 10 | `CRITICAL` | Sí |
| `deadline` | Fecha manual de vencimiento de la tarea. | DateTime | N/A | `2026-03-11` | No |
| `action` (Log) | Descripción de la actividad para auditoría. | String | 50 | `USER_LOGIN` | Sí |
| `language` | Preferencia de idioma del sistema (i18n). | String | 5 | `en` | Sí |

---
**Fecha de elaboración:** 11 de Marzo, 2026
**Proyecto:** JARVIS (Programación 3)
