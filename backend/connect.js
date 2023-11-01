const mongoose = require('mongoose');
async function main()
{
   await mongoose.connect('mongodb://127.0.0.1:27017/food-delivery');
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
