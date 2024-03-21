import express from "express";
import data from "./data.js";
import mongoose from "mongoose";
import dotenv from 'dotenv';
import seedRouter from "./routes/seedRouter.js";
import productoRouter from "./routes/productoRouter.js";
import usuarioRouter from "./routes/usuarioRouter.js";
import pedidoRouter from "./routes/pedidoRouter.js";

// Hace fetch a variables dentrto de dotenv
dotenv.config();

// Conectamos a la base de datos
mongoose.connect(process.env.MONGODB_URI).then(() => {
    console.log('conectado a la base de datos');
}).catch((error) => {
    console.log(error.message);
});

const app = express();

// Convertimos los datos que nos llegan a JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Traemos la api de paypal para realizar pagos
app.use('/api/keys/paypal', (req, res) => {
    res.send(process.env.PAYPAL_CLIENT_ID || 'sb')  // Envia o el paypal del cliente o el sandbox de paypal
})

app.use('/api/seed', seedRouter);
app.use('/api/productos', productoRouter)
app.use('/api/usuario', usuarioRouter)
app.use('/api/pedido', pedidoRouter)

// Middleware que gestiona errores de express
app.use((err, req, res, next) => {
    res.status(500).send({ message: err.message });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`server en http://localhost:${port}`);
})