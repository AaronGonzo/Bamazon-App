let mysql = require("mysql");
let inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "Arsenal3190",
  database: "bamazon_DB"
});

// connect mysql server and sql database
connection.connect(function(error) {
  if (error) {
    console.log("Error connecting: " + error.stack);
    return;
  }
  console.log("connected as id " + connection.threadId);
  managerPrompt();
});

function managerPrompt() {
  inquirer
    .prompt([
      {
        type: "list",
        message: "What would you like to do?",
        choices: [
          "View Products for Sale",
          "View Low Inventory",
          "Add to Inventory",
          "Add New Product"
        ],
        name: "choice"
      }
    ])
    .then(function(answer) {
      if (answer.choice === "View Products for Sale") {
        getAllProducts();
      } else if (answer.choice === "View Low Inventory") {
        lowInventory();
      } else if (answer.choice === "Add to Inventory") {
        addToInventory();
      } else if (answer.choice === "Add New Product") {
        addNewProduct();
      } else {
        console.log("Please choose an option");
        managerPrompt();
      }
    });
}

// function to see all products listed in the products table
function getAllProducts() {
  connection.query("Select * From products", function(error, results) {
    if (error) {
      console.log(error);
    }
    // error will be an error if one occured during the query
    // results will contain the results of the query "All Products"
    console.table(results);
    // draws a table in the terminal using the results
  });
  managerPrompt();
}

function lowInventory() {
  connection.query("SELECT * FROM products WHERE stock_quantity < 20", function(
    error,
    results
  ) {
    if (error) {
      console.log(error);
    }
  });
  
}
