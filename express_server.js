const express = require("express");
const bodyParser = require("body-parser")
const app = express();
const PORT = 8080;

app.use(bodyParser.urlencoded({extended: true}));

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xk": "http://www.google.com"
};


app.set("view engine", "ejs");

//Keep all sets above this line

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