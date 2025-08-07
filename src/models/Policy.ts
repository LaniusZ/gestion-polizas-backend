export type PolicyStatus = 'emitida' | 'activa' | 'anulada';

export interface Policy {
  id: string;
  rutTitular: string;
  fechaEmision: string;
  planSalud: string;
  prima: number;
  estado: PolicyStatus;
}