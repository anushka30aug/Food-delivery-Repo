const dotenv = require('dotenv');
dotenv.config({ path: './.env' });
const express = require('express');
const ngrok = require('ngrok');  // Import the ngrok module
const main = require('./connect');
const cors = require('cors');
const app = express();
const fileupload = require('express-fileupload');
const port = process.env.PORT||5000;

app.use(fileupload({
    useTempFiles:true
}))

app.use(cors());

main().then(() => {
    console.log('Connected to DB');
}).catch((error) => {
    console.log('Not connected to DB' + error);
});
 
app.use(express.json());
app.use('/delivery/auth', require('./Routes/auth'));
app.use('/delivery/data', require('./Routes/data'));
app.use('/delivery/cart', require('./Routes/cartData'));
app.use('/delivery/buy', require('./Routes/Order'));
app.use('/delivery/user', require('./Routes/user'));

// ngrok to expose the local server
(async () => {
    const url = await ngrok.connect({
        proto: 'http', // http|tcp|tls, defaults to http
        addr: port,    // port or network address, defaults to 80
        authtoken: process.env.NGROK_AUTHTOKEN, // authtoken from ngrok
    });

    console.log(`Ngrok URL: ${url}`);
})();

// Start the Express server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});