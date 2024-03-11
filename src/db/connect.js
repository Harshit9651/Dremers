
/*const mongoose = require("mongoose");
main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/Dreamers');
console.log("mongoose responsed sucessfully");
  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}
//mongodb://127.0.0.1:27017/Dreamers ye hai add me
//mongodb+srv://harshit9660518978:harshit9660518978@cluster0.sbirrhi.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
*/
const mongoose = require("mongoose");
mongoose.connect('mongodb+srv://Dremers:ramramram@cluster0.sbirrhi.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {

connectTimeoutMS: 30000, // Increase connection timeout to 30 seconds
socketTimeoutMS: 45000 
}).then(() => {
  console.log('Connected to MongoDB Atlas');
}).catch((err) => {
  console.error('Error connecting to MongoDB Atlas:', err.message);
});

