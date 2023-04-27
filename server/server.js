const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const mongoose = require("mongoose");
const app = require("./app");

// MAKE DB CONNECTION
// DB CONNECTION WITH MONGOOSE
mongoose.set("strictQuery", false);
mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("sucessfully connected to database"));

const port = 8000;
app.listen(port, () => console.log(`Server started on port: ${port}`));
