// File: tests/policyRoutes.test.ts
import request from 'supertest';
import app from '../src/index';
import policies from '../src/data/policyDB';

describe('Policy API', () => {
  afterEach(() => {
    policies.clear();
  });

  it('debería crear una póliza', async () => {
    const res = await request(app).post('/policies').send({
      rutTitular: '12345678-9',
      fechaEmision: '2025-08-06',
      planSalud: 'Plan A',
      prima: 50000
    });
    expect(res.statusCode).toBe(201);
    expect(res.body.estado).toBe('emitida');
  });

  it('debería rechazar póliza inválida', async () => {
    const res = await request(app).post('/policies').send({});
    expect(res.statusCode).toBe(400);
  });

  it('debería listar pólizas con filtro por estado', async () => {
    await request(app).post('/policies').send({
      rutTitular: '1', fechaEmision: '2025-01-01', planSalud: 'X', prima: 1000
    });
    const res = await request(app).get('/policies?estado=emitida');
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(1);
  });

  it('debería listar pólizas con filtro por fecha de emisión', async () => {
    await request(app).post('/policies').send({
      rutTitular: '2', fechaEmision: '2025-12-12', planSalud: 'Y', prima: 2000
    });
    const res = await request(app).get('/policies?fechaEmision=2025-12-12');
    expect(res.statusCode).toBe(200);
    expect(res.body.every((p: any) => p.fechaEmision === '2025-12-12')).toBe(true);
  });

  it('debería listar todas las pólizas sin filtros', async () => {
    await request(app).post('/policies').send({
      rutTitular: '3', fechaEmision: '2025-05-05', planSalud: 'Z', prima: 3000
    });
    const res = await request(app).get('/policies');
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThanOrEqual(1);
  });

  it('debería obtener póliza por ID', async () => {
    const create = await request(app).post('/policies').send({
      rutTitular: '1', fechaEmision: '2025-01-01', planSalud: 'X', prima: 1000
    });
    const id = create.body.id;
    const res = await request(app).get(`/policies/${id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.id).toBe(id);
  });

  it('debería retornar 404 si no existe la póliza', async () => {
    const res = await request(app).get('/policies/invalid-id');
    expect(res.statusCode).toBe(404);
  });

  it('debería actualizar estado correctamente', async () => {
    const create = await request(app).post('/policies').send({
      rutTitular: '1', fechaEmision: '2025-01-01', planSalud: 'X', prima: 1000
    });
    const id = create.body.id;
    const res = await request(app).put(`/policies/${id}/status`).send({ estado: 'activa' });
    expect(res.statusCode).toBe(200);
    expect(res.body.estado).toBe('activa');
  });

  it('debería retornar 404 al actualizar estado de póliza inexistente', async () => {
    const res = await request(app).put('/policies/fake-id/status').send({ estado: 'activa' });
    expect(res.statusCode).toBe(404);
  });

  it('debería rechazar transición inválida', async () => {
    const create = await request(app).post('/policies').send({
      rutTitular: '1', fechaEmision: '2025-01-01', planSalud: 'X', prima: 1000
    });
    const id = create.body.id;
    await request(app).put(`/policies/${id}/status`).send({ estado: 'activa' });
    const res = await request(app).put(`/policies/${id}/status`).send({ estado: 'emitida' });
    expect(res.statusCode).toBe(409);
  });

  it('debería rechazar estado inválido', async () => {
    const create = await request(app).post('/policies').send({
      rutTitular: '1', fechaEmision: '2025-01-01', planSalud: 'X', prima: 1000
    });
    const id = create.body.id;
    const res = await request(app).put(`/policies/${id}/status`).send({ estado: 'otro' });
    expect(res.statusCode).toBe(400);
  });

  it('debería manejar errores con middleware', async () => {
    const res = await request(app).get('/test-error');
    expect(res.statusCode).toBe(500);
    expect(res.body.message).toBe('Error interno del servidor');
  });
});
