
import express from 'express';
import Database from 'sqlite3';
const router = express.Router();
const db = new Database.Database('./data/voom.db');

// initialize
db.serialize(()=>{
  db.run(`CREATE TABLE IF NOT EXISTS trips (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT,
    platform TEXT,
    start TEXT,
    end TEXT,
    distance_km REAL,
    duration_min INTEGER,
    amount_gross REAL,
    tip REAL,
    platform_fee REAL,
    tva_rate REAL,
    notes TEXT
  )`);
});

router.get('/', (_req,res)=>{
  db.all('SELECT * FROM trips ORDER BY date DESC', (err, rows)=>{
    if(err) return res.status(500).json({error: String(err)});
    res.json(rows);
  });
});

router.post('/', (req,res)=>{
  const t = req.body;
  const stmt = db.prepare(`INSERT INTO trips (date, platform, start, end, distance_km, duration_min, amount_gross, tip, platform_fee, tva_rate, notes) VALUES (?,?,?,?,?,?,?,?,?,?,?)`);
  stmt.run(t.date, t.platform, t.start, t.end, t.distance_km||0, t.duration_min||0, t.amount_gross||0, t.tip||0, t.platform_fee||0, t.tva_rate||0, t.notes||'', function(err){
    if(err) return res.status(500).json({error: String(err)});
    res.json({id: this.lastID});
  });
});

router.delete('/:id', (req,res)=>{
  const id = req.params.id;
  db.run('DELETE FROM trips WHERE id = ?', id, function(err){
    if(err) return res.status(500).json({error: String(err)});
    res.json({deleted: this.changes});
  });
});

export default router;
