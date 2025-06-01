
import Products from "../Models/Product.model.js";


export const getAllProducts = async (req, res) => {
    try {
        const products = await Products.find(); // fetch all products
        res.status(200).json(products);
    } catch (error) {
        console.error("Error fetching products:", error.message);
        res.status(500).json({ message: "Failed to fetch products" });
    }
};

export const addnewProduct =  async (req, res) => {
    try {
        const {
            name,
            description,
            price,
            image,
            category,
            countInStock
        } = req.body;

        // Basic validation (optional but recommended)
        if (!name || !description || !price || !category) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const newProduct = new Products({
            name,
            description,
            price,
            image,
            category,
            countInStock
        });

        const savedProduct = await newProduct.save();

        res.status(201).json({"success":true,"message":"done","product":savedProduct});
    } catch (error) {
        console.error("Error creating product:", error.message);
        res.status(500).json({ message: "Failed to create product" });
    }
};


export const UpdateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedData = req.body;

        const updatedProduct = await Products.findByIdAndUpdate(id, updatedData, { new: true });

        if (!updatedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.status(200).json({ success: true, message: "Product updated", product: updatedProduct });
    } catch (error) {
        console.error("Error updating product:", error.message);
        res.status(500).json({ message: "Failed to update product" });
    }
};

export const DeleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedProduct = await Products.findByIdAndDelete(id);

        if (!deletedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.status(200).json({ success: true, message: "Product deleted" });
    } catch (error) {
        console.error("Error deleting product:", error.message);
        res.status(500).json({ message: "Failed to delete product" });
    }
};