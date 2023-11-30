import express from "express";
import data from "./data.js";

const app = express();

app.get('/api/productos', (req, res) => {
    res.send(data.productos);
});

// Fetch a la base de datos para conseguir el producto
app.get('/api/productos/slug/:slug', (req, res) => {
    const producto = data.productos.find(x => x.slug === req.params.slug);
    // El producto existe
    if(producto) {
        res.send(producto)
    }
    // No existe el producto
    else {
        res.status(404).send({message: 'Producto no encontrado'})
    }
});
// Fetch a la base de datos para conseguir el producto por el id
app.get('/api/productos/:id', (req, res) => {
    const producto = data.productos.find(x => x.id === req.params.id);
    // El producto existe
    if(producto) {
        res.send(producto)
    }
    // No existe el producto
    else {
        res.status(404).send({message: 'Producto no encontrado'})
    }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`server en http://localhost:${port}`);
})