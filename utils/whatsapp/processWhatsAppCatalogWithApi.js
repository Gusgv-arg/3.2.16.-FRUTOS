import axios from "axios";
import { handleWhatsappMessage } from "../whatsapp/handleWhatsappMessage.js";
import { adminWhatsAppNotification } from "../notifications/adminWhatsAppNotification.js";
import { v4 as uuidv4 } from "uuid";
import { catalogOrderConfirmation } from "../messages/messages.js";
import { sendDeliveryFlowToCustomer } from "../../flows/sendDeliveryFlowToCustomer.js";
import { saveOrderFromCatalog } from "../dataBase/saveOrderFromCatalog.js";

export const processWhatsAppCatalogWithApi = async (userMessage) => {
	const type = userMessage.type;
	let log;

	try {
		if (type === "order") {
			console.log("entre a processWhatsAppCatalogWithApi.js en type order");
			// Se envía confirmación del pedido al cliente
			const message = catalogOrderConfirmation(userMessage.name);

			await handleWhatsappMessage(userMessage.userPhone, message);
			log = `Se envió confirmación de pedido al cliente ${userMessage.name}`;

			// Se graba el pedido en la base de datos
			const order_id = uuidv4();
			userMessage.order_id = order_id;
			await saveOrderFromCatalog(userMessage);

			// Se envía un Flow para el método de entrega y otras notas del cliente
			await sendDeliveryFlowToCustomer(userMessage);
		}
	} catch (error) {
		//console.log("error en processWhatsAppFlowWithApi.js", error)

		let errorMessage;

		errorMessage = error?.response?.data
			? JSON.stringify(error.response.data)
			: error.message;

		throw errorMessage;
	}
};
