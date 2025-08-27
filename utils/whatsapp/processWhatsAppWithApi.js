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
	existingOrderMessage,
} from "../messages/messages.js";
import Customers from "../../models/customers.js";

dotenv.config();
const adminPhone = process.env.ADMIN_PHONE;

const currentDateTime = new Date().toLocaleString("es-AR", {
	timeZone: "America/Argentina/Buenos_Aires",
	day: "2-digit",
	month: "2-digit",
	year: "numeric",
	hour: "2-digit",
	minute: "2-digit",
	second: "2-digit",
});

export const processWhatsAppWithApi = async (userMessage) => {
	//console.log("usermessage en processWhatsAppWithApi", userMessage);
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

			// Se busca al cliente en BD
			const customer = await Customers.findOne({
				id_user: userMessage.userPhone,
			});

			if (customer) {
				// SI existe el cliente

				// Se determina la última orden del cliente
				const lastOrder =
					Array.isArray(customer.orders) && customer.orders.length > 0
						? customer.orders[customer.orders.length - 1]
						: null;
				
				if (lastOrder && lastOrder.customer_status !== "entregado") {
					// TIENE ORDEN PENDIENTE

					// Se envía mensaje de orden pendiente
					const orderMessage = existingOrderMessage(lastOrder.orderResponse);
					
					await handleWhatsappMessage(userMessage.userPhone, orderMessage);

					// Se graba en BD el mensaje recibido y el enviado
					lastOrder.messages =
						(lastOrder.messages ? `${lastOrder.messages}\n` : "") +
						`${currentDateTime}: ${userMessage.message}\nRespuesta: ${orderMessage}`;

					await customer.save();

					log = `1-${userMessage.name} envío mensaje y se envió notificación de orden pendiente.`;
				} else {
					// NO TIENE ORDEN PENDIENTE

					// Se envía el saludo inicial
					message = customerGreeting(userMessage.name);

					await handleWhatsappMessage(userMessage.userPhone, message);

					// → Se envia catálogo
					await sendCatalogToCustomer(userMessage);

					// Se agrega la orden al array de órdenes
					customer.orders.push({
						date: currentDateTime,
						messages: userMessage.message || "",
						orderResponse: "no",
						customer_status: "carrito_enviado",
						delivery: "no",
						statusDate: currentDateTime,
					});

					// Graba en DD
					await customer.save();

					log = `1-${userMessage.name} envío mensaje y se envió catálogo.`;
				}
			} else {
				// NO existe el cliente

				// Crear cliente y primera orden con estado carrito_enviado
				const newCustomer = new Customers({
					id_user: userMessage.userPhone,
					name: userMessage.name || "Sin nombre",
					orders: [
						{
							date: currentDateTime,
							messages: userMessage.message || "",
							orderResponse: "no",
							customer_status: "carrito_enviado",
							delivery: "no",
							statusDate: currentDateTime,
						},
					],
				});
				await newCustomer.save();

				// Se envía el saludo inicial
				message = customerGreeting(userMessage.name);

				await handleWhatsappMessage(userMessage.userPhone, message);

				// Envío catálogo
				await sendCatalogToCustomer(userMessage);

				log = `1-${userMessage.name} creado en BD y se envió catálogo.`;
			}

			// CASO DE USO CON FLOW EN LUGAR DE CATALOGO - Envío Flow de Cliente
			//await sendFlow_2ToCustomer(userMessage);
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
