import axios from "axios";
import dotenv from "dotenv";

dotenv.config();
const whatsappToken = process.env.WHATSAPP_TOKEN;
const myPhoneNumberId = process.env.WHATSAPP_PHONE_ID;

// Función q recibe un array y manda varios mensajes
export const handleManyWhatsappMessages = async (messages) => {
	try {
		const url = `https://graph.facebook.com/v20.0/${myPhoneNumberId}/messages?access_token=${whatsappToken}`;

		for (const msg of messages) {
			// Si el mensaje tiene botones, envía como interactive, si no, como texto simple
			let data;
			if (msg.buttons && msg.buttons.length > 0) {
				data = {
					messaging_product: "whatsapp",
					to: msg.to,
					type: "interactive",
					interactive: {
						type: "button",
						body: {
							text: msg.text,
						},
						action: {
							buttons: msg.buttons,
						},
					},
				};
			} else {
				data = {
					messaging_product: "whatsapp",
					recipient_type: "individual",
					to: msg.to,
					type: "text",
					text: {
						preview_url: true,
						body: msg.text,
					},
				};
			}

			try {
				const response = await axios.post(url, data, {
					headers: {
						"Content-Type": "application/json",
					},
				});
				console.log("Mensaje enviado a:", msg.to, response.data);
			} catch (error) {
				console.error(
					`Error enviando mensaje a ${msg.to} en handleManyWhatsappMessages.js --->`,
					error.response ? error.response.data : error.message
				);
			}
		}
	} catch (error) {
		console.log(
			"Error general en handleManyWhatsappMessages.js",
			error.response ? error.response.data : error.message
		);
		throw error.response ? error.response.data : error.message;
	}
};
