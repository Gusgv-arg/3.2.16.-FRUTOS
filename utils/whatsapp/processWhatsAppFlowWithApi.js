import axios from "axios";
import { handleWhatsappMessage } from "../whatsapp/handleWhatsappMessage.js";
import { adminWhatsAppNotification } from "../notifications/adminWhatsAppNotification.js";
import { v4 as uuidv4 } from "uuid";

export const processWhatsAppFlowWithApi = async (userMessage) => {
	const type = userMessage.type;
	let log;

	try {
		if (type === "interactive") {
			// ---- TOKEN 1: ADMIN -------------------------------------//
			if (userMessage.message.includes('"flow_token":"1"')) {
				if (userMessage.message.includes('"Opciones":"ABM_Concesionarios"')) {
				
					console.log("Entró Menú de Admin. opción ABM_Concesionarios");
					// Se envía un mensaje y el Template
					const message = `🔔 *Notificación:*\n\n📣 Espere a recibir un archivo en Excel.\nℹ️ Al abrirlo No le de importancia a los mensajes de error.\n👨‍💻 Complete la información para dar de alta o modificar concesionarios y/o personal.\n📎 Adjunte el archivo por WhatsApp.\n🙏 No modifique la estructura del archivo.\n\n*Cámara de Concesionarios Stellantis*`; 
					
					await adminWhatsAppNotification(userMessage.userPhone, message);

					// Se envía el Template por WhatsApp
					const templateName = "Plantilla_Base_Redes";
					const excelTemplate = "https://raw.githubusercontent.com/Gusgv-arg/3.2.14.-CAMARA-CES./main/assets/Plantilla_Base_Redes.xlsx";        

					//await sendAbmTemplateByWhatsApp(userMessage.userPhone, excelTemplate, templateName);
					
				} else if (userMessage.message.includes ('"Base_Concesionarios_en_Excel"')) {
					console.log("entre al if de Base_Concesionarios_en_Excel");

					const message = `🔔 *Notificación:*\n\n✅ En breve recibirá un Excel con todos los Concesionarios Activos. Al abrir el archivo no le de importancia a los mensajes de error.\n\n*Cámara de Concesionarios Stellantis*`;

					await adminWhatsAppNotification(userMessage.userPhone, message);
					
					// Llama a la función que genera el Excel
					//const fileUrl = await exportDealersToExcelTemplate();
					console.log("fileUrl", fileUrl);
					// Se envía el Excel por WhatsApp
					//await sendExcelByWhatsApp(userMessage.userPhone, fileUrl, "Concesionarios");
					
					log =
						`Se envió al Admin ${userMessage.name}: ${userMessage.userPhone} un Excel con los concesionarios.`;

				} else if (userMessage.message.includes('"Envio_de_Comunicacion"')) {
					const message = `🔔 *Notificación:*\n\nPor favor entre en su celular para completar el proceso de envío de una Comunicación.\n\n*Cámara de Concesionarios Stellantis*`;

					// Notifica al Admin con la opción elegida
					await adminWhatsAppNotification(userMessage.userPhone, message);

					// Envía el Flow de Comunicación

					log =
						`Envío Flow de Comunicación a Admin ${userMessage.name}: ${userMessage.userPhone}.`;

				} else if (userMessage.message.includes('"Envio_de_Encuesta"')) {
					const message = `🔔 *Notificación:*\n\nPor favor entre en su celular para completar el proceso de envío de Encuesta.\n\n*Cámara de Concesionarios Stellantis*`;

					// Notifica al Admin con la opción elegida
					await adminWhatsAppNotification(userMessage.userPhone, message);

					// Envía el Flow de Encuesta
					log =
						`Envío al Admin ${userMessage.name}: ${userMessage.userPhone} el Flow de Encuesta.`;	
				}

				return log;

			} else if (userMessage.message.includes('"flow_token":"2"')) {
				// ---- TOKEN 2: CLIENTE -------------------------------//
					// Variable para identificar método de entrega
					let delivery= true; // true = envío a domicilio; false = retiro en el local
					
					// Verifico método de entrega para diferenciar mensaje
					if (userMessage.message.includes('"Opciones":"Retiro_en_Local"')) {
						delivery = false;
					}

					// Calcular el total de la compra
					const totalPurchase = totalPurchase(userMessage.message); 

					// Se genera un token para diferenciar el flow
					const flowToken = `2${uuidv4()}`;

					// Se busca el mensaje de confirmación de pedido
					const message = orderConfirmation(userMessage.name, flowToken, delivery, totalPurchase);
					
					// Se envía respuesta al cliente
					await handleWhatsappMessage(userMessage.userPhone, message);
					
					// Graba en BD el pedido del cliente

					log = `El cliente ${userMessage.name}: ${userMessage.userPhone} hizo un pedido. Token: ${flowToken}`;
				
				
			return log
			}
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
