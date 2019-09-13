let passportLocalMongoose = require("passport-local-mongoose"), 
            LocalStrategy = require("passport-local"),
                  express = require("express"), 
              mongoClient = require("mongoose"), 
                 passport = require("passport"), 
               bodyParser = require("body-parser")
                     user = require("./models/user"); 
     
mongoClient.connect("mongodb://localhost:27017/auth_demo_app", {userNewUrlParser: true}); 
app = express(); 
app.set('view engine', 'ejs'); 

app.use(require("express-session")({
    secret            : "Rusty is the best dog EVER!", 
    resave            : false, 
    saveUninitialized : false 
})); 

// init passport 
app.use(passport.initialize()); 
// passport sessions 
app.use(passport.session()); 

app.use(bodyParser.urlencoded({extended: true})); 

app.use(passport.initialize()); 
app.use(passport.session()); 


passport.use(new LocalStrategy(user.authenticate())); 

// reading the session and encoding
passport.serializeUser(user.serializeUser());

// decoding the session 
passport.deserializeUser(user.deserializeUser()); 

//=============
// ROUTES
//=============
app.get("/", (req, res)=>{
    res.render("home"); 
}); 

app.get("/secret", isLoggedIn, (req, res)=>{
    res.render("secret"); 
}); 

//==============
// AUTH ROUTES
//==============
app.get("/register", (req, res)=>{
    res.render("register"); 
}); 

// handling user sign up 
app.post("/register", (req, res)=>{
    req.body.username
    req.body.password 
    user.register(new user({username: req.body.username}), req.body.password, (err, user)=>{
        if(err) {
            console.log(err); 
            return res.render("register"); 
        } else {
            // logs the user in 
            passport.authenticate("local")(req, res, () => {
                res.redirect("/secret"); 
            }); 
        }
    })
}); 

// LOGIN ROUTES
app.get("/login", (req, res)=>{
    res.render("login"); 
}); 

// LOGIN LOGIC
// Middleware 
app.post("/login", passport.authenticate("local",{
    successRedirect: "/secret", 
    failureRedirect: "/login"
}), (req, res)=>{}); 


app.get("/logout", (req, res)=>{
    req.logout(); 
    res.redirect("/"); 
}); 

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next(); 
    }
    res.redirect("/login"); 
}

app.listen(3000, ()=>{
    console.log("Auth app Init!"); 
}); 