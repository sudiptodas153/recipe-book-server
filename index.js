const express = require('express');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('hello server')
})


app.listen(port, () => {
    console.log(`this site port on ${port} `)
})