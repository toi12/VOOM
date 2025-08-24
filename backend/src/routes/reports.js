
import express from 'express';
import ejs from 'ejs';
import puppeteer from 'puppeteer';
import path from 'path';
import Database from 'sqlite3';
const router = express.Router();
const db = new Database.Database('./data/voom.db');

router.get('/livre-recettes/pdf', async (req, res) => {
  const from = req.query.from ? new Date(String(req.query.from)) : new Date();
  const to = req.query.to ? new Date(String(req.query.to)) : new Date();
  db.all('SELECT * FROM trips WHERE date BETWEEN ? AND ? ORDER BY date', from.toISOString(), to.toISOString(), async (err, rows)=>{
    if(err) return res.status(500).json({error: String(err)});
    const templatePath = path.join('.', 'templates', 'livre_recettes.ejs');
    const html = await ejs.renderFile(templatePath, { trips: rows, period: { from, to } });
    const browser = await puppeteer.launch({ args: ['--no-sandbox','--disable-setuid-sandbox'] });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    const pdf = await page.pdf({ format: 'A4', printBackground: true });
    await browser.close();
    res.setHeader('Content-Type','application/pdf');
    res.setHeader('Content-Disposition','attachment; filename="livre-recettes.pdf"');
    res.send(pdf);
  });
});

export default router;
