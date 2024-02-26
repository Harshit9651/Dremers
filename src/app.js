const express= require("express");
const app = express();
const http = require('http')
const port = process.env.PORT|| 3000;
const path = require("path");
const socketio = require('socket.io')
const JWT = require("jsonwebtoken");
const Filter = require('bad-words');
const bycrpt = require("bcrypt");
const { generateMessage, generateLocationMessage } = require('./utils/messages')
const { addUser, removeUser, getUser, getUsersInRoom } = require('./utils/users')
const server = http.createServer(app)
const io = socketio(server)
const publicDirectoryPath = path.join(__dirname, '../public')
app.use(express.static(publicDirectoryPath))
//const authenticate = require("./dhdhd/bfbbyf.js");
const cookieParser = require('cookie-parser');
const session = require("express-session")
app.use(cookieParser());
const flash = require("connect-flash");
require("./db/connect.js")
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
io.on('connection', (socket) => {
  console.log('New WebSocket connection')
// mongo db
socket.on('sendMessage', async (messageData, callback) => {
  const user = getUser(socket.id);
  if (!user) {
      return callback('User not found');
  }

  const { content, room } = messageData;

  try {
      console.log('Attempting to save message:', messageData);

      // Create a new message document
      const newMessage = new Message({
          content,
          sender: user.username,
          room
      });

      // Save the message to MongoDB
      await newMessage.save();

      console.log('Message saved:', newMessage);

      // Broadcast the message to all connected clients
      io.to(room).emit('message', newMessage);
      callback(); // acknowledge the message
  } catch (error) {
      console.error('Error saving message:', error);
      callback('Error saving message');
  }
});


///monogg end
  socket.on('join', (options, callback) => {
      const { error, user } = addUser({ id: socket.id, ...options })

      if (error) {
          return callback(error)
      }

      socket.join(user.room)

      socket.emit('message', generateMessage('Admin', 'Welcome!'))
      socket.broadcast.to(user.room).emit('message', generateMessage('Admin', `${user.username} has joined!`))
      io.to(user.room).emit('roomData', {
          room: user.room,
          users: getUsersInRoom(user.room)
      })

      callback()
  })

  socket.on('sendMessage', (message, callback) => {
      const user = getUser(socket.id)
      const filter = new Filter()

      if (filter.isProfane(message)) {
          return callback('Profanity is not allowed!')
      }

      io.to(user.room).emit('message', generateMessage(user.username, message))
      callback()
  })

  socket.on('sendLocation', (coords, callback) => {
      const user = getUser(socket.id)
      io.to(user.room).emit('locationMessage', generateLocationMessage(user.username, `https://google.com/maps?q=${coords.latitude},${coords.longitude}`))
      callback()
  })

  socket.on('disconnect', () => {
      const user = removeUser(socket.id)

      if (user) {
          io.to(user.room).emit('message', generateMessage('Admin', `${user.username} has left!`))
          io.to(user.room).emit('roomData', {
              room: user.room,
              users: getUsersInRoom(user.room)
          })
      }
  })
})

/*
io.on('connection', (socket) => {
  console.log('New WebSocket connection')

  socket.on('join', (options, callback) => {
      const { error, user } = addUser({ id: socket.id, ...options })

      if (error) {
          return callback(error)
      }

      socket.join(user.room)

      socket.emit('message', generateMessage('Admin', 'Welcome!'))
      socket.broadcast.to(user.room).emit('message', generateMessage('Admin', `${user.username} has joined!`))
      io.to(user.room).emit('roomData', {
          room: user.room,
          users: getUsersInRoom(user.room)
      })

      callback()
  })

  socket.on('sendMessage', async (messageData, callback) => {
      const user = getUser(socket.id);
      if (!user) {
          return callback('User not found');
      }
      
      const { content, room } = messageData;

      try {
          const newMessage = new Message({
              content,
              sender: user.username,
              room
          });

          await newMessage.save();
          // Broadcast the message to all connected clients
          io.to(room).emit('message', newMessage);
          callback(); // acknowledge the message
      } catch (error) {
          console.error('Error saving message:', error);
          callback('Error saving message');
      }
  });

  socket.on('sendLocation', (coords, callback) => {
      const user = getUser(socket.id)
      if (!user) {
          return callback('User not found');
      }

      io.to(user.room).emit('locationMessage', generateLocationMessage(user.username, `https://google.com/maps?q=${coords.latitude},${coords.longitude}`));
      callback(); // acknowledge the location message
  });

  socket.on('disconnect', () => {
      const user = removeUser(socket.id);

      if (user) {
          io.to(user.room).emit('message', generateMessage('Admin', `${user.username} has left!`))
          io.to(user.room).emit('roomData', {
              room: user.room,
              users: getUsersInRoom(user.room)
          })
      }
  });
});

// Endpoint to retrieve chat history
app.get('/chat-history/:room', async (req, res) => {
  const room = req.params.room;
  
  try {
      const chatHistory = await Message.find({ room }).sort({ timestamp: 1 });
      res.json(chatHistory);
  } catch (error) {
      console.error('Error fetching chat history:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});
// Fetch chat history from the server
function fetchChatHistory(room) {
  fetch(`/chat-history/${room}`)
      .then(response => response.json())
      .then(chatHistory => {
          // Display chat history in the UI
          chatHistory.forEach(message => {
              displayMessage(message);
          });
      })
      .catch(error => console.error('Error fetching chat history:', error));
}

// Call fetchChatHistory() when users navigate to the chat history section
// For example, after clicking on a user's profile or history button
*/



const Student = require("./models/student.js")
const Doner = require("./models/doner.js");
const CLOUD = require("./models/cloudn.js");




// Example usage


const store = new mongodbsession({
  uri:'mongodb://127.0.0.1:27017/Dreamers',
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
/*
const isAuth = (req,res,next)=>{
  if(req.session.isAuth){
    next();
  }else{
    res.redirect("listings/login.ejs");
  }
}
*/


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
const upload = multer({ storage: storage });//kha save krna h 
//multer({ storage: storage }).array('files', 5); // 'files' is the field name for your file input, and 5 is the maximum number of files
// Set up a simple route for file upload
//const upload = multer({ storage: storage }).array('files', 6);

let userEmail;
const requireLogin = (req, res, next) => {
  if (!req.session.user) {
   // return res.redirect('/login');
   return res.render("listings/option.ejs")
  }
  next();
};
const isAuthenticated = (req, res, next) => {
  if (req.session && req.session.user) {
    return next();
  } else {
    return res.render('listings/option.ejs');
  }
};
app.get('/login', (req, res) => {
  const flashMessages = req.flash();
  res.render('listings/login.ejs', { flashMessages });
});



app.get('/l', async(req, res) => {    
 
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




// Resgister new Doner(doner feld start)


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
  






app.post("/newdoner", upload.fields([
  { name: 'Image', maxCount: 1 },

 
]), async(req,res)=>{
   const {Username,Fname,Lname,password,Email,Number,Descripition,countery,price,Image,For} = req.body;
   const IMAGE = await uploadToCloudinary(req.files['Image'][0]);
   console.log(Username,Fname,Lname,password,Email,Number,Descripition,countery,price,Image);


  

  const saltRounds = 10;
  const hashedPassword = await bycrpt.hash(password, saltRounds);

console.log(hashedPassword);
const hashedotp = await bycrpt.hash(uniqueRandomWord,saltRounds);
console.log(hashedotp);


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
      Randomdigit: hashedotp,
      Image:IMAGE,
      For:For
     })
     console.log(newdoner);
const newdonerdata = await newdoner.save();

console.log(newdonerdata);

req.flash("success","New Donoer Registerd Successfully")
res.redirect("/l")


    })
 
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

app.put("/donereditdata/:id",async(req,res)=>{
  const{id}= req.params;
  const{Fname,Lname,Email,Number,username,Amount,Descripition,Countery} = req.body;

 const update = await Doner.findByIdAndUpdate(id,{

Fname:Fname,Lname,Email,Number,username,Amount,Descripition,Countery
  });
  const updateSave = await update.save();
  console.log(updateSave);
 
  res.redirect("/l")
});

app.delete("deletdta/:id",async (req,res)=>{
  const {id} = req.body;
  const deletedoner =  Doner.findByIdAndDelete(id);
  console.log(deletedoner);
  res.redirect("/l");
})

   app.get('/login', (req, res) => {
    const flashMessages = req.flash();
      res.render('listings/login.ejs', { flashMessages });
    });
   
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
          res.redirect("/l") 
        
        } 
       
        }
    }
     })
     

    
   

     app.get("/lostdnt",(req,res)=>{
      const flashMessages = req.flash();
      res.render("listings/stulogin.ejs")
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
            res.redirect("/l")} }
      }
       })
       
     
      app.get('/student-secret', isAuthenticated, async(req, res) => {
        if (req.session && req.session.user && req.session.user.Role === 'student') {
          const donerdata = await Doner.find({});
res.render("listings/doners.ejs",{donerdata})
        
        } else {
          res.render("listings/error.ejs");
        }
      });
      app.get("/student-lons",isAuthenticated,async(req,res)=>{
        if (req.session && req.session.user && req.session.user.Role === 'student'){
          res.render("listings/help.ejs")
        }
        else{
          res.render("listings/error.ejs");
        }
      })

     app.get('/donor-secret', isAuthenticated, async(req, res) => {
      if (req.session && req.session.user && req.session.user.Role === 'donor') {
const data =  await Student.find({})
        res.render("listings/students.ejs" ,{data});
      } else {
       res.render("listings/error.ejs");
      }
    }); 
    
  
                                        //doner field(end)





    
   



app.get('/logout', (req, res) => {
  // Destroy the session
  req.session.destroy(err => {
    if (err) {
      console.error('Error destroying session:', err);
      res.status(500).send('Error destroying session');
    } else {
      res.redirect("/l");
    }
  });
});


  



 app.get("/student12th",(req,res)=>{
  const flashMessages = req.flash();
  res.render("listings/student12th.ejs")
 })





 let studentId; // Declare the variable in a higher-level scope

 app.post("/newstudent", async (req, res) => {
   try {
     let { Fname, Lname, gender, DOB, Email, Username, Number, Descripition, Goal, city, HomeTown, password } = req.body;
     console.log(Fname, Lname, gender, DOB, Email, Username, Number, Descripition, Goal, city, HomeTown, password);
 
     const data = new Student({
       Fname, Lname, gender, DOB, Email, username: Username, Number, Descripition, Goal, city, HomeTown, password
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
res.redirect("/l")
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








  
  

  const uploadToCloudinary = async (file) => {
    if (file && file.path) {
      //const result = await cloudinary.uploader.upload(file.buffer.toString('base64'));
      const result = await cloudinary.uploader.upload(file.path);
      return result.secure_url;
    } else {
      throw new Error('File buffer is undefined or null');
    }
  };

 server.listen(port, () => {
    console.log(`Server is up on port ${port}!`)
})

