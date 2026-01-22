require("dotenv").config();
const app = require("./app");
const connectDB = require("./app/db/config");

connectDB();

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`server is running on ${PORT}`);
});
