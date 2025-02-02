const mongoose = require('mongoose');
const password = process.env.CONNECTION_PASSWORD;

async function main()
{  
   // await mongoose.connect('mongodb://127.0.0.1:27017/food-delivery');
   await mongoose.connect(`mongodb+srv://anushkashukla3003:${password}@cluster0.ov6cjvv.mongodb.net/food-delivery`);
}      
module.exports=main;   

// async function main() {  
//    try {
//        await mongoose.connect('mongodb://127.0.0.1:27017/food-delivery', {
//            useNewUrlParser: true,
//            useUnifiedTopology: true
//        });
//        console.log('Connected to MongoDB');
//    } catch (error) {
//        console.error('Error connecting to MongoDB:', error.message);
//    }
// }

// module.exports=main;

