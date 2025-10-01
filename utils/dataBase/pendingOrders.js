import Customers from "../../models/customers.js";

export const pendingOrders = async () => {
	const customers = await Customers.find({});
	const messages = [];
    
	customers.forEach((customer) => {
		customer.orders.forEach((order) => {
			if (order.customer_status === "pendiente_entrega") {
				const textMsg = `🔔 *Pedido pendiente de entrega:*\nCliente: *${customer.name}*\nCelular: ${customer.id_user}\nFecha: ${order.statusDate}\nPedido: ${order.orderDetails}\nTotal: $${order.totalPurchase}\nEntrega: ${order.delivery}\nDirección: ${order.address || customer.address || "No especificada"}\nMensajes: ${order.messages || "Sin mensajes"}\nOtra info: ${order.otherInfo || "Sin info."}`;

				// Botón interactivo para WhatsApp
				const button = {
					type: "reply",
					reply: {
						id: `${order.order_token}`,
						title: "Marcar Entregado",
					},
				};

				messages.push({
					to: customer.id_user, 
					text: textMsg,
					buttons: [button],
				});
			}
		});
	}); 
	console.log("Messages: ", messages);
	return messages;
};

