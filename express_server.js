const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const app = express();
const PORT = 8080;

app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xk": "http://www.google.com"
};

const generateRandomString = () => {
  const length = 6;
  return Math.random().toString(32).substr(2, length);
}

app.set("view engine", "ejs");

//Keep all sets and use above this line

app.post("/urls", (req, res) => {
  const newURL = generateRandomString();
  urlDatabase[newURL] = req.body.longURL;
  const templateVars = { shortURL: newURL, longURL: urlDatabase[newURL]};

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

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/urls", (req,res) => {
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars)
});

app.get("/urls/new", (req,res) => {
  
  res.render("urls_new");
});

app.get("/u/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  longURL = urlDatabase[shortURL];

  res.redirect(`http://${String(longURL)}`);
})

app.get("/urls/:shortURL", (req, res) => {
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL]}

  res.render("urls_show", templateVars);
})

app.get("/hello", (req, res) => {
  res.send("<html>Hello <b>World</b></html>\n")
});

//keep all GET requests above this line




app.listen(PORT, () => {
  console.log(`Server is listening on Port ${PORT}`);
})