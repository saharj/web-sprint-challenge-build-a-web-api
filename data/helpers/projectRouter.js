const express = require("express");

const ProjectDb = require("./projectModel");

const Router = express.Router();

Router.get("/", (req, res) => {
  ProjectDb.get()
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((error) => {
      res.status(500).json({
        message: "Error getting the project data",
      });
    });
});

Router.get("/:id", validateId, (req, res) => {
  res.status(200).json(req.proj);
});

Router.post("/", validateProject, (req, res) => {
  ProjectDb.insert(req.body)
    .then((resp) => {
      res.status(201).json(resp);
    })
    .catch((err) => {
      res.status(500).json({ message: "Error adding the project" });
    });
});

function validateId(req, res, next) {
  const { id } = req.params;

  ProjectDb.get(id)
    .then((data) => {
      if (data) {
        req.proj = data;
        next();
      } else {
        res.status(400).send("invalid project id");
        next();
      }
    })
    .catch((err) => {
      res.status(500).send("Something didn't work.");
      next();
    });
}
function validateProject(req, res, next) {
  if (!req.body) {
    res.status(400).json({ message: "Missing action data" });
  } else if (!req.body.name) {
    res.status(400).json({ message: "Request is missing name" });
  }
  next();
}

module.exports = Router;
