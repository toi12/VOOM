
import express from 'express';
import cors from 'cors';
import tripsRouter from './routes/trips.js';
import importRouter from './routes/imports.js';
import exportRouter from './routes/export.js';
import reportsRouter from './routes/reports.js';
const app = express();
app.use(cors());
app.use(express.json());
app.use('/trips', tripsRouter);
app.use('/import', importRouter);
app.use('/export', exportRouter);
app.use('/reports', reportsRouter);
app.get('/', (_req,res)=>res.json({ok:true, service:'VOOM Backend'}));
const PORT = process.env.PORT || 3002;
app.listen(PORT, ()=>console.log('VOOM backend listening on', PORT));
