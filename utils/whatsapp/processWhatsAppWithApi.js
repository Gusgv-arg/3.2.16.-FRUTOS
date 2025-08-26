import { sendFlow_1ToAdmin } from "../../flows/sendFlow_1ToAdmin.js";
import { adminWhatsAppNotification } from "../notifications/adminWhatsAppNotification.js";
import { handleWhatsappMessage } from "./handleWhatsappMessage.js";
import { saveSentCatalog } from "../dataBase/saveSentCatalog.js";
import dotenv from "dotenv";
//import { sendFlow_2ToDealer } from "../../flows/sendFlow_2ToDealer.js";
import { getMediaWhatsappUrl } from "../media/getMediaWhatsappUrl.js";
import { downloadWhatsAppMedia } from "../media/downloadWhatsAppMedia.js";
import { sendCatalogToCustomer } from "../../catalogs/sendCatalogToCustomer.js";
import {
	adminWelcome,
	customerGreeting,
} from "../messages/messages.js";

dotenv.config();
const adminPhone = process.env.ADMIN_PHONE;



export const processWhatsAppWithApi = async (userMessage) => {
	//console.log("usermessage en processWhatsAppWithApi", userMessage)
	let log;
	let message;

	try {
		// Si es el ADMIN
		if (userMessage.userPhone === adminPhone) {
			console.log("Detectó el Admin phone");
			if (userMessage.type !== "document") {
				// Saludo al Admin
				await handleWhatsappMessage(userMessage.userPhone, adminWelcome);

				// Envío Flow1 al Admin
				const wamId_Flow1 = await sendFlow_1ToAdmin(userMessage);

				// Agrego el wamId al objeto userMessage para traquear status FLOW1
				userMessage.wamId_Flow1 = wamId_Flow1;
				log = `1-Se envió el Flow1 al Administrador.`;
			} else if (userMessage.type === "document") {
				// Opción envío de Excel
				console.log("entre al if de document del Admin");

				// Buscar la URL de WhatsApp
				const document = await getMediaWhatsappUrl(userMessage.documentId);
				const documentUrl = document.data.url;

				// Bajar el documento de WhatsApp
				const documentBuffer = await downloadWhatsAppMedia(documentUrl);
				const documentBufferData = documentBuffer.data;

				log = `1-Se procesó el Excel.2-Notificación al Admin: `;
			}
		
		} else {
			// Es un CLIENTE
			
			// Se envía el saludo inicial y el Flow o el Catálogo
			message = customerGreeting(userMessage.name);

			await handleWhatsappMessage(userMessage.userPhone, message);

			// Envío Flow de Cliente
			//await sendFlow_2ToCustomer(userMessage);

			// Envío Catálogo al cliente
			await sendCatalogToCustomer(userMessage);

			// Crear o actualizar al cliente en la base de datos
			const customerResult = await saveSentCatalog(userMessage);
			log = `1-${customerResult}`;
		}

		return log;
	} catch (error) {
		console.error(
			"Error in processWhatsAppWithApi.js:",
			error?.response?.data
				? JSON.stringify(error.response.data)
				: error.message
		);

		const errorMessage = `Error en processWhatsAppWithApi.js: ${
			error?.response?.data
				? JSON.stringify(error.response.data)
				: error.message
		}`;

		throw errorMessage;
	}
};
