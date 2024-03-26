const fs = require("fs").promises; // Importar fs.promises para usar promesas
const path = require("path"); // Importar path para manejar rutas de archivos

class ProductManager {
    constructor(filePath) {
        this.filePath = filePath;
    }

    async leerProductos() {
        try {
            const data = await fs.readFile(this.filePath, { encoding: "utf-8" });
            return JSON.parse(data);
        } catch (error) {
            console.error("Error al leer el archivo:", error);
            return [];
        }
    }

    async guardarProductos(productos) {
        try {
            await fs.writeFile(this.filePath, JSON.stringify(productos, null, 2));
            console.log("Productos guardados exitosamente.");
        } catch (error) {
            console.error("Error al guardar los productos:", error);
        }
    }

    async actualizarProducto(id, productoActualizado) {
        let productos = await this.leerProductos();
        const indice = productos.findIndex(prod => prod.id === id);
        if (indice !== -1) {
            productos[indice] = { ...productos[indice], ...productoActualizado };
            await this.guardarProductos(productos);
            console.log("El producto se ha actualizado.");
        } else {
            console.log(`No se encontró ningún producto con el ID ${id}.`);
        }
    }

    async eliminarProducto(id) {
        let productos = await this.leerProductos();
        const indice = productos.findIndex(prod => prod.id === id);
        if (indice !== -1) {
            productos.splice(indice, 1);
            await this.guardarProductos(productos);
            console.log("Producto eliminado.");
        } else {
            console.log(`No se encontró ningún producto con el ID ${id}.`);
        }
    }

    async asignarId(productos) {
        return productos.length > 0 ? productos[productos.length - 1].id + 1 : 1;
    }

    async agregarProducto(producto) {
        if (!producto.title || !producto.description || !producto.price || !producto.thumbnail || !producto.code || !producto.stock) {
            return "Todos los parámetros son requeridos.";
        }

        let productos = await this.leerProductos();

        const existe = productos.find(p => p.code === producto.code);
        if (existe) {
            return `El código ${producto.code} ya está en uso.`;
        }

        producto.id = await this.asignarId(productos);
        productos.push(producto);

        await this.guardarProductos(productos);
        return producto;
    }
}

async function ejemplo() {
    const filePath = path.join(__dirname, "../../../EJERCICIO/src/data/products.json");
    const manager = new ProductManager(filePath);

    await manager.agregarProducto({
        title: "Ejemplo",
        description: "Descripción de ejemplo",
        price: 10.99,
        thumbnail: "ejemplo.jpg",
        code: "EJEMPLO001",
        stock: 100
    });

    // Leer y mostrar los productos
    const productos = await manager.leerProductos();
    console.log("Productos:", productos);

    // Actualizar un producto de ejemplo
    await manager.actualizarProducto(1, { price: 15.99 });

    // Eliminar un producto de ejemplo
    await manager.eliminarProducto(1);
}

ejemplo();
