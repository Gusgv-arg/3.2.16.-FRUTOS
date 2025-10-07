const myPhone = process.env.ADMIN_PHONE;
const firma = "Pili 😊";

export const errorMessage1 = `🔔 *Notificación de Error:*\nTe pedimos disculpas 🙏, en este momento no podemos procesar tu solicitud porque estamos haciendo mejoras en nuestro servicio. Podes intentar más tarde o comunicate al ${myPhone}.\n\n${firma}`;

export const customerGreeting = (name) => {
	const greeting = `¡👋 Hola ${name}, gracias por contactarte para comprar mis Frutos Secos! 🌰\n\n‼️ *IMPORTANTE:*\n👨‍💻 Esta línea es solo para hacer pedidos.\n🚚 Envíos a domicilio los *sábados de 9 a 13 hs*.\n📞 Para retirar contactame al ${myPhone}.\n\n🔔 *Desde tu celular vas a ver un segundo mensaje y hacer tu pedido.*\n\n¡Nos vemos!\n\n${firma}`;
	return greeting;
};

// Se usa para el caso que se envía un Flow
export const orderConfirmation = (
	name,
	flowToken,
	delivery,
	totalPurchase,
	domicilio,
	otherInfo,
	method
) => {
	// Diferenciar mensaje si es envío a domicilio o retiro
	let orderConfirmation;

	if (delivery === true) {
		if (method === "Envio_otro_dia") {
			orderConfirmation = `¡👋 Hola ${name}, gracias por tu compra! 🌰\n🛒 El total es de $${totalPurchase}.\n🆔 Tu pedido es el ${flowToken}.\n🚚 Entregar en ${domicilio} en día a confirmar.\n📞 Si querés decirme algo contactame al ${myPhone}.`;
		
		} else {
			orderConfirmation = `¡👋 Hola ${name}, gracias por tu compra! 🌰\n🛒 El total es de $${totalPurchase}.\n🆔 Tu pedido es el ${flowToken}.\n🚚 Entregar en ${domicilio} el *sábado próximo de 9 a 13 hs*.\n📞 Si querés decirme algo contactame al ${myPhone}.`;
		}
	} else {
		orderConfirmation = `¡👋 Hola ${name}, gracias por tu compra!🌰\n🛒 El total es de $${totalPurchase}.\n🆔 Tu pedido es el ${flowToken}.\n📞 *Contactame al ${myPhone} para coordinar tu entrega*.`;
	}

	orderConfirmation += otherInfo
		? `\nℹ️ Otra información: ${otherInfo}\n¡Saludos!\n\n${firma}`
		: `\n¡Saludos!\n\n${firma}`;

	return orderConfirmation;
};

// Se usa para el caso que se envía un Catálogo
export const catalogOrderConfirmation = (name) => {
	const catalogOrderConfirmation = `¡Gracias por tu compra ${name}! 😀\n\n🚚 Ahora coordinemos la entrega.`;
	return catalogOrderConfirmation;
};

export const adminWelcome = `🔔 *Notificación:*\n\n☰ ¡👋 Hola PILI! En tu celular vas a ver el Menú de Opciones.\n\n*Frutos Secos by Pili*`;

// Se usa para el caso que el cliente ya tiene un pedido en curso o no
export const existingOrderMessage = (order) => {
	let orderMessage;
	if (order === "si") {
		orderMessage = `¡Hola! 😀\n✅ Ya tenemos un pedido tuyo en proceso.\n📝 Tomamos nota de tu nuevo mensaje.\n📞 Si queres contactame al ${myPhone}.\n\n¡Gracias!\n\n${firma}`;
	} else {
		orderMessage = `¡Hola! 😀\n📝 Tomamos nota de tu nuevo mensaje.\n❌ Aún no recibimos tu pedido.\n 📱 Para pedir desde tu celular en el historial de conversaciones deberías ver el botón.\n📞 Si no lo ves contactame al ${myPhone}.\n¡Gracias!\n\n${firma}`;
	}

	return orderMessage;
};

// Se usa para el caso extraño en donde no se tienen los datos y hay que comenzar de nuevo
export const restartMessage = `¡Hola! 😀\n\n🔔 Disculpanos pero no pudimos identificar tu pedido.\n📱 Te volvemos a enviar nuestro Catálogo para pedir desde tu celular.\n\n📞 Si queres contactame al ${myPhone}.\n\n¡Gracias!\n\n${firma}`;

// Mensaje al admin
export const adminMenu = "¡Hola PILI! 👋\n\n☰ Te recuerdo las funcionalidades al escribir los números:\n*1.* Pedidos pendientes.\n*2.* \n\n*Frutos Secos by Pili*";

// No hay órdenes pendientes
export const noPendingOrders = `🔔 *Notificación:*\n\n✅ No hay pedidos pendientes de envío.\n\n*Frutos Secos by Pili*`;