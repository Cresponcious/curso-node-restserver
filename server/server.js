require('./config/config');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const path = require('path');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

//Habilitar uso de carpeta publica
app.use(express.static(path.resolve(__dirname, '../public')));


app.use(require('./routes/index'));

mongoose.connect(process.env.URLDB, { useNewUrlParser: true, useCreateIndex: true },
    (err, res) => {
        if (err) throw err;

        console.log('Conexion a mongo OK')
    });

app.listen(process.env.PORT, () => {
    console.log('Escuchando en puerto ', process.env.PORT);
});