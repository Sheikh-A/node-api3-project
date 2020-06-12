// code away!
const server = require('./server.js');


//make the port be assiged by the Server
const PORT = process.env.PORT || 5050;

server.listen(PORT, () => {
    console.log(`\n ** Server Running on http//localhost:${PORT} ** \n`)
});