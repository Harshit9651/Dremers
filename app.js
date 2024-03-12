const express= require("express");
const app = express();

const port = process.env.PORT|| 3000;
const path = require("path");
const socketio = require('socket.io')
const JWT = require("jsonwebtoken");
const Filter = require('bad-words');
const bycrpt = require("bcrypt");
const nodemailer = require('nodemailer');

const publicDirectoryPath = path.join(__dirname, '../public')
app.use(express.static(publicDirectoryPath))
//const authenticate = require("./dhdhd/bfbbyf.js");
const cookieParser = require('cookie-parser');
const session = require("express-session")
app.use(cookieParser());

const flash = require('connect-flash');
app.use(flash());
require("./src/db/connect.js")
/*app.listen(port,()=>{
    console.log("server run successfully")
})
*/

app. use(express.json());// for parsing 
app.use(express.urlencoded({extended:true}))//data by id aa jaye 
app.set("view engine","ejs");
const static_path = path.join(__dirname,"../views");//pura path dena hota hai 
app.use(express.static(static_path));
//const methodoverride = require("method-override"); // for put patch and delete method
//app.use(methodoverride("_method"));
const ejsmate = require("ejs-mate");
app.engine("ejs",ejsmate)

app.use(express.static(path.join(__dirname,"../public")));


const mongodbsession = require("connect-mongodb-session")(session)

const bodyParser = require('body-parser');

const methodoverride = require("method-override"); // for put patch and delete method
app.use(methodoverride("_method"));


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

const Student = require("./src/models/student.js")
const Doner = require("./src/models/doner.js");
const CLOUD = require("./src/models/cloudn.js");
const SinUp = require('./src/models/sinUp.js')







// Example usage
///////////////////////////############## Mongo Session################## //////////////////////////////////

const store = new mongodbsession({
 uri:'mongodb+srv://Dremers:ramramram@cluster0.sbirrhi.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
 collection:"mysessions",
})

app.use(session({
  secret:"this is my first secrectin cookie",
  resave:false,
  saveUninitialized:false,
  store:store,
}))
app.use(flash());
app.use((req,res,next)=>{
  res.locals.success = req.flash("success");
  next();

})




const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;



// Configure Cloudinary
cloudinary.config({
  cloud_name: 'drxgaesoh',
  api_key: '911397189256837',
  api_secret: '3u2KB4BndKIcxurUbB7hz9Lsy2s'
});

// Configure MongoDB connection

// Create a simple mongoose schema




// Configure multer to use Cloudinary as storage
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    folder: 'uploads', // Cloudinary folder where you want to store files
    allowedFormats: ['jpg', 'png'],
});
const mongoose = require("mongoose");
const { AxiosHeaders } = require("axios");
const upload = multer({ storage: storage });//kha save krna h 
  

const uploadToCloudinary = async (file) => {
    if (file && file.path) {
      //const result = await cloudinary.uploader.upload(file.buffer.toString('base64'));
      const result = await cloudinary.uploader.upload(file.path);
      return result.secure_url;
    } else {
      throw new Error('File buffer is undefined or null');
    }
  };



///////////////////////////##############  Authentication ################## //////////////////////////////////
let userEmail;

const isAuthenticated = (req, res, next) => {
  if (req.session && req.session.user) {
      return next();
  } else {
      // Redirect to the login page if the user is not authenticated
      res.redirect('/sinin');
  }
};



///////////////////////////##############  Get resquctes ################## //////////////////////////////////////////////////////////////////////
app.get('/sinin', (req, res) => {
  const flashMessages = req.flash();
  res.render('listings/sinin.ejs', { flashMessages });
});

app.get("/donorEdit/:id",async(req,res)=>{
    const{id} = req.params;
    const ddata = await Doner.findById(id)
    console.log(ddata)
 res.render("listings/doneredit.ejs",{ddata})
  
     })


app.get("/profile",isAuthenticated, async(req,res)=>{
  try{
const id = req.session.user.userId; 
if(req.session.user.Role=="donor"){
  const find  = await Doner.findById(id);
  res.render("listings/profiledoner.ejs",{find})

}else{
  const findd = await Student.findById(id);
res.send("hello")

  console.log(findd)
}
  }catch(err){
    console.log(err);
  }
})

app.get('/', async(req, res) => {    
 
  const donerId = '658d8a5f25bf4b855f346c1a';
//console.log(req.session.user.userId)
 const data = await Doner.find({}).limit(8);// yani desktop par 8 donor hi dikhane hai 
 const sdata = await Student.find({}).limit(4);


      res.render('listings/index.ejs',{data,sdata,user: req.session.user });
   //   console.log(sdata)
    // res.send(data)
});


 app.get("/ramaa",(req,res)=>{
 
  
  res.render("listings/error.ejs")
 })

 app.get('/sinup', (req, res) => {
    console.log(req.flash('success')); // Log success flash messages
    console.log(req.flash('error')); // Log error flash messages
    res.render('listings/sinup.ejs', { messages: req.flash() });
     
    });





app.get("/donerdtail/:id",async(req,res)=>{
  try {
    const { id } = req.params;
    const raja = await Doner.findById(id);

    if (!raja) {
      // Handle the case when donor details are not found
      return res.status(404).json({ error: 'Donor details not found' });
    }

    console.log(raja);
    res.render("listings/raja.ejs",{ raja })
 
  } catch (error) {
    // Handle other errors
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
})




app.get("/donerinput",(req,res)=>{
  const flashMessages = req.flash();
  res.render("listings/donerinput.ejs")
})
  
app.get('/logout', (req, res) => {
    // Destroy the session
    req.session.destroy(err => {
      if (err) {
        console.error('Error destroying session:', err);
        res.status(500).send('Error destroying session');
      } else {
        res.redirect("/");// pahle res.redrict("/l") tha
      }
    });
  });
  

  
  
  
   app.get("/student12th",(req,res)=>{
    const flashMessages = req.flash();
    res.render("listings/student12th.ejs")
   })
  
  

  
  app.get("/student-lons",isAuthenticated,async(req,res)=>{
    if (req.session && req.session.user && req.session.user.Role === 'student'){
      res.render("listings/help.ejs")
    }
    else{
      res.render("listings/error.ejs");
    }
  })




app.get("/studentinformation/:id", async(req,res)=>{
    try {
      const { id } = req.params;
      const graja = await Student.findById(id);
  
      if (!graja) {
        // Handle the case when donor details are not found
        return res.status(404).json({ error: 'Donor details not found' });
      }
  
      console.log(graja);
      res.render("listings/stdinfo.ejs",{ graja })
   
    } catch (error) {
      // Handle other errors
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  
  })
  
  
  
  app.get("/donerdtail/:id",async(req,res)=>{
    try {
      const { id } = req.params;
      const raja = await Doner.findById(id);
  
      if (!raja) {
        // Handle the case when donor details are not found
        return res.status(404).json({ error: 'Donor details not found' });
      }
  
      console.log(raja);
      res.render("listings/raja.ejs",{ raja })
   
    } catch (error) {
      // Handle other errors
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  })
  

//////////////////////////##############  Post resquctes ################## //////////////////////////////////////////////////////////////////////





app.post("/newdoner", upload.fields([
  { name: 'Image', maxCount: 1 },

 
]), async(req,res)=>{
   const {Username,Fname,Lname,password,Email,Number,Descripition,countery,price,Image,For} = req.body;
   const IMAGE = await uploadToCloudinary(req.files['Image'][0]);
   console.log(Username,Fname,Lname,password,Email,Number,Descripition,countery,price,Image);


  

  const saltRounds = 10;
  const hashedPassword = await bycrpt.hash(password, saltRounds);

console.log(hashedPassword);



    const newdoner = await new Doner({
      Fname:Fname,
      Lname:Lname,
      Email:Email,
      username:Username,
      Number:Number,
      password:hashedPassword,
      Amount:price,
      Countery:countery,
      Descripition:Descripition,
     
      Image:IMAGE,
      For:For
     })
     console.log(newdoner);
const newdonerdata = await newdoner.save();

console.log(newdonerdata);

req.flash("success","New Donoer Registerd Successfully")
res.redirect("/") // pahle res.redrict("/l") tha


    })
 
 

app.put("/donereditdata/:id",async(req,res)=>{
  const{id}= req.params;
  const{Fname,Lname,Email,Number,username,Amount,Descripition,Countery} = req.body;

 const update = await Doner.findByIdAndUpdate(id,{

Fname:Fname,Lname,Email,Number,username,Amount,Descripition,Countery
  });
  const updateSave = await update.save();
  console.log(updateSave);
 
  res.redirect("/") // pahle res.redrict("/l") tha
});

app.delete("deletdta/:id",async (req,res)=>{
  const {id} = req.body;
  const deletedoner =  Doner.findByIdAndDelete(id);
  console.log(deletedoner);
  res.redirect("/");// pahle res.redrict("/l") tha
})

  
   
     app.post("/donerlogin",async(req,res)=>{
    let{Email,password,Username,Role} = req.body;
   
    const findDoner =  await Doner.findOne({Email})
    if(findDoner==null){
      req.flash("error", "Invalid credentials!"); 
      res.redirect("/login");
    }
    else{
    
      const hashpass = await bycrpt.compare(password, findDoner.password);
      console.log(hashpass);
      const token = await findDoner.generateAuthToken();
      console.log(token);
    
   //   const hashOTP = await bycrpt.compare(OTP, findDoner. Randomdigit);
    // console.log(hashOTP);
   
      if(  findDoner.Email===Email ){
        if(Role==="donor"){
          userEmail = Email;
          

          req.flash("success", "Welcome back! ");
          req.session.user = { Role , userId: findDoner._id};

console.log("hello hii name" + req.session.user.userId);
          res.redirect("/") // pahle res.redrict("/l") tha
        
        } 
       
        }
    }
     })
     

    
  
   
     app.post("/studentlogin",async(req,res)=>{
      let{Email,password,Username,Role} = req.body;
        
      const findStudent =  await Student.findOne({Email})
      if(findStudent==null){
        req.flash("error", "Invalid credentials!"); 
        res.redirect("/lostdnt");
      }
      else{
      
        const hashpass = await bycrpt.compare(password, findStudent.password);
        console.log(hashpass);
       // const token = await findDoner.generateAuthToken();
        //console.log(token);
      
     //   const hashOTP = await bycrpt.compare(OTP, findDoner. Randomdigit);
      // console.log(hashOTP);
     
        if( findStudent.Email===Email ){
          if(Role==="student"){
      

            req.flash("success", "Welcome to Dremers again!");
            req.session.user = { Role ,userId: findStudent._id };
            res.redirect("/")} } // pahle res.redrict("/l") tha
      }
       })
       
   





 let studentId; // Declare the variable in a higher-level scope

 app.post("/newstudent", async (req, res) => {
   try {
     let { Fname, Lname, gender, DOB, Email, Number, Descripition, Goal, city, HomeTown, password ,   SubCaste,
      Caste} = req.body;
     console.log(Fname, Lname, gender, DOB, Email, Number, Descripition, Goal, city, HomeTown, password,SubCaste,Caste);
 
     const data = new Student({
       Fname, Lname, gender, DOB, Email,Number, Descripition, Goal, city, HomeTown, password,Caste,SubCaste
     });
 
     // Save in the database
     const studentdata = await data.save();
     
     // Access the ID
     studentId = studentdata._id;
     console.log(studentId);

 
     res.render("listings/student12page2.ejs");
   } catch (error) {
     console.error(error);
     res.status(500).send('Internal Server Error');
   }
 });
 
 // Access studentId outside the route handler or in another route

 
 // You can now access studentId in other parts of your code or routes
 
 app.post("/newstudentpage2",upload.fields([
  { name: 'Statement', maxCount: 1 },
  { name: 'ElectricCityBill', maxCount: 1 },
  { name: 'StudentImage', maxCount: 1 },
  { name: 'marksheet11th', maxCount: 1 },
  { name: 'marksheet10th', maxCount: 1 },
  { name: 'latter', maxCount: 1 },

]), async(req,res)=>{

  const {FFname,FLname,FDOB,FEmail,FNumber,FAdhar,occupation,WName,WNumber,IFSC,tenth,evelenth,Accountno} = req.body;
  const Statement = await uploadToCloudinary(req.files['Statement'][0]);
  const marksheet10th= await uploadToCloudinary(req.files['marksheet10th'][0]);
  const StudentImage = await uploadToCloudinary(req.files['StudentImage'][0]);
  const marksheet11th= await uploadToCloudinary(req.files['marksheet11th'][0]);
  const Electricitybill= await uploadToCloudinary(req.files['ElectricCityBill'][0]);
  const latter= await uploadToCloudinary(req.files['latter'][0]);
 
  const Studnetfind =  await  Student.findByIdAndUpdate(studentId,
    {FFName:FFname,
      FLname:FLname,
      FDOB:FDOB,
      FEmail:FEmail,
      FNumber:FNumber,
      FAdhar:FAdhar,
      occupation:occupation,
      WName:WName,
      WNumber:WNumber,
      ElectricCityBill:Electricitybill,
      Statement:Statement,
      studentImage:StudentImage,
      tenth:tenth,
      evelenth:evelenth,
      marksheet10th,
      marksheet11th,
      IFSC,
      Accountno,
      latter,
   

    },{ new: true });


console.log(Studnetfind)
req.flash("success", "New Student Registerd");
res.redirect("/")  // pahle res.redrict("/l") tha
}) 



app.post('/sinUp', async (req, res) => {

  try {
      const { name, number, email, role, password } = req.body;

      // Check if any of the required fields are missing
      if (!name || !number || !email || !role || !password) {
          return res.status(400).json({ error: "Missing required fields" });
      }

      // Hash the password using bcrypt
      const hashedPassword = await  bycrpt.hash(password, 10);

      // Create a new SinUP instance with the hashed password
      const userSignup = new SinUp({
          name,
          number,
          email,
     role,
          password: hashedPassword // Store the hashed password
      });

      // Save the userSignup instance to the database
      await userSignup.save();

      // Create reusable transporter object using the default SMTP transport
      let transporter = nodemailer.createTransport({
          service: 'Gmail',
          port:465,
          logger:true,
          debug:true,
          secure:true,
          secureConnection:false,

          auth: {
              user: 'briefshalter@gmail.com', // Your Gmail email address
              pass: 'hljd lfga trbd ffnw' // Your Gmail password
          },
          tls:{
              rejectUnAuthorized:true,
          }
      });

      let mailOptions = {
          from: 'briefshalter@gmail.com', // Sender address
          to: email, // List of receivers
          subject: 'Welcome to Dremers', // Subject line
          html: `<p>Dear ${name},</p><br>
                 <p>Welcome to Briefshalter, your trusted destination for hassle-free room bookings! We're delighted to have you join our community of discerning travelers seeking convenient and affordable accommodation options.</p>
                 <p>At Briefshalter, we understand the importance of seamless travel experiences, especially during crucial moments like exams. Our commitment is to provide you with comfortable rooms tailored to your specific needs, ensuring a stress-free stay wherever your academic journey takes you.</p><br>
                 <p>Thank you for choosing Briefshalter. We're here to make your travels easier and more enjoyable. Feel free to explore our range of options and reach out to us anytime for assistance.</p><br>
                 <p>Happy booking!</p><br>
                 <p>Warm regards,<br>
                 Briefshalter Team</p>` // HTML formatted body
      };
      // Send email
      transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
              console.log(error);
              res.status(500).send('Error sending email');
          } else {
              console.log('Email sent: ' + info.response);
              req.flash('success', 'Welcome ' + name + '! You have successfully signed up.');
              res.redirect('/')
          }
      });

      // Redirect to the home page after successful registration
      // res.redirect("/");

  } catch (error) {
      console.error(error);
      req.flash('error', 'Internal server error'); // Set flash message for error
    //  res.status(500).json({ error: "Internal server error" });
  }
});



  
app.post('/sinIn', async (req, res) => {
  try {
      const { email, password,role } = req.body;

      // Find the user by email in the database
      const user = await SinUp.findOne({ email});

      // Check if the user exists
      if (!user) {
          return res.status(404).json({ error: "User not found" });
      }
        // Check if the role matches the user's role
        if (user.role !== role) {
          return res.status(401).json({ error: "Role does not match the user" });
      }
      // Compare the provided password with the hashed password in the database
      const isPasswordMatch = await bycrpt.compare(password, user.password);

      // Check if the passwords match
       if (!isPasswordMatch) {
          return res.status(401).json({ error: "Wrong password or may Be duplicate Email is trying " });
      }

      // Passwords match, sign in successful
      // Set the user data in the session to indicate that the user is authenticated
      req.session.user = {
          id: user._id,
          email: user.email,
          role: user.role 
          // Add more user data if needed
      };

      // Redirect to the home page or any other page after successful sign-in
      req.flash('success', 'Welcome back! You have successfully signed in.');
      
if(user.role=='donor'){
  const data = await Student.find();
  res.render("listings/test.ejs",{data})
}
  } catch (error) {
      console.error(error);
      req.flash('error', 'Invalid credentials'); // Set flash message for error
      res.status(500).json({ error: "Internal server error" });
  }
});
app.get("/hello", async(req,res)=>{
  const data = await Student.find()

  res.render("listings/test.ejs",{data})
});
// Assuming you have a route like this in your Express app
app.get('/search', async (req, res) => {
  try {
      const caste = req.query.caste; // Assuming the query parameter is 'caste'
      // Perform a database query to find users based on the caste
      const users = await Student.find({ Caste: caste }); // Adjust 'Caste' according to your schema

      res.render('listings/filter.ejs', { data: users }); // Send filtered users to the template
  } catch (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
  }
});
app.get('/students',async(req,res)=>{
  const data = await Student.find();
  res.render('listings/test.ejs',{data})
})
  