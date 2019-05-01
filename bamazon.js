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
  getAllProducts();
});

function getAllProducts() {
  connection.query("Select * From products", function(error, results) {
    if (error) {
      console.log(error);
    }
    // error will be an error if one occured during the query
    // results will contain the results of the query "All Products"
    console.table(results);
    // draws a table in the terminal using the results
    promptCustomers(results);
  });
}
function promptCustomers(inventory) {
  inquirer
    .prompt([
      {
        type: "input",
        message: "What is the ID of the item you are looking for?",
        name: "item"
      }
    ])
    .then(function(choice) {
      var product = checkID(choice.item, inventory);
      console.log(product);
      if (product) {
        promptForQuantity(product);
      } else {
        console.log("Invalid Item Id");
        getAllProducts();
      }
    });
}
function checkID(choice, inventory) {
  for (let i = 0; i < inventory.length; i++) {
    if (inventory[i].item_ID === choice) {
      return inventory[i];
    } else {
      return null;
    }
  }
}
function promptForQuantity(product) {
  inquirer
    .prompt([
      {
        type: "input",
        name: "quantity",
        message: "How many would you like you like to buy?"
      }
    ])
    .then(function(answer) {
      console.log(answer.quantity);
      if (product.stock_quantity > answer.quantity) {
        makePurchase(product, answer.quantity);
      } else {
        console.log("Insufficient Quantity");
        getAllProducts();
      }
    });
}

function makePurchase(product, quantity) {
  connection.query(
    "Update products SET stock_quantity = stock_quantity - quantity WHERE item_ID = product.item_ID",
    function(error, results) {
      console.log(error);
      console.log("You made a successful purchase!");
      console.log(
        "You bought this item for this much: " + product.price * quantity
      );
      getAllProducts();
    }
  );
}
