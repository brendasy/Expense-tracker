# Expense-tracker


## Getting Started
### Installing
```
install Node.js, this project use version V10.15.0
```
```
install MongoDB
```
## Running the project

#### 1.Clone or download this project
```
git clone https://github.com/brendasy/Expense-tracker.git
```

#### 2.Dowload modules 
```
cd Expense-tracker/
npm install
```

#### 3.Install Nodemon
```
cd Expense-tracker/
npm install -g nodemon
```

#### 4.Initial the seeds data 
```
cd Expense-tracker/models/seeds
npm run seeder
```
Now you can check MongoDB if there are 2 users in users collection and 10 records(6 for one and 4 for the other) data in records collection under record database.

If there are data in record dbs, then you could go on the next step.

#### 5.Execute the web server
```
cd Expense-tracker/
npm run dev
```
#### If you may see the result as following, then you could go on the next step.

    > nodemon app.js

    [nodemon] 2.0.2
    [nodemon] to restart at any time, enter `rs`
    [nodemon] watching dir(s): *.*
    [nodemon] watching extensions: js,mjs,json
    [nodemon] starting `node app.js`
    Express is listening on localhost:3000
    mongodb connected!
    
#### 6.Start the browser

```
Enter the URL http://localhost:3000 at browser
```

## Built With

* [nvm-windows](https://github.com/coreybutler/nvm-windows) - Node.js environment for windows OS
* [nvm](https://github.com/nvm-sh/nvm) - Node.js environment for Linux / Mac OS
* [cmder](https://cmder.net/) - Used to type cmd in windows OS
* [MongoDB](https://www.mongodb.com/) - Database server


## Authors

* **Brenda** 
