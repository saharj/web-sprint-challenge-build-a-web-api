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

Router.get("/:id/actions", (req, res) => {
  const { id } = req.params;
  ProjectDb.getProjectActions(id)
    .then((resp) => {
      res.status(200).json(resp);
    })
    .catch((err) => {
      res.status(500).json({ message: "Error finding the actions" });
    });
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

Router.delete("/:id", validateId, (req, res) => {
  const { id } = req.params;
  ProjectDb.remove(id)
    .then((resp) => {
      res.status(200).json({ message: "Project is removed successfully." });
    })
    .catch((err) => {
      res.status(500).json({ message: "Error removing the project" });
    });
});

Router.put("/:id", [validateId, validateProject], (req, res) => {
  const { id } = req.params;
  ProjectDb.update(id, req.body)
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      res.status(500).json({ message: "Error updating the action" });
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
