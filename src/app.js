const express = require("express");
const jsonwebtoken = require("jsonwebtoken");
const dotEnv = require("dotenv");
const bcryptjs = require("bcryptjs");

dotEnv.config();
const app = express();
app.use(express.json());

const products = [
  {
    id: 1,
    name: "Laptop",
    description: "Macbook 2021",
    price: 100,
    category: "Electronics",
    rating: 4,
    availability: true,
    dateAdded: "2021-09-01",
    dateUpdated: "2021-09-01",
    dateDeleted: null,
  },
  {
    id: 2,
    name: "Lamp",
    description: "cool lamp for ur house",
    price: 200,
    category: "Furniture",
    rating: 3,
    availability: true,
    dateAdded: "2021-09-01",
    dateUpdated: "2021-09-01",
    dateDeleted: null,
  },
  {
    id: 3,
    name: "Pizza",
    description: "yummy yummy",
    price: 300,
    category: "Food",
    rating: 5,
    availability: true,
    dateAdded: "2021-09-01",
    dateUpdated: "2021-09-01",
    dateDeleted: null,
  },
];

const users = [];

app.get("/products", (req, res, next) => {
  //should be able to type in the name of a product, and see the results (if any)
  const searchedProduct = req.body.searchedProduct;
  const category = req.body.category;
  const rating = req.body.rating;
  const availability = req.body.rating;
  if (req.body) {
    // read the name given and search for matching products or simlar products
    let foundProducts = [...products];

    if (searchedProduct && searchedProduct.length > 0) {
      foundProducts = foundProducts.filter((product) => {
        return !product.name.includes(searchedProduct);
      });
    }
    if (category) {
      foundProducts = foundProducts.filter((product) => {
        return !product.category === category;
      });
    }
    if (rating) {
      foundProducts = foundProducts.filter((product) => {
        return !product.rating >= rating;
      });
    }
    if (availability) {
      foundProducts = foundProducts.filter((product) => {
        return !product.availability === availability;
      });
    }

    // get an input, check the input if it exists, use in filter

    res.send(foundProducts);
  } else {
    res.send(products);
  }
});

app.get("/products/:id", (req, res, next) => {
  // get the product by id
  const foundProduct = products.find((product) => {
    if (product.id === parseInt(req.params.id)) {
      return true;
    } else {
      return false;
    }
  });
  if (foundProduct) {
    res.send(foundProduct);
  } else {
    res.status(404).send("Product not found.");
  }
});

app.post("/products", (req, res, next) => {
  //get the variables from the body
  //add the new product to products array
  // send back newly created object (product)
  const { name, description, price, category, rating, availability } = req.body;
  const newProduct = {
    id: products[products.length - 1].id + 1,
    name: name,
    description: description,
    price: price,
    category: category,
    rating: rating,
    availability: availability,
    dateAdded: new Date().toString(),
    dateUpdated: new Date().toString(),
    dateDeleted: null,
  };
  products.push(newProduct);
  res.send(newProduct);
});

app.put("/products/:id", (req, res, next) => {
  const foundProduct = products.find((product) => {
    if (product.id === parseInt(req.params.id)) {
      return true;
    } else {
      return false;
    }
  });
  if (foundProduct) {
    const index = products.findIndex(foundProduct);
    // update product at index with new details
    products[index] = {
      ...foundProduct,
      ...req.body,
      dateUpdated: new Date().toString(),
    };
  } else {
    res.status(404).send("Product not found.");
  }
});

app.delete("/products/:id", (req, res, next) => {
  //select the product by id that you would like to delete
  //delete it
  const foundProduct = products.find((product) => {
    if (product.id === parseInt(req.params.id)) {
      return true;
    } else {
      return false;
    }
  });
  if (foundProduct) {
    // remove it from the list and return new list
    const index = products.findIndex(
      (product) => product.id === parseInt(req.params.id)
    );
    products.splice(index, 1);
    res.send(products);
  } else {
    res.status(404).send("Product not found.");
  }
});

app.post("/auth", async (req, res, next) => {
  const { username, password } = req.body;
  if (username && password) {
    // to log in : verify username and password is valid to an existing account - send back JWT if successful
    const userExists = users.find((user) => {
      if (user.username === username) {
        return true;
      } else {
        return false;
      }
    });
    if (userExists) {
      const matches = await bcryptjs.compare(password, userExists.password);
      if (matches) {
        const token = jsonwebtoken.sign(
          {
            id: userExists.id,
          },
          process.env.JWT_SECRET
        );
        res.send(token);
      } else {
        res.status(401).send("Incorrect credentials.");
      }
    } else {
      res.status(404).send("Not found.");
    }
  } else {
    res.status(400).send("Bad request.");
  }
});

app.post("/register", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const newUser = {
    id: users.length === 0 ? 1 : users[users.length - 1].id + 1,
    username: username,
    password: password,
  };
  const token = jsonwebtoken.sign(
    {
      id: users.length === 0 ? 1 : users[users.length - 1].id + 1,
    },
    process.env.JWT_SECRET
  );
  // adding user to user list
  // send token at end
  users.push(newUser);
  res.send(token);
});

app.get("/users/:id", (req, res) => {
  const found = users.find((user) => user.id === parseInt(req.params.id));

  res.send(found);
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
