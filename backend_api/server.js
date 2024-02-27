const express = require('express');
const cors = require('cors');
const multer = require('multer');
const sharp = require('sharp');

const app = express();
//cors
var corsOptions = {
  origin: "http://localhost:3000"
};

app.use(cors(corsOptions));
//parse requests of content-type - application/json
app.use(express.json());
//parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
// image retrieval

app.get("/", (req, res) => {
  res.json({ message: "Welcome to the application." });
});

const db = require("./app/models");
db.mongoose
  .connect(db.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Connected to the database!");
  })
  .catch(err => {
    console.log("Cannot connect to the database!", err);
    process.exit();
  });

require("./app/routes/item.routes")(app);
require("./app/routes/image.routes")(app);

const PORT = process.env.PORT || 3030;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
