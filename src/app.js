const express = require("express");
const ProductManager = require("./dao/ProductManager.js");

const productManager = new ProductManager("./src/data/products.json");
const PORT = 8080;
const app = express();

app.get("/", (req, res) => {
    res.send("Página Principal");
});

app.get("/products", async (req, res) => {
    try {
        const productos = await productManager.leerProducto();
        res.status(200).json({ productos });
    } catch (error) {
        res.status(500).json({ error: "Error al obtener los productos" });
    }
});

app.get("/products/:pid", async (req, res) => {
    try {
        const productos = await productManager.leerProducto();
        let id = req.params.pid;
        id = Number(id);
        if (isNaN(id)) {
            return res.status(400).json({ error: "El ID debe ser un número" });
        }

        const product = productos.find(prod => prod.id === id);
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ message: `No existe un producto con el ID ${id}` });
        }
    } catch (error) {
        res.status(500).json({ error: "Error al obtener el producto" });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor en línea en el puerto ${PORT}`);
});
