const http = require("http");
const fs = require("fs");
const { graphql, buildSchema } = require("graphql");
const schema = buildSchema(fs.readFileSync("D:/University/cross/labs/lab16/schema.gql", "utf8").toString());
const { DB } = require("D:/University/cross/labs/lab16//DB");
const resolver = require("D:/University/cross/labs/lab16//Resolver");


const PORT = 3000;

const database = DB((err) => {
  if (err) {
    console.log(err);
  }
});

http.createServer((req, res) => {
  switch (req.method) {
    case "POST":
      let body = "";

      req.on("data", (data) => {
        body += data;
      });

      req.on("end", () => {
        body = JSON.parse(body);

        graphql(
          schema,
          body.query,
          resolver,
          database,
          body.variables ? body.variables : {}
        )
          .then((body) => {
            res.writeHead(200, {
              "Content-type": "application/json; charset=utf-8",
            });
            res.end(JSON.stringify(body));
          })
          .catch((err) => {
            error_handler(err, req, res)
          });
      });
      break;
    default:
      res.writeHead(404);
      res.end('method not found');
      break;
  }
})
  .listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
  });

const error_handler = (err, req, res) => {
  res.writeHead(500, {
    "Content-type": "application/json; charset=utf-8",
  });
  res.end(JSON.stringify({ error: err.message }));
};
