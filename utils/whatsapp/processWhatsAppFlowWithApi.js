import axios from "axios";
import { handleWhatsappMessage } from "../whatsapp/handleWhatsappMessage.js";
import { adminWhatsAppNotification } from "../notifications/adminWhatsAppNotification.js";
import { v4 as uuidv4 } from "uuid";
import { processDeliveryFlow } from "../../flows/processDeliveryFlow.js";
import { deliveredOrders } from "../dataBase/deliveredOrder.js";


export const processWhatsAppFlowWithApi = async (userMessage) => {
	const type = userMessage.type;
	let log;

	try {
		if (type === "interactive") {
			// ---- TOKEN 1: ADMIN -------------------------------------//
			if (userMessage.message.includes('"flow_token":"1"')) {
				return log;

			} else if (userMessage.message.includes("Marcar Entregado")) {
				// Función que cambia el estado del pedido a entregado
				log = await deliveredOrders(userMessage);

			}else if (userMessage.message.includes('"flow_token":"2"')) {
				// ---- TOKEN 2: CLIENTE ENVIA UN FLOW CON METODO DE ENTREGA---------//
				console.log("Entró en processWhatsAppFlowWithApi.js - flow token 2");
				
				// Función que procesa el delivery flow
				await processDeliveryFlow(userMessage);

				log = `El cliente ${userMessage.name}: ${userMessage.userPhone} hizo un pedido y confirmó su método de envío.`;

			}
			return log;
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
