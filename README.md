[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-24ddc0f5d75046c5622901739e7c5dd533143b0c8e959d652212380cedb1ea36.svg)](https://classroom.github.com/a/_XpznRuT)
# Exam #12345: "Exam Title"

## Student: s123456 LASTNAME FIRSTNAME 

# Server side

## API Server

- POST `/api/login`
  - request parameters
  - request body content: email, password
  - response body content: login result
- POST `/api/logout`
  - request parameters
  - response body content: logout result
- GET `/api/pages`
  - request parameters
  - request body content
  - response body content: list of all the website pages
- GET `/api/pages/:pageid`
  - request parameters: page id
  - request body content
  - response body content: list a page content
- POST `/api/pages/`
  - request parameters
  - request body content: list of blocks
  - response body content: result
- DELETE `/api/pages/:pageid`
  - request parameters: page id
  - request body content
  - response body content: result
- PUT `/api/pages/:pageid`
  - request parameters: page id
  - request body content: list of blocks
  - response body content: result

## Database Tables

- Table `users` - contains the registered users 
  (id, username, email, role)
- Table `pages` - contains the website pages
  (id, title, idUser, creationDate, publicationDate)
- Table `blocks` - contains the website contents
  (id, idPage, type, content)

# Client side


## React Client Application Routes

- Route `/`: page content and purpose
- Route `/something/:param`: page content and purpose, param specification
- ...


## Main React Components

- `ListOfSomething` (in `List.js`): component purpose and main functionality
- `GreatButton` (in `GreatButton.js`): component purpose and main functionality
- ...

(only _main_ components, minor ones may be skipped)

# Usage info

## Example Screenshot

![Screenshot](./img/screenshot.jpg)

## Users Credentials

- username, password (plus any other requested info)
- username, password (plus any other requested info)
