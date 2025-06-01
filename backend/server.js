import express from "express";
import dotenv   from "dotenv";
import path     from "path";
import { connectDb } from "../backend/config/db.js";
import productRoutes from "./routes/Product.route.js";

dotenv.config();
const app = express();
const __dirname = path.resolve();

/* Body parsers */
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

app.use((req, res, next) => {
    console.log("🔍 Incoming request:", req.method, req.url);
    next();
  });

/* API routes */
app.use("/products", productRoutes);



/* ---------  Production  --------- */
if (process.env.NODE_ENV === "production") {
    console.log(process.env.NODE_ENV);
  // Serve built React files
  app.use(express.static(path.join(__dirname, "frontend", "dist")));

  // All GET requests that aren’t for a file go to index.html
  app.get('/*splat', (req, res) => {
    res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
  });
}

/* Optional JSON 404 (after everything) */
/*app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});*/

/* ---------  Start server  --------- */
const startServer = async () => {
  try {
    await connectDb();
    console.log("✅ MongoDB connected");

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`🚀 Server on port ${PORT}`));
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err);
    process.exit(1);
  }
};

startServer();
