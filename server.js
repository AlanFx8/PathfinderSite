const express = require('express');
const path = require('path');

//App
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: false}));

//Set path to client
if (process.env.NODE_ENV === 'production'){
    app.use(express.static('client/build'));
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
}

//Open server
const port = process.env.port || 5000;
app.listen(port, error => {
    if(error){
        console.log(`Error! We could not connect to the server.`);
    }
    console.log(`Success! The server is running on port ${port}`);
});