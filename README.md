# API REST - Gestión de Pólizas de Salud

## Tecnologías
- Node.js
- Express.js
- TypeScript
- Jest (pruebas unitarias)
- Base de datos en memoria (Map)

## Endpoints

### Crear póliza
`POST /policies`
```json
{
  "rutTitular": "12345678-9",
  "fechaEmision": "2025-08-06",
  "planSalud": "Plan Vida Sana",
  "prima": 65000
}
```

### Listar pólizas
`GET /policies?estado=activa&fechaEmision=2025-08-06`

### Obtener póliza por ID
`GET /policies/:id`

### Actualizar estado
`PUT /policies/:id/status`
```json
{
  "estado": "activa"
}
```

## Instrucciones
```bash
npm install
npm run dev     # Modo desarrollo
npm test        # Ejecutar pruebas con cobertura
npm run build   # Compilar a JavaScript
npm start       # Ejecutar build compilado
```

## Decisiones Técnicas
- Se usa `Map` como base de datos en memoria por simplicidad.
- Transiciones de estado validadas y estrictas.
- Estructura modular, middleware de errores, pruebas completas con Jest.

## Repositorio
[https://github.com/LaniusZ/gestion-polizas-backend](https://github.com/LaniusZ/gestion-polizas-backend)