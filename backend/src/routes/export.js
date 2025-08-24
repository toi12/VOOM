
import express from 'express';
import Database from 'sqlite3';
const router = express.Router();
const db = new Database.Database('./data/voom.db');

router.get('/json', (_req,res)=>{
  db.all('SELECT * FROM trips ORDER BY date DESC', (err, rows)=>{
    if(err) return res.status(500).json({error: String(err)});
    res.json(rows);
  });
});

export default router;
