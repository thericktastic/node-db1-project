const express = require("express");

// This grants database access using Knex
const db = require("../data/dbConfig.js");

const router = express.Router();

// This GET retrieves all existing accounts
router.get("/", (request, response) => {
  db.select("*")
    .from("accounts")
    .then(accounts => {
      console.log("This is accounts in router.get('/'): ", accounts);
      response.status(200).json(accounts);
    })
    .catch(error => {
      console.log("This is error in router.get('/'): ", error);
      response.status(500).json({ error: "Failed retrieving accounts" });
    });
});

// This POST creates a new account
router.post("/", (request, response) => {
  db("accounts")
    .insert(request.body, "id") // ignore the warning this generates
    .then(ids => {
      return getById(ids[0]).then(inserted => {
        response.status(201).json(inserted);
      });
    })
    .catch(error => {
      console.log("This is error in router.post('/'): ", error);
      response.status(500).json({ error: "Error adding account" });
    });
});

// This PUT updates a specified account
router.put("/:id", (request, response) => {
  const id = request.params.id;
  db("accounts")
    .where({ id: id })
    .update(request.body)
    .then(count => {
      console.log("This is count: ", count);
      return getById(id).then(updated => {
        response.status(200).json(updated);
      });
    })
    .catch(error => {
      console.log("This is error in router.put('/:id'): ", error);
      response.status(500).json({ error: "Failed to update account" });
    });
});

// This DELETE annhilates a specified account
router.delete("/:id", (request, response) => {
  const id = request.params.id;
  db("accounts")
    .where({ id })
    .del()
    .then(count => {
      response
        .status(200)
        .json({ message: "This account has ceased to exist" });
    })
    .catch(error => {
      console.log("This is error in router.delete('/:id'): ", error);
      response.status(500).json({ error: "Error deleting account" });
    });
});

module.exports = router;

function getById(id) {
  return db("accounts")
    .where({ id })
    .first();
}
