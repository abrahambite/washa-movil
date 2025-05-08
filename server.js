const express = require('express');
const cors = require('cors');
const fs = require('fs');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

const pedidosPath = './data/pedidos.json';

// Cargar pedidos existentes
function loadPedidos() {
  if (!fs.existsSync(pedidosPath)) return [];
  return JSON.parse(fs.readFileSync(pedidosPath));
}

// Guardar pedidos
function savePedidos(pedidos) {
  fs.writeFileSync(pedidosPath, JSON.stringify(pedidos, null, 2));
}

// POST: crear pedido
app.post('/api/pedidos', (req, res) => {
  const pedidos = loadPedidos();
  const pedido = { id: uuidv4(), ...req.body };
  pedidos.push(pedido);
  savePedidos(pedidos);
  res.json({ id: pedido.id });
});

// GET: obtener todos los pedidos
app.get('/api/pedidos', (req, res) => {
  const pedidos = loadPedidos();
  res.json(pedidos);
});

// GET: obtener un pedido por ID
app.get('/api/pedidos/:id', (req, res) => {
  const pedidos = loadPedidos();
  const pedido = pedidos.find(p => p.id === req.params.id);
  if (pedido) res.json(pedido);
  else res.status(404).json({ error: 'Pedido no encontrado' });
});

// PUT: actualizar estado
app.put('/api/pedidos/:id', (req, res) => {
  const pedidos = loadPedidos();
  const index = pedidos.findIndex(p => p.id === req.params.id);
  if (index !== -1) {
    pedidos[index] = { ...pedidos[index], ...req.body };
    savePedidos(pedidos);
    res.json(pedidos[index]);
  } else {
    res.status(404).json({ error: 'Pedido no encontrado' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
