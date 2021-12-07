const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const app = express();
const PORT = 8080;

//keep all requirements above this line

app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

//keep all app.use above this line

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xk": "http://www.google.com"
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
}

// keep all libraries above this line

const generateRandomString = () => {
  const length = 6;
  return Math.random().toString(32).substr(2, length);
}

app.set("view engine", "ejs");

//Keep all sets and use above this line

app.post("/login", (req, res) => {
  for (const user in users) {
    if (users[user].email === req.body.email && users[user].password === req.body.password) {
      res.cookie("userID", user);
      res.redirect("/urls")
    }
  }
  
  res.statusCode = 403
  res.redirect("/login");
});

app.post("/logout", (req, res) => {
  res.clearCookie("userID");

  res.redirect("/urls");
});

app.post("/register", (req, res) => {
  const userID = generateRandomString();
  const inputEmail = req.body.email;
  const password = req.body.password;
  if (!inputEmail || !password) {
    res.statusCode = 400;
    return res.redirect("/register");
  }
  
  for (let user in users) {
    if (inputEmail === users[user].email) {
      res.statusCode = 400;
      return res.redirect("/register");
    }
  }

  users[userID] = {
    id: userID,
    email: inputEmail,
    password: password
  };


  res.cookie('userID', userID)
  res.redirect("/urls");
})

app.post("/urls", (req, res) => {
  const newURL = generateRandomString();
  urlDatabase[newURL] = req.body.longURL;
  
  res.redirect(`/urls/${newURL}`)
});

app.post("/urls/:shortURL/delete", (req, res) => {
  const shortURL = req.params.shortURL;
  delete urlDatabase[shortURL];

  console.log(urlDatabase)
  res.redirect("/urls");
});

app.post("/urls/:shortURL/update", (req ,res) => {
  const shortURL = req.params.shortURL;

  urlDatabase[shortURL] = req.body.longURL
  res.redirect(`/urls/${shortURL}`)
})
//keep all POST requests above this line

app.get("/", (req, res) => {
  res.send("Hello");
});

app.get("/login", (req, res) => {
  const templateVars = { 
    user: users[req.cookies["userID"]]
  };

  res.render("login", templateVars);
})

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/urls", (req,res) => {
  const templateVars = { 
    urls: urlDatabase,
    user: users[req.cookies["userID"]]
  };


  res.render("urls_index", templateVars)
});

app.get("/urls/new", (req,res) => {
  const templateVars = { 
    user: users[req.cookies["userID"]]
  };


  res.render("urls_new", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  longURL = urlDatabase[shortURL];

  res.redirect(`http://${String(longURL)}`);
})

app.get("/urls/:shortURL", (req, res) => {
  const templateVars = {
    shortURL: req.params.shortURL, 
    longURL: urlDatabase[req.params.shortURL],
    user: users[req.cookies["userID"]]
  }

  res.render("urls_show", templateVars);
});

app.get("/register", (req,res) => {
  const templateVars = {
    user: users[req.cookies["userID"]]
  }

  res.render("register", templateVars);
})

app.get("/hello", (req, res) => {
  res.send("<html>Hello <b>World</b></html>\n")
});

//keep all GET requests above this line




app.listen(PORT, () => {
  console.log(`Server is listening on Port ${PORT}`);
})