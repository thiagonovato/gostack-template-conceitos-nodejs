const express = require("express");
const cors = require("cors");
const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

/**
 * Middleware que checa se uuid é válido
 */

function validUuid(request, response, next) {
  const { id } = request.params;

  if (!isUuid(id)) return response.json({ error: "Invalid Repository ID" });

  return next();
}

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  };

  repositories.push(repository);

  console.log("criado");
  response.json(repository);
});

app.put("/repositories/:id", validUuid, (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const repositoryIndex = repositories.findIndex(
    (repository) => repository.id === id
  );

  if (repositoryIndex < 0)
    return response.json({ error: "Repository not found" });

  const repository = {
    id,
    title,
    url,
    techs,
  };

  repositories[repositoryIndex] = repository;

  return response.json(repository);
});

app.delete("/repositories/:id", validUuid, (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(
    (repository) => repository.id === id
  );

  if (repositoryIndex < 0)
    return response.json({ error: "Repository not found" });

  repositories.splice(repositoryIndex, 1);

  return response.send();
});

app.post("/repositories/:id/like", validUuid, (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(
    (repository) => repository.id === id
  );

  if (repositoryIndex < 0)
    return response.json({ error: "Repository not found" });

  let repository = repositories[repositoryIndex];

  repository.likes++;

  repositories[repositoryIndex] = repository;

  return response.json(repository);
});

module.exports = app;
