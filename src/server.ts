import app from "./app.js";

// Start the server
const bootStrap = async () => {
  try {
    app.listen(process.env.PORT, () => {
      console.log(`Server is running on http://localhost:${process.env.PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server", error);
  }
};

bootStrap();
