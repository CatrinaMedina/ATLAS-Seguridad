# 🛡️ ATLAS | Seguridad y Calidad de Software

[![ATLAS - Pruebas automatizadas](https://github.com/CatrinaMedina/ATLAS-Seguridad/actions/workflows/atlas-ci.yml/badge.svg)](https://github.com/CatrinaMedina/ATLAS-Seguridad/actions/workflows/atlas-ci.yml)

**Análisis de seguridad · Pruebas automatizadas · Integración continua**

ATLAS es una plataforma web para gestionar empresas, usuarios, clientes, contratos y documentos. Este repositorio reúne el sistema y las pruebas utilizadas para evaluar su calidad, identificar vulnerabilidades y verificar controles de seguridad.

## 🎯 Objetivo

Comprobar requisitos funcionales y no funcionales, con especial atención a:

- Autenticación mediante JWT y autorización por roles.
- Aislamiento de información entre empresas.
- Protección de datos personales y sensibles.
- Identificación y documentación de vulnerabilidades.
- Pruebas automatizadas y detección de regresiones.

## 🛠️ Tecnologías

| Área | Tecnologías |
| --- | --- |
| Frontend | React, Vite, JavaScript |
| Backend | Node.js, Express |
| Base de datos | PostgreSQL |
| Autenticación | JWT |
| Pruebas automatizadas | Jest, Supertest |
| Pruebas de API | Postman |
| Análisis estático | SonarQube |
| Integración continua | GitHub Actions |

## 📚 Etapas del proyecto

### EP1 · Planificación y pruebas unitarias

Se diseñó el plan de pruebas, se identificaron riesgos y se creó una matriz de trazabilidad. Se ejecutaron **8 pruebas unitarias** con Jest y Supertest.

### EP2 · Integración y análisis de seguridad

Se realizaron pruebas de API e integración con Postman, análisis estático con SonarQube y verificaciones de rendimiento, concurrencia y experiencia móvil. Los hallazgos se documentaron como incidentes.

### EP3 · Seguridad y automatización

Se reforzaron controles de autenticación, autorización y acceso entre empresas en el módulo `empresa_usuarios`. Se incorporaron **9 pruebas de seguridad (SEC-01 a SEC-09)** y se configuró su ejecución automática con GitHub Actions, junto con las pruebas anteriores.

También se documentaron comprobaciones con Postman y un recorrido **End-to-End manual** desde el frontend hasta la API y la base de datos.

## ✅ Resultados verificados

| Indicador | Resultado |
| --- | --- |
| Pruebas automatizadas | **17/17 PASS** |
| Suites | **4/4 PASS** |
| Tiempo de Jest en CI | 17,039 segundos |
| Duración del workflow | Aproximadamente 33 segundos |
| Cobertura de líneas | 48,99% en cuatro módulos instrumentados |

> La cobertura corresponde a los módulos medidos, **no a todo ATLAS**. Algunas pruebas unitarias pasan porque comprueban la existencia de una vulnerabilidad; `PASS` no significa que el sistema completo sea seguro.

🔎 [Consultar ejecución documentada en GitHub Actions](https://github.com/CatrinaMedina/ATLAS-Seguridad/actions/runs/41363091216)

## 🔄 Integración continua

El workflow [`atlas-ci.yml`](.github/workflows/atlas-ci.yml) se ejecuta ante un `push`, un `pull_request` o una activación manual (`workflow_dispatch`).

```text
Cambios en GitHub
       ↓
GitHub Actions
       ↓
Node.js 22 + npm ci
       ↓
Jest + Supertest
       ↓
Resultado de 17 pruebas
```

El pipeline automatiza **las pruebas del backend**. SonarQube se ejecutó por separado durante EP2; no se integraron análisis SCA, escáner DAST ni despliegue automático al workflow.

## 📂 Estructura

```text
ATLAS-Seguridad/
├── .github/
│   └── workflows/
│       └── atlas-ci.yml
├── BACKEND/
│   ├── src/
│   │   ├── __tests__/
│   │   ├── routes/
│   │   ├── app.js
│   │   └── db.js
│   └── package.json
├── FRONTEND/
│   ├── src/
│   └── package.json
└── README.md
```

## 💻 Ejecución local

**Requisitos:** Node.js 22 recomendado, PostgreSQL instalado y base de datos ATLAS inicializada con el esquema original del caso.

### Backend

```bash
git clone https://github.com/CatrinaMedina/ATLAS-Seguridad.git
cd ATLAS-Seguridad/BACKEND
npm ci
```

Configurar las variables de entorno en un archivo `.env` local (sin subirlo al repositorio):

```dotenv
DATABASE_URL=postgresql://usuario:clave@localhost:5432/atlas
JWT_SECRET=definir_un_secreto_local_seguro
PORT=4000
```

Iniciar el servidor:

```bash
npm start
```

### Frontend

Desde la raíz del repositorio:

```bash
cd FRONTEND
npm ci
npm run dev
```

> El repositorio no incluye el script original para inicializar la base de datos. Para ejecutar todos los flujos es necesario disponer de ese esquema.

### Pruebas

Desde la carpeta `BACKEND`:

```bash
npx jest --runInBand
```

Para obtener cobertura local:

```bash
npx jest --runInBand --coverage
```

## 🔐 Hallazgos y mejoras

Las evaluaciones identificaron riesgos que requieren seguimiento, entre ellos:

- Contraseñas almacenadas sin hashing seguro.
- Credenciales de conexión incluidas en el código.
- Autorización insuficiente en determinados módulos.
- Datos sensibles sin protección adecuada en reposo.
- Validación de entradas y auditoría incompletas.

En EP3 se verificaron mejoras puntuales en `empresa_usuarios`, pero **no se corrigieron todas las vulnerabilidades de ATLAS**.

Como mejoras propuestas se consideran el tratamiento de los incidentes pendientes, la ampliación de cobertura y la incorporación de análisis de dependencias (SCA) y pruebas dinámicas automatizadas (DAST).

## ⚠️ Aviso de seguridad

Este repositorio contiene código utilizado para análisis y pruebas de seguridad. **No está preparado para producción ni para procesar datos personales reales** sin corregir y volver a verificar los hallazgos documentados.

---

**ATLAS · Pruebas, seguridad, automatización y mejora continua**
