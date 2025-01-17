const express = require('express');
const server = express();
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./client_companies.db');

/* standardinställningar och fångar in alla inkommande förfrågningar*/
server
 .use(express.json())
 .use(express.urlencoded({ extended: false }))
 .use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', '*');
    res.header('Access-Control-Allow-Methods', '*');
    next();
 });

 server.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
 });
/* get all */
server.get('/client', (req, res) => {
    const sql = 'SELECT * FROM clients';

    db.all(sql, (err, rows) => {
        if (err) {
            console.log('Ett fel uppstod vid hämtning av all företagsdata:', err);
            res.status(500).send();
        } else {
            res.send(rows);
        }
    });
});

/* get one */
server.get('/client/:id', (req, res) => {
    const id = req.params.id;
    const sql = `SELECT * FROM clients WHERE id=${id}`; 

    db.all(sql, (err, rows) => {
      if (err) {
        console.log('Ett fel uppstod vid hämtning av företagsdata:', err);
        res.status(500).send(err);
      } else {
        res.send(rows[0]);
      }
    });
  }); 

 
server.post('/client', (req, res) => {
    const client = req.body;
    const sql = `INSERT INTO clients(companyName, contactName, contactEmail, projectType, projectLength, color) VALUES 
    (?,?,?,?,?,?)`;
    
    db.run(sql, Object.values(client), (err) => {
        if (err) {
          console.log('Ett fel uppstod vid skapande av företaget:', err);
          res.status(500).send(err);
        } else {
          res.send('Företaget sparades!');
        }
      });
});


server.put('/client/:id', (req, res) => {
    const bodyData = req.body;
    const id = bodyData.id;
    const client = {
      companyName: bodyData.companyName,
      contactName: bodyData.contactName,
      contactEmail: bodyData.contactEmail,
      projectType: bodyData.projectType,
      projectLength: bodyData.projectLength,
      color: bodyData.color
    };

    let updateString = '';
    const columnsArray = Object.keys(client);
    columnsArray.forEach((column, i) => {
      updateString += `${column}="${client[column]}"`;
      if (i !== columnsArray.length - 1) updateString += ',';
    });
    const sql = `UPDATE clients SET ${updateString} WHERE id=${id}`;
  
    db.run(sql, (err) => {
      if (err) {
        console.log('Ett fel uppstod vid uppdatering av företaget:', err);
        res.status(500).send(err);
      } else {
        res.send('Företaget uppdaterades!');
      }
    });
  });


server.delete('/client/:id', (req, res) => {
  const id = req.params.id;
  const sql = `DELETE FROM clients WHERE id = ${id}`;

  db.run(sql, (err) => {
    if (err) {
      console.log('Ett fel uppstod vid borttagning av företaget:', err);
      res.status(500).send(err);
    } else {
      res.send('Företagsinformation borttagen');
    }
  });
});


