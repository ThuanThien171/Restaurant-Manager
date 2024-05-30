## ReMaT Project

### Table of contents

- General Description
- Technologies
- Set up Instruction

### General Description:

- A website used to help manage restaurant
- Made by Thien

### Technologies

- ReactJS (FE)
- NodeJS (BE)
- PHPMyadmin (MySQL)
- ChakraUI (ReactJS Framework)
- Firebase (used for uploading images files)

### I. Set up Instruction using Xampp

- Make sure you have the following tool(s) installed:
  - **npm/npx** and **node**
  - **Xampp**

##### 1. After cloning this project from github, you should install the widget modules for "reactjs" folder

```

 ... $ cd /reactjs
 .../reactjs $ npm i
```

##### 2. The "npm i" command will read .json package and automatically install. After installing, try "npm start"

```
 .../reactjs $ npm start
```

##### 3. Then, install the widget modules for "server" folder

```
 ... $ cd /server
 .../server $ npm i
```

##### 4. After installing the neccessary packages, rename the ".env.example" file into ".env" | or add a new file ".env" with the same content in ".env.example"

```
 .../server $ (sudo) cp env.example .env
```

- Then, change your database name in 'configSql.js'

##### 5. Migrate DB

```
 .../server $ npx sequelize-cli db:migrate
```

##### 6. Then start your xampp database. Finally, try "npm run dev"

```
  .../server $ npm run dev
```

### II. Some images about this project

<p align="center">
  <p align="center">
  Chart
  </p>

  <img src="https://github.com/ThuanThien171/Restaurant-Manager/blob/master/image/chart.png" width="100%" />
  <br />
  <p align="center">
  Order
  </p>

  <img src="https://github.com/ThuanThien171/Restaurant-Manager/blob/94ce4a8ad000ba6ed247ae9ee3fc7ed7f77d527f/image/order.png" width="100%" />
  <br />
  <p align="center">
  Menu
  </p>

  <img src="https://github.com/ThuanThien171/Restaurant-Manager/blob/94ce4a8ad000ba6ed247ae9ee3fc7ed7f77d527f/image/menu.png" width="100%" />
  <br />
  <p align="center">
  Table
  </p>

  <img src="https://github.com/ThuanThien171/Restaurant-Manager/blob/94ce4a8ad000ba6ed247ae9ee3fc7ed7f77d527f/image/table.png" width="100%" />
  <br />
  <p align="center">
  Kitchen  
  </p>

  <img src="https://github.com/ThuanThien171/Restaurant-Manager/blob/adeebf77a14bf67206393536cf113fa5e369e3ea/image/kitchen.png" width="100%" />
  <br />
  <p align="center">
  Staff management  
  </p>

  <img src="https://github.com/ThuanThien171/Restaurant-Manager/blob/94ce4a8ad000ba6ed247ae9ee3fc7ed7f77d527f/image/staff-manage.png" width="100%" />
  <br />
  <p align="center">
  Responsive  
  </p>
<div>
  <img src="https://github.com/ThuanThien171/Restaurant-Manager/blob/4ae26207924907eb0d19605c3383f0e54eb27fc3/image/menu-mobile.png" width="30%" />
  <img src="https://github.com/ThuanThien171/Restaurant-Manager/blob/4ae26207924907eb0d19605c3383f0e54eb27fc3/image/order-mobile.png" width="30%" />
  <img src="https://github.com/ThuanThien171/Restaurant-Manager/blob/4ae26207924907eb0d19605c3383f0e54eb27fc3/image/table-mobile.png" width="30%" />
</div>
</p>
