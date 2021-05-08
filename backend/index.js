const express = require("express");
const cors = require("cors");
const Datastore = require("nedb");
const database = new Datastore("database.db");
const app = express();
const port = 8973;
app.listen(port, () => console.log(`Port ${port}`));
app.use(cors());
app.use(express.static("public"));
app.use(express.json({ limit: "1mb" }));
app.get("/api", (request, response) => {
    database.find({}, (err, data) => {
        response.json(data);
    });
});
app.post("/api", (request, response) => {
    console.log("request received on server");
    console.log(request.body);
    database.insert(request.body);
    response.json({
        status: "success",
    });
});
database.loadDatabase();
database.insert({ name: "Oliver", last: "EC" });
