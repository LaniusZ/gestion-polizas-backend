import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import policies from '../data/policyDB';
import { Policy, PolicyStatus } from '../models/Policy';

export const policyRouter = express.Router();

policyRouter.post('/', (req, res) => {
  const { rutTitular, fechaEmision, planSalud, prima } = req.body;

  if (!rutTitular || !fechaEmision || !planSalud || typeof prima !== 'number') {
    return res.status(400).json({ message: 'Datos incompletos o inválidos' });
  }

  const policy: Policy = {
    id: uuidv4(),
    rutTitular,
    fechaEmision,
    planSalud,
    prima,
    estado: 'emitida'
  };

  policies.set(policy.id, policy);
  res.status(201).json(policy);
});

policyRouter.get('/', (req, res) => {
  const { estado, fechaEmision } = req.query;
  let result = Array.from(policies.values());

  if (estado) {
    result = result.filter(p => p.estado === estado);
  }
  if (fechaEmision) {
    result = result.filter(p => p.fechaEmision === fechaEmision);
  }

  res.json(result);
});

policyRouter.get('/:id', (req, res) => {
  const policy = policies.get(req.params.id);
  if (!policy) return res.status(404).json({ message: 'Póliza no encontrada' });
  res.json(policy);
});

policyRouter.put('/:id/status', (req, res) => {
  const { id } = req.params;
  const { estado } = req.body as { estado: PolicyStatus };
  const policy = policies.get(id);

  if (!policy) return res.status(404).json({ message: 'Póliza no encontrada' });
  if (!['emitida', 'activa', 'anulada'].includes(estado)) {
    return res.status(400).json({ message: 'Estado inválido' });
  }

  const allowedTransitions: Record<PolicyStatus, PolicyStatus[]> = {
    emitida: ['activa'],
    activa: ['anulada'],
    anulada: []
  };

  if (!allowedTransitions[policy.estado].includes(estado)) {
    return res.status(409).json({ message: `Transición no permitida desde ${policy.estado} a ${estado}` });
  }

  policy.estado = estado;
  policies.set(id, policy);
  res.json(policy);
});