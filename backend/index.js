const express = require('express');
var app = express();
const main = require('./connect');
const cors = require('cors');
app.use(cors());
main().then(() => {
    console.log('connect to DB');
}).catch(() => {
    console.log(' NOT connect to DB'); 
}
)



app.use(express.json());
app.use('/delivery/auth', require('./Routes/auth'));
app.use('/delivery/data', require('./Routes/data'));
app.use('/delivery/cart',require('./Routes/cartData'));

app.listen(5000, '0.0.0.0', () => {
    console.log("running on port http://localhost:5000");
})