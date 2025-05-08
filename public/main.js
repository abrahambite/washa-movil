document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('pedidoForm');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const data = {
      nombre: form.nombre.value,
      telefono: form.telefono.value,
      direccion: form.direccion.value,
      servicio: form.servicio.value,
      pago: form.pago.value,
      estado: "pendiente",
      fecha: new Date().toISOString()
    };

    try {
      const res = await fetch('/api/pedidos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      const result = await res.json();
      // Redirige al cliente a su pantalla de seguimiento
      window.location.href = `/public/seguimiento.html?id=${result.id}`;
    } catch (err) {
      alert('Error al enviar pedido');
      console.error(err);
    }
  });
});
