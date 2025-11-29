// app.js (backend)
const express = require("express");
const cors = require("cors");

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

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

app.listen(port, () => console.log("Backend funcionando en " + port));
