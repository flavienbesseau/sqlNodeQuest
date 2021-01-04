//Bonne lecture <3

const express = require("express");
const connection = require("./config");

const port = 6000;

const app = express();

connection.connect(function (err) {
  if (err) {
    console.error("error connecting: " + err.stack);
    return;
  }
  console.log("connected as id " + connection.threadId);
});

app.use(express.json());

//GET - Retrieve all of the data from your table
app.get("/api/data", (req, res) => {
  connection.query("SELECT * FROM videogame", (err, results) => {
    if (err) {
      res.status(500).send("Error retrieving data");
      console.log(err);
    } else {
      res.status(200).json(results);
      console.log(results);
    }
  });
});

//GET - Retrieve specific fields (i.e. id, names, dates, etc.)
app.get("/api/data/names", (req, res) => {
  connection.query("SELECT name FROM videogame", (err, results) => {
    if (err) {
      res.status(500).send("Error retrieving data");
    } else {
      res.status(200).json(results);
    }
  });
});

//A filter for data that contains... (e.g. name containing the string 'wcs')
app.get("/api/data/names/containsOf", (req, res) => {
  connection.query(
    "SELECT * FROM videogame WHERE name LIKE '%of%'",
    (err, results) => {
      if (err) {
        res.status(500).send("Error retrieving data");
      } else {
        res.status(200).json(results);
      }
    }
  );
});

//A filter for data that starts with... (e.g. name beginning with 'campus')
app.get("/api/data/names/startwithThe", (req, res) => {
  connection.query(
    "SELECT * FROM videogame WHERE name LIKE 'The%'",
    (err, results) => {
      if (err) {
        res.status(500).send("Error retrieving data");
      } else {
        res.status(200).json(results);
      }
    }
  );
});

//A filter for data that is greater than... (e.g. date greater than 18/10/2010)
app.get("/api/data/releasedate", (req, res) => {
  connection.query(
    "SELECT * FROM videogame WHERE releasedate > '2000-02-01'",
    (err, results) => {
      if (err) {
        console.log(err);
        res.status(500).send("Error retrieving data");
      } else {
        res.status(200).json(results);
      }
    }
  );
});

//GET - Ordered data recovery (i.e. ascending, descending) - The order should be passed as a route parameter
app.get("/api/data/gamesRecovery/:order", (req, res) => {
  connection.query(
    "SELECT * FROM videogame ORDER BY name " + req.params.order,
    [], // on injecte pas de params via la syntaxe "?", car celle-ci rajoute des quotes autour de ASC/DESC, et ce n'est pas une syntaxe correcte
    (err, results) => {
      if (err) {
        res.status(500).send("Error retrieving data");
      } else {
        res.status(200).json(results);
      }
    }
  );
});

//POST - Insertion of a new entity
app.post("/api/data/newGame", (req, res) => {
  console.log(req.body);
  const { name, nudity, minimumage, releasedate } = req.body;
  connection.query(
    "INSERT INTO videogame(name, nudity, minimumage, releasedate) VALUES(?, ?, ?, ?)",
    [name, nudity, minimumage, releasedate],
    (err, results) => {
      if (err) {
        res.status(500).send("Error saving a game");
      } else {
        res.status(200).send("Successfully saved");
      }
    }
  );
});

//PUT - Modification of an entity
app.put("/api/data/changegamedata/:id", (req, res) => {
  console.log(req.body);
  const idGame = req.params.id;
  const newGame = req.body;
  connection.query(
    "UPDATE videogame SET ? WHERE id = ?",
    [newGame, idGame],
    (err, results) => {
      if (err) {
        console.log(err);
        res.status(500).send("Error updating a user");
      } else {
        res.status(200).send("Game updated successfully 🎉");
      }
    }
  );
});

//PUT - Toggle a Boolean value
app.put("/api/data/changegamenudity/:id", (req, res) => {
  const idGame = req.params.id;
  const newGame = req.body;
  connection.query(
    "UPDATE videogame SET nudity = IF(nudity = 0, 1, 0) WHERE id = " + idGame,
    [newGame],
    (err, results) => {
      if (err) {
        console.log(err);
        res.status(500).send("Error updating a game");
      } else {
        res.status(200).send("Game updated successfully 🎉");
      }
    }
  );
});

//DELETE - Delete an entity
app.delete("/api/data/removemovie/:id", (req, res) => {
  const idGame = req.params.id;
  connection.query(
    "DELETE FROM videogame WHERE id = " + idGame,
    (err, results) => {
      if (err) {
        console.log(err);
        res.status(500).send("😱 Error deleting a Game");
      } else {
        res.status(200).send("🎉 Game deleted!");
      }
    }
  );
});

//DELETE - Delete all entities where boolean value is false
app.delete("/api/data/removemoviesfalse", (req, res) => {
  connection.query(`DELETE FROM videogame WHERE nudity = 0`, (err, results) => {
    if (err) {
      console.log(err);
      res.status(500).send("😱 Error deleting games");
    } else {
      res.status(200).send("🎉 Game deleted!");
    }
  });
});

app.listen(port, () => {
  console.log(`Server is runing on ${port}`);
});
