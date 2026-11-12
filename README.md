🛡️ ATLAS | Seguridad y Calidad de Software

"GitHub Actions" (https://github.com/CatrinaMedina/ATLAS-Seguridad/actions/workflows/atlas-ci.yml/badge.svg)

Análisis de seguridad · Pruebas automatizadas · Integración continua

ATLAS es una plataforma web orientada a la gestión de empresas, usuarios, clientes, contratos y documentos.

Este repositorio contiene el código utilizado para evaluar la calidad y seguridad del sistema, identificar vulnerabilidades, ejecutar pruebas y automatizar verificaciones.

---

🎯 Objetivo del proyecto

Evaluar el comportamiento de ATLAS frente a requisitos funcionales, no funcionales y de seguridad mediante pruebas documentadas y herramientas de aseguramiento de calidad.

Se consideran especialmente:

- Autenticación mediante JWT.
- Control de acceso según roles.
- Separación de información entre empresas.
- Protección de datos sensibles.
- Detección y documentación de vulnerabilidades.
- Automatización de pruebas y regresión.

🛠️ Tecnologías utilizadas

Área| Tecnologías
Frontend| React, Vite, JavaScript
Backend| Node.js, Express
Base de datos| PostgreSQL
Autenticación| JWT
Pruebas automatizadas| Jest, Supertest
Pruebas de API| Postman
Análisis estático| SonarQube
Integración continua| GitHub Actions
Control de versiones| Git y GitHub

📚 Etapas del proyecto

EP1 — Planificación y pruebas unitarias

Se definió la estrategia de pruebas a partir de los requisitos del sistema.

Resultados principales:

- Identificación de riesgos de seguridad y calidad.
- Diseño de casos de prueba y matriz de trazabilidad.
- Ejecución de ocho pruebas unitarias con Jest y Supertest.

EP2 — Integración y análisis de seguridad

Se amplió la evaluación mediante pruebas sobre la API, navegación de la interfaz y análisis estático del código.

Actividades desarrolladas:

- Pruebas de integración con Postman.
- Análisis de código con SonarQube.
- Verificación de rendimiento y concurrencia.
- Registro y clasificación de incidentes.
- Actualización de la trazabilidad de requisitos.

EP3 — Seguridad y automatización

Se reforzaron controles de autorización en el módulo "empresa_usuarios" y se incorporaron pruebas automatizadas de seguridad.

Resultados verificados:

- Nueve pruebas de seguridad adicionales ("SEC-01" a "SEC-09").
- Un total de 17 pruebas automatizadas aprobadas.
- Cuatro suites de pruebas ejecutadas correctamente.
- Pipeline de integración continua implementado con GitHub Actions.
- Validaciones manuales con Postman y recorrido End-to-End del sistema.

✅ Resultados de automatización

Indicador| Resultado
Pruebas automatizadas| 17/17 PASS
Suites de pruebas| 4/4 PASS
Tiempo de ejecución Jest en CI| 17,039 segundos
Duración del workflow| Aproximadamente 33 segundos
Cobertura de líneas| 48,99% en cuatro módulos instrumentados

La cobertura indicada corresponde únicamente a los módulos incluidos en la medición, no a todo el repositorio.

Evidencia: "Consultar ejecución de GitHub Actions" (https://github.com/CatrinaMedina/ATLAS-Seguridad/actions/runs/41363091216).

🔄 Integración continua

El workflow se encuentra en:

".github/workflows/atlas-ci.yml"

Se activa mediante:

- "push": al enviar cambios al repositorio.
- "pull_request": al proponer cambios.
- "workflow_dispatch": mediante ejecución manual.

El pipeline configura Node.js 22, instala las dependencias con "npm ci" y ejecuta las pruebas mediante Jest.

Esto permite repetir automáticamente los escenarios cubiertos y detectar posibles regresiones.

📂 Estructura del repositorio

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

💻 Ejecución local

Requisitos

- Node.js 22 recomendado.
- PostgreSQL configurado.
- Base de datos ATLAS inicializada con el esquema del proyecto.

Backend

git clone https://github.com/CatrinaMedina/ATLAS-Seguridad.git
cd ATLAS-Seguridad/BACKEND
npm ci

Configurar las variables de entorno locales:

DATABASE_URL=postgresql://usuario:clave@localhost:5432/atlas
JWT_SECRET=secreto_local_de_desarrollo
PORT=4000

Iniciar la API:

npm start

Frontend

Desde la raíz del repositorio:

cd FRONTEND
npm ci
npm run dev

Nota: la ejecución completa requiere disponer de la base de datos y su esquema original. El repositorio no incluye actualmente el script de inicialización de PostgreSQL.

Ejecutar las pruebas

Desde "BACKEND":

npx jest --runInBand

Para generar un reporte de cobertura local:

npx jest --runInBand --coverage

🔐 Hallazgos de seguridad y mejoras

Durante las evaluaciones se detectaron riesgos relacionados con:

- Contraseñas almacenadas sin hashing seguro.
- Credenciales de conexión presentes en el código.
- Controles de autorización insuficientes en determinados módulos.
- Protección incompleta de datos sensibles.
- Validación de entradas y auditoría parcial.

En EP3 se implementaron y verificaron mejoras de autorización en "empresa_usuarios".

Estas mejoras no implican que todas las vulnerabilidades del sistema estén solucionadas.

Como parte del plan de mantenimiento se documentaron acciones para corregir los defectos pendientes, ampliar la cobertura e incorporar controles adicionales como SCA y DAST automatizado.

⚠️ Consideraciones de seguridad

ATLAS se utiliza como un entorno de aprendizaje y evaluación de seguridad de software.

El código conserva vulnerabilidades identificadas durante el análisis y no debe utilizarse en producción ni con información personal real sin aplicar las correcciones correspondientes.

Una prueba aprobada significa que se cumplió el comportamiento esperado para ese caso; no garantiza que el sistema esté libre de vulnerabilidades.

---

ATLAS | Pruebas, seguridad, automatización y mejora continua.
