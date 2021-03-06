const express = require("express");
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");
const app = express();
const PORT = 8080;
const bcrypt = require('bcrypt');
//keep all requirements above this line

app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2']
}));

//keep all app.use above this line

const urlDatabase = {
};

const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
};

// keep all libraries above this line

const generateRandomString = () => {
  const length = 6;
  return Math.random().toString(32).substr(2, length);
};

const urlsForUser = (id) => {//fetch all urls saved for a user
  let urls = {};
  for (const shortURL in urlDatabase) {
    const url = urlDatabase[shortURL];
    if (url.userID === id) {
      urls[shortURL] = url.longURL;
    }
  }

  return urls;
};
//keep helper functions above this line

app.set("view engine", "ejs");

//Keep all sets and use above this line

app.post("/login", (req, res) => {//when pushing login button, if user matches key in database, and password matches, return urls of the user
  for (const user in users) {
    if (users[user].email === req.body.email && bcrypt.compareSync(req.body.password, users[user].hashedPassword)) {
      req.session.userID = `${user}`;
      res.redirect("/urls");
    }
  }
  
  res.statusCode = 403;
  res.redirect("/login");
});

app.post("/logout", (req, res) => {//on logout  button press, clear session and direct to home page
  req.session = null;
  
  res.redirect("/urls");
});

app.post("/register", (req, res) => {//on button press, add user to database
  const userID = generateRandomString();
  const inputEmail = req.body.email;
  const password = req.body.password;
  const hashedPassword = bcrypt.hashSync(password, 10);


  if (!inputEmail) {
    res.statusCode = 400;
    const templateVars = {
      user: null,
      error: "Please enter an email"
    }

    res.render("register", templateVars)
  }
  
  if (!password) {
    res.statusCode = 400;
    const templateVars = {
      user: null,
      error: "Please enter a password"
    }

    res.render("register", templateVars)
  }

  for (let entry in users) {
    if (users[entry].email === inputEmail) {
      res.statusCode = 400;
      const templateVars = {
        user: null,
        error: "You are already registered, please login instead"
      }
  
      return res.render("register", templateVars)
    }
  }
  

  users[userID] = {
    id: userID,
    email: inputEmail,
    hashedPassword: hashedPassword
  };


  req.session.userID = userID;
  res.redirect("/urls");
});

app.post("/urls", (req, res) => {//create a new url entry in the database
  const newURL = generateRandomString();
  urlDatabase[newURL] = {
    longURL: req.body.longURL,
    userID: req.session.userID
  }
  
  res.redirect(`/urls/${newURL}`);
});

app.post("/urls/:shortURL/delete", (req, res) => {//delete url entry from database
  for (const user in users) {
    if (req.session.userID === user) {
      const shortURL = req.params.shortURL;
      delete urlDatabase[shortURL];

      return res.redirect("/urls");
    }
  }
  
  res.redirect("urls");
});

app.post("/urls/:shortURL/update", (req ,res) => {//updates the longURL belonging to a shortURL
  

  const shortURL = req.params.shortURL;
  urlDatabase[shortURL].longURL = req.body.longURL;
  
  res.redirect(`/urls/${shortURL}`);
});
//keep all POST requests above this line

app.get("/", (req, res) => {//check if server works
  res.send("Hello");
});

app.get("/login", (req, res) => {//get login form page
  const templateVars = {
    user: users[req.session.userID]
  };

  res.render("login", templateVars);
});

app.get("/urls.json", (req, res) => {//json file for users urls
  res.json(urlDatabase);
});

app.get("/urls", (req,res) => {// get list of urls for logged in user
  for (const user in users) {
    if (req.session.userID === user) {
      const templateVars = {
        urls: urlsForUser(req.session.userID),
        user: users[req.session.userID]
      };
      return res.render("urls_index", templateVars);
    }
  }

  const templateVars = {
    error: "Please log in first",
    user: null
  }
  res.render("login", templateVars);
});

app.get("/urls/new", (req,res) => {//get page for creating new url
  const templateVars = {
    user: users[req.session.userID]
  };

  if (!templateVars.user) {
    res.redirect("/login");
  }


  res.render("urls_new", templateVars);
});

app.get("/u/:shortURL", (req, res) => {//redirect to long url value for short url key
  const shortURL = req.params.shortURL;
  if (urlDatabase[shortURL]) {
    const longURL = urlDatabase[shortURL].longURL;
    return res.redirect(`https://${longURL}`);
  }

  res.status(400).send("This shortURL does not exist")
});

app.get("/urls/:shortURL", (req, res) => {// show edit page for short url
  // for (const user in users) {
  if (req.session.userID === urlDatabase[req.params.shortURL].userID) {
    const templateVars = {
      shortURL: req.params.shortURL,
      longURL: urlDatabase[req.params.shortURL].longURL,
      user: users[req.session.userID]
    };
     
    return res.render("urls_show", templateVars);
    }
  
  
  res.status(400).send("You are not authorized to view this page");
});

app.get("/register", (req,res) => {//get register form page

  for (const user in users) {
    if (users[user].email !== req.body.email){
      const templateVars = {
        user: users[req.session.userID]
      };
      return res.render("register", templateVars);
    }
  }
  
  const templateVars = {
    user: null,
    error: 'You are not registered'
  }

  return res.render("register", templateVars);
});

app.get("/hello", (req, res) => {//test page
  res.send("<html>Hello <b>World</b></html>\n");
});

//keep all GET requests above this line




app.listen(PORT, () => {//have server listen
  console.log(`Server is listening on Port ${PORT}`);
});