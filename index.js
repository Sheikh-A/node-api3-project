require('dotenv').config(); //required 
const server = require('./server.js');

//make the port be assiged by the Server
//Heroku will use this value and assign itself.
const PORT = process.env.PORT || 5050;

server.listen(PORT, () => {
    console.log(`\n ** Server Running on http//localhost:${PORT} ** \n`)
});