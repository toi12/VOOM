
import express from 'express';
import multer from 'multer';
import fs from 'fs';
import { parse } from 'csv-parse/sync';
import Database from 'sqlite3';
const upload = multer({ dest: 'tmp/' });
const router = express.Router();
const db = new Database.Database('./data/voom.db');

router.post('/', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    const content = fs.readFileSync(file.path, 'utf8');
    const records = parse(content, { columns: true, skip_empty_lines: true });
    const created = [];
    for (const r of records) {
      // basic mapping heuristics
      const date = r['Date'] || r['date'] || r['ride start'] || new Date().toISOString();
      const amount = parseFloat((r['Amount']||r['amount']||r['fare']||0)+'') || 0;
      const distance = parseFloat((r['Distance (km)']||r['distance']||0)+'') || 0;
      const commission = parseFloat((r['Commission']||r['commission']||r['Platform fee']||0)+'') || 0;
      const tip = parseFloat((r['Tip']||r['tip']||0)+'') || 0;
      const stmt = db.prepare(`INSERT INTO trips (date, platform, start, end, distance_km, duration_min, amount_gross, tip, platform_fee, tva_rate, notes) VALUES (?,?,?,?,?,?,?,?,?,?,?)`);
      stmt.run(date, r['Platform']||r['provider']||'', r['Start']||'', r['End']||'', distance, r['Duration']||0, amount, tip, commission, 0, (r['Notes']||''), function(err){
        // ignore errors for now per-row
      });
      created.push(r);
    }
    fs.unlinkSync(file.path);
    res.json({imported: created.length});
  } catch (e) {
    res.status(500).json({error: String(e)});
  }
});

export default router;
