# TinyApp Project

TinyApp is a full stack web application built with Node and Express that allows users to shorten long URLs (à la bit.ly).

## Final Product

Home page for users who are not logged in shows an error message while directing to login page.

!["login page"](/screenshots/Home_Not_LoggedIn.png)

You must be registered to log in, so press register and enter an email or password. Registering will sign you in. 
!["register page"](/screenshots/Register.png)

Once logged in, you can navigate to the Create New URL page to shorten a url of your choice.

!["create page"](/screenshots/create.png)

Once created, you will immeadiately be taken to the short url page, where you can update your long url if you like. 

!["short url page"](/screenshots/short.png)

!["register page"](#)


## Dependencies

- Node.js
- Express
- EJS
- bcrypt
- body-parser
- cookie-session


## Getting Started

- Install all dependencies (using the `npm install` command).
- Run the development web server using the `npm start` command.
