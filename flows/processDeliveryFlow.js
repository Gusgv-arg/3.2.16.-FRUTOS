import axios from "axios";
import { handleWhatsappMessage } from "../utils/whatsapp/handleWhatsappMessage.js";
import { adminWhatsAppNotification } from "../utils/notifications/adminWhatsAppNotification.js";
import { orderConfirmation } from "../utils/messages/messages.js";
import Customers from "../models/customers.js";
import { v4 as uuidv4 } from "uuid";
import { restartMessage } from "../utils/messages/messages.js";

export const processDeliveryFlow = async (userMessage) => {
	const data = JSON.parse(userMessage.message);

	// Extraigo método de entrega, domicilio y otra info
	const method = data["Metodo_de_Entrega"];
	const address = data["Mi_domicilio"];
	const otherInfo = data["Otra_informacion"];

	// Variable para identificar método de entrega
	let delivery = true; // true = envío a domicilio

	// Verifico método de entrega para diferenciar mensaje
	if (userMessage.message.includes('"Opciones":"Retiro_en_Local"')) {
		delivery = false;
	}

	try {
		// Se busca al cliente en la base de datos para obtener el total de la compra
		const customer = await Customers.findOne({
			id_user: userMessage.userPhone,
		});

		// Defino el domicilio
		let domicilio;

		if (customer && address) {
			domicilio = address;
		} else if (customer && customer.address && !address) {
			domicilio = customer.address;
		} else {
			domicilio = "Domicilio No informado";
		}

		// Si existe el cliente
		if (customer) {
			// Busca último pedido
			if (
				customer.orders[customer.orders.length - 1].customer_status === "pedido"
			) {
				// Si tiene pedido pendiente genera un token para el pedido
				const flowToken = `2${uuidv4()}`;

				// Busca el total de la compra
				const totalPurchase =
					customer.orders[customer.orders.length - 1].totalPurchase || 0;

				// Se busca el mensaje de confirmación de pedido
				const message = orderConfirmation(
					userMessage.name,
					flowToken,
					delivery,
					totalPurchase,
					domicilio,
					otherInfo,
					method
				);

				// Se envía respuesta al cliente
				await handleWhatsappMessage(userMessage.userPhone, message);

				// Graba en BD cambando estado a "pendiente_entrega"
				customer.orders[customer.orders.length - 1].orderResponse = "si";
				customer.orders[customer.orders.length - 1].customer_status =
					"pendiente_entrega";
				customer.orders[customer.orders.length - 1].delivery = delivery
					? "si"
					: "no";
				customer.orders[customer.orders.length - 1].statusDate =
					new Date().toLocaleString("es-AR", {
						timeZone: "America/Argentina/Buenos_Aires",
					});
				customer.orders[customer.orders.length - 1].order_id = flowToken;
				customer.orders[customer.orders.length - 1].address = domicilio;
				if (!customer.address) {
					customer.address = domicilio;
				}
				customer.orders[customer.orders.length - 1].otherInfo = otherInfo;
				customer.orders[
					customer.orders.length - 1
				].history += `\n${new Date().toLocaleString("es-AR", {
					timeZone: "America/Argentina/Buenos_Aires",
				})}: Pedido confirmado`;

				await customer.save();
			} else {
				// Si no tiene pedido pendiente, enviar el Catalogo
				await handleWhatsappMessage(userMessage.userPhone, restartMessage);
				await sendCatalogToCustomer(userMessage);
			}
		} else {
			// Si no existe el cliente, enviar el Catalogo
			await handleWhatsappMessage(userMessage.userPhone, restartMessage);
			await sendCatalogToCustomer(userMessage);
		}

		return;
	} catch (error) {
		let errorMessage;
		errorMessage = error?.response?.data
			? JSON.stringify(error.response.data)
			: error.message;

		console.log("error en processDeliveryFlow.js", errorMessage);
		throw errorMessage;
	}
};
