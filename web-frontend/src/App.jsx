
import React, { useEffect, useState } from 'react';
import axios from 'axios';
const API = 'http://localhost:3002';

export default function App(){
  const [trips,setTrips]=useState([]);
  const [file,setFile]=useState(null);
  useEffect(()=>{ (async ()=>{
    try{ const r = await axios.get(API+'/trips'); setTrips(r.data); } catch(e){ console.log(e); }
  })(); },[]);

  async function addSample(){
    await axios.post(API+'/trips', { date:new Date().toISOString(), platform:'Ex', start:'A', end:'B', distance_km:12, duration_min:20, amount_gross:30, tip:2, platform_fee:6, notes:'Test' });
    const r = await axios.get(API+'/trips'); setTrips(r.data);
  }

  async function uploadCSV(){
    if(!file) return alert('Choisir CSV');
    const form = new FormData(); form.append('file', file);
    await axios.post(API+'/import', form, { headers: {'Content-Type':'multipart/form-data'} });
    const r = await axios.get(API+'/trips'); setTrips(r.data);
  }

  function exportJSON(){
    window.open(API+'/export/json', '_blank');
  }

  function downloadPDF(){
    const now=new Date(); const from=new Date(now.getFullYear(), now.getMonth(),1);
    window.open(API+`/reports/livre-recettes/pdf?from=${from.toISOString()}&to=${now.toISOString()}`, '_blank');
  }

  return (<div style={{padding:20,fontFamily:'Arial'}}>
    <h1>VOOM</h1>
    <div><button onClick={addSample}>+ Ajouter course exemple</button></div>
    <h2>Importer CSV</h2>
    <input type='file' accept='.csv' onChange={e=>setFile(e.target.files[0])} /> <button onClick={uploadCSV}>Importer</button>
    <h2>Courses</h2>
    <ul>{trips.map(t=><li key={t.id}>{new Date(t.date).toLocaleString()} — {t.amount_gross} € — {t.distance_km} km</li>)}</ul>
    <h2>Export</h2>
    <button onClick={exportJSON}>Exporter JSON</button> <button onClick={downloadPDF} style={{marginLeft:10}}>Livre recettes (PDF)</button>
  </div>);
}
