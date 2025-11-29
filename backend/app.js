const express = require('express');
const cors = require('cors'); 
const fs = require('fs'); // Librería para leer archivos
const path = require('path');
const app = express();
const port = 3000;
const jwt = require('jsonwebtoken');

const SECRET_KEY = "mi_clave_secreta_super_segura";

app.use(cors());
app.use(express.json());

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (username && password) {
        const token = jwt.sign({ username: username }, SECRET_KEY, { expiresIn: '1h' });
        res.json({ token: token, status: "ok" });
    } else {
        res.status(401).json({ status: "error", msg: "Usuario o contraseña incorrectos" });
    }
});

const verificarToken = (req, res, next) => {
    const token = req.headers['access-token']; 

    if (!token) {
        return res.status(401).json({ msg: "Acceso denegado. Token no proporcionado." });
    }

    try {
        const verificado = jwt.verify(token, SECRET_KEY);
        req.user = verificado;
        next();
    } catch (error) {
        res.status(403).json({ msg: "Token no válido o expirado." });
    }
};

app.use(verificarToken);

app.get('/cats', (req, res) => {
    const file = require('./json/cats/cat.json'); 
    res.json(file);
});


app.get('/user_cart/:id', (req, res) => {
    const userId = req.params.id;
    try {
        const cart = require(`./json/user_cart/${userId}.json`);
        res.json(cart);
    } catch (error) {
        res.status(404).json({ error: "Carrito no encontrado" });
    }
});


app.get('/cats_products/:id', (req, res) => {
    const catId = req.params.id; 
    
    try {
        const products = require(`./json/cats_products/${catId}.json`);
        res.json(products);
    } catch (error) {
        res.status(404).json({ message: "Categoría no encontrada" });
    }
});

app.get('/products/:id', (req, res) => {
    const prodId = req.params.id;
    try {
        const product = require(`./json/products/${prodId}.json`);
        res.json(product);
    } catch (error) {
        res.status(404).json({ message: "Producto no encontrado" });
    }
});

app.get('/products_comments/:id', (req, res) => {
    const prodId = req.params.id;
    try {
        const comments = require(`./json/products_comments/${prodId}.json`);
        res.json(comments);
    } catch (error) {
        res.status(404).json({ message: "Comentarios no encontrados" });
    }
});

app.get('/sell/publish', (req, res) => {
    res.json({ msg: "Publicación exitosa", status: "ok" }); 
});


app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});


//cart

let cart = []; // ← después esto lo sacás a BD
let carts = {}; // ← Carritos en memoria

app.post("/cart/add", (req, res) => {
    console.log("BODY RECIBIDO:", req.body);

    const { username, product } = req.body;

    if (!username || !product) {
        return res.status(400).json({ msg: "Faltan datos" });
    }

    if (!carts[username]) carts[username] = [];

    const existing = carts[username].find(p => p.id === product.id);

    if (existing) {
        existing.count += 1;
    } else {
        carts[username].push({ ...product, count: 1 });
    }

    res.json({
        msg: "Producto agregado",
        cart: carts[username]
    });
});

app.get("/cart/:username", (req, res) => {
    const { username } = req.params;
    res.json(carts[username] || []);
});

// Obtener carrito
app.get("/cart", (req, res) => {
    res.json(cart);
});

// Agregar producto
app.post("/cart/add", (req, res) => {
    const { username, product } = req.body;

  /*   if (!username || !product) {
        return res.status(400).json({ msg: "Falta username o product" });
    } */

    // ejemplo de carrito en memoria
    if (!global.cart) global.cart = {};

    if (!global.cart[username]) global.cart[username] = [];

    // buscar si ya existe
    const existing = global.cart[username].find(p => p.id === product.id);

    if (existing) {
        existing.count += 1;
    } else {
        global.cart[username].push({ ...product, count: 1 });
    }

    return res.json({
        msg: "Producto agregado",
        cart: global.cart[username]
    });
});

// Modificar cantidad
app.put("/cart/:index", (req, res) => {
    const index = req.params.index;
    const { count } = req.body;
    if (!cart[index]) return res.status(404).json({ error: "No existe el producto" });

    cart[index].count = count;
    res.json({ msg: "Cantidad actualizada", cart });
});

// Eliminar
app.delete("/cart/:index", (req, res) => {
    const index = req.params.index;
    if (!cart[index]) return res.status(404).json({ error: "No existe el producto" });

    cart.splice(index, 1);
    res.json({ msg: "Producto eliminado", cart });
});