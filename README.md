[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-24ddc0f5d75046c5622901739e7c5dd533143b0c8e959d652212380cedb1ea36.svg)](https://classroom.github.com/a/_XpznRuT)
# Exam #1: "CMSmall"

## Student: s310166 GALELLA ANDREA 

# Server side

## API Server

- POST `/api/login`
  - request parameters: none
  - request body content: email, password
  - response body content: post result
- POST `/api/logout`
  - request parameters: none
  - request body content: none
  - response body content: post result
- GET `/api/users`
  - request parameters: none
  - request body content: none
  - response body content: array of objects containing all users id and usernames
- GET `/api/users/:idUser`
  - request parameters: user id
  - request body content: none
  - response body content: object containing user's username
- GET `/api/name`
  - request parameters: none
  - request body content: none
  - response body content: object containing the website title
- PUT `/api/name`
  - request parameters: none
  - request body content: title
  - response body content: put result
- GET `/api/pages/all`
  - request parameters: none
  - request body content: none
  - response body content: array of objects containing all pages properties
- GET `/api/pages`
  - request parameters: none
  - request body content: none
  - response body content: array of objects containing published pages properties
- POST `/api/pages`
  - request parameters: none
  - request body content: title, idUser, creationDate, publicationDate, blocks
  - response body content: post result
- PUT `/api/pages/:idPage`
  - request parameters: idPage
  - request body content: idPage, title, idUser, creationDate, publicationDate
  - response body content: put result
- DELETE `/api/pages/:idPage`
  - request parameters: idPage
  - request body content: none
  - response body content: delete result
- GET `/api/pages/:idPage`
  - request parameters: idPage
  - request body content: none
  - response body content: array of objects containing page's blocks (for all pages)
- GET `/api/pages/pub/:idPage`
  - request parameters: idPage
  - request body content: none
  - response body content: array of objects containing page's blocks (for only published pages)
- POST `/api/pages/:idPage`
  - request parameters: idPage
  - request body content: idPage, type, content, position
  - response body content: post result
- PUT `/api/pages/:idPage/blocks/:idBlock`
  - request parameters: idPage, idBlock
  - request body content: idPage, idBlock, type, content, position
  - response body content: put result
- DELETE `/api/pages/:idPage/blocks/:idBlock`
  - request parameters: idPage, idBlock
  - request body content: position
  - response body content: delete result

## Database Tables

- Table `website` - contains the website title
  (id, title)
- Table `users` - contains the registered users 
  (id, username, email, role, password, salt)
- Table `pages` - contains the website pages
  (id, title, idUser, creationDate, publicationDate)
- Table `blocks` - contains the website blocks
  (id, idPage, type, content, position)

# Client side


## React Client Application Routes

- Route `/`: shows the list of all the pages for registered users and
the list of published pages for anonymous ones
- Route `/login`: used for login
- Route `/pages/:idPage`: shows all the page blocks
- Route `/pages/add`: used to add blocks for a new page

## Main React Components

- `PagesList` (in `PagesList.jsx`): retrieves the pages and shows them, 
handles the insertion of properties for a new page, editing a page properties,
deleting a page.
- `BlockList` (in `BlockList.jsx`): retrieves page blocks and shows them,
handles adding new blocks, editing blocks, deleting a block.
- `AddPage` (in `AddPage.jsx`): handles the adding of blocks for a new page.
- `LoginForm` (in `Login.jsx`): contains the login form

(only _main_ components, minor ones may be skipped)

# Usage info

## Example Screenshot

![login](./images/login.png)
![front-office](./images/front-office.png)
![front-office-page](./images/front-office-page.png)
![admin-back-office](./images/admin-back-office.png)
![admin-back-office-page](./images/admin-back-office-page.png)
![update-page-props](./images/update-page-props.png)
![update-block-content](./images/update-block-content.png)
![add-blocks-new-page](./images/add-blocks-new-page.png)

## Users Credentials

- email: test1@test.com, password: password
  - username: test1, role: regular
- email: test2@test.com, password: password
  - username: test2, role: admin
- email: test3@test.com, password: password
  - username: test3, role: regular
- email: test4@test.com, password: password
  - username: test4, role: admin
