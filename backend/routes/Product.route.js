import express from "express";

import Products from "../Models/Product.model.js";
import { addnewProduct, DeleteProduct, getAllProducts, UpdateProduct } from "../controllers/Product.controller.js";

const router = express.Router();

router.get("/", getAllProducts);


router.post("/", addnewProduct);

router.put("/:id", UpdateProduct);


router.delete("/:id", DeleteProduct);
export default router;