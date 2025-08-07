import express from 'express';
import { json } from 'body-parser';
import { policyRouter } from './routes/policyRoutes';
import { errorHandler } from './middlewares/errorHandler';

const app = express();
app.use(json());
app.use('/policies', policyRouter);

app.get('/test-error', (req, res) => {
  throw new Error('Fallo forzado');
});

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
/* istanbul ignore next */
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
  });
}

export default app;