import Customers from "../../models/customers.js";

export const pendingOrders = async () => {
	const customers = await Customers.find({});
	const messages = [];
	/* const ordenTrucha = {
		to: "5491161405589",
		text: "🔔 *Pedidos sin entregar:*\nCliente: *Cliente de Prueba*",
		buttons: [
			{
				type: "reply",
				reply: {
					id: `Ver 123456`,
					title: "Detalle",
				},
			},
			{
				type: "reply",
				reply: {
					id: "Entregado 123456",
					title: "Marcar Entregado",
				},
			},
		],
	}; */

	customers.forEach((customer) => {
		customer.orders.forEach((order) => {
			if (order.customer_status === "pendiente_entrega") {
				//const textMsg = `🔔 *Pedidos sin entregar:*\nCliente: *${customer.name}*`;

				const textMsg = `🔔 *Pedido pendiente de entrega:*\nCliente: *${
					customer.name
				}*\nCelular: ${customer.id_user}\nFecha: ${order.statusDate}\nPedido: ${
					order.orderDetails
				}\nTotal: $${order.totalPurchase}\nEntrega: ${
					order.delivery
				}\nDirección: ${
					order.address || customer.address || "No especificada"
				}\nMensajes: ${order.messages || "Sin mensajes"}\nOtra info: ${
					order.otherInfo || "Sin info."
				}`;

				// Botón interactivo para WhatsApp
				const button = {
					type: "reply",
					reply: {
						id: `${order.order_id}`,
						title: "Marcar Entregado",
					},
				};
				/* const button2 = {
					type: "reply",
					reply: {
						id: `Ver ${order.order_id}`,
						title: "Detalle",
					},
				}; */

				messages.push({
					to: customer.id_user,
					text: textMsg,
					buttons: [button],
				});

				//messages.push(ordenTrucha);
			}
		});
	});
	console.log("Messages: ", messages);
	return messages;
};
