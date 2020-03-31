const express = require('express');
const fs = require('fs')
const path = require('path')
const axios = require('axios');
const CircularJSON = require('circular-json');
require ('custom-env').env('stage')
const app = express();
const port = process.env.Port || 8080;
const FILE_TO_READ = "todo.json";

app.use(express.json());

app.listen(port, () => {
  console.log(`Listening on port: ${port}`);
});

/* 
      Activity 1

      Complete the following routes to manage a todo list. 

*/



//Create a route that will retrieve an activity by its ID and display the information of it (name, status, etc)
app.get('/activity/:id', async (req, res) => {
  try {
    const { id } = req.params
    const data = await JSON.parse(fs.readFileSync(path.join(__dirname, FILE_TO_READ), "utf-8"));
    let temp = [];
    if (data.myToDoList && Array.isArray(data.myToDoList)) {
      temp = data.myToDoList.filter(item => item.id === Number(id));
    }
    if (temp.length > 0) {
      res.json(temp[0]);
    }
    else {
      res.send("No record found for id" + id)
    }
  }
  catch (e) {
    res.send("Something went wrong!!")
  }
});

//Create a route that will insert a new activity
app.post('/activity', async (req, res) => {
  try {
    const { id, item, status } = req.body;
    if (id && item && status) {
      let data = await JSON.parse(fs.readFileSync(path.join(__dirname, FILE_TO_READ), "utf-8"));
      if (data.myToDoList && Array.isArray(data.myToDoList)) {
        temp = data.myToDoList.filter(item => item.id === Number(id));
        if (temp.length > 0) {
          res.send("Data already exists with ID " + id)
        }
        else {
          let tempArray = data.myToDoList.concat({
            id,
            item,
            status
          });
          data['myToDoList'] = tempArray;
          let dataToSave = JSON.stringify(data);
          fs.writeFileSync(path.join(__dirname, FILE_TO_READ), dataToSave);
          res.json({
            status: 201,
            message: "Data Prosted Successfully1."
          })
        }
      }
    }
    else {
      res.send("id, item, status : properties needed to create new item!!")
    }

  }
  catch{
    res.send("Somethign went wront!!")
  }
});

//Create a route that will edit an existing activity
app.put('/activity/:id', async (req, res) => {
  try {
    const { item, status } = req.body;
    if (item && status) {
      let data = await JSON.parse(fs.readFileSync(path.join(__dirname, FILE_TO_READ), "utf-8"));
      if (data.myToDoList && Array.isArray(data.myToDoList)) {
        let isEdited = false;
        let tempArray = data.myToDoList.map(obj => {
          if(obj.id === Number( req.params.id)) {
            isEdited = true;
            obj['item'] = item;
            obj['status'] = status;
          }
          return obj;
        });
        
        if (isEdited) {
  
          data['myToDoList'] = tempArray;
          let dataToSave = JSON.stringify(data);
          fs.writeFileSync(path.join(__dirname, FILE_TO_READ), dataToSave);
          res.send("Data successfully edited with ID " + req.params.id)
        }
        else {
         res.send(req.params.id + " ID not found.");
        }
      }
    }
    else {
      res.send("id, item, status : properties needed to create new item!!")
    }

  }
  catch{
    res.send("Somethign went wront!!")
  }
});

/*
    Activity 2

    Using the following API -- https://dog.ceo/dog-api/breeds-list a route to retrieve breed data.

    Notes - no authentication required with this API
          - you may use any library for making the http requests (axios, fetch, etc..)
    
*/


//Create a route that will calling external api
app.get('/externalapi', async (req, res) => {
  try {
    const data = await axios.get("https://dog.ceo/dog-api/breeds-list");
    res.send(CircularJSON.stringify(data));
  }
  catch(e){
    console.log(e)
    res.send("Somethign went wront whele calling external api!!")
  }
});

//This route will allow a user to pass in a specific dog breed and retrieve the list of results
app.get('/breedImages/:breed', (req, res) => { });

/*

    Activity 3

    Assume you need to look up a user from a database and it may take a few seconds to complete.
    You have another function that will then look up that users permissions after getting the user information.

    Convert the userLookup and getUserPermission functions into a promise chain or use async/await to make sure the userPermissions are not called before a user is returned 


*/

app.get('/asyncTest',  async(req, res) => {
  let promise = new Promise((resolve, reject) => {
    setTimeout(() => resolve("Async Result!"), 1000)
  });

  let result = await promise; // wait until the promise resolves (*)
  res.send(result)
});

/*

  Activity 4

  Suppose you have a URL that will be different between your TEST and PRODUCTION environments.
  How would you create an environment variable in node.js so that the url would not need to be hard coded?

*/

app.get('/envVar', (req, res) => {
  //set your env var here
  const myVar = process.env.APP_ENV;
  console.log(`my environment variable is ${myVar}`);
  res.send("Environemnt Variable APP_ENV "+myVar)
});
