const myPhone = process.env.ADMIN_PHONE
const firma = "Pili 😊"

export const errorMessage1 = `🔔 *Notificación de Error:*\nTe pedimos disculpas 🙏, en este momento no podemos procesar tu solicitud porque estamos haciendo mejoras en nuestro servicio. Podes intentar más tarde o comunicate al ${myPhone}.\n\n${firma}`


export const customerGreeting = (name) => {
	const greeting = `¡👋 Hola ${name}, gracias por contactarte para comprar mis Frutos Secos! 🌰\n\n‼️ *IMPORTANTE:*\n👨‍💻 Esta línea es solo para hacer pedidos.\n🚚 Envíos a domicilio los *sábados de 9 a 13 hs*.\n📞 Para retirar contactame al ${myPhone}.\n\n🔔 *Desde tu celular vas a ver un segundo mensaje y hacer tu pedido.*\n\n¡Nos vemos!\n\n${firma}`;
	return greeting;
};

// Se usa para el caso que se envía un Flow
export const orderConfirmation = (name, flowToken, delivery, totalPurchase) => {
	// Diferenciar mensaje si es envío a domicilio o retiro
	let orderConfirmation;

	if (delivery === true) {
		orderConfirmation = `¡👋 Hola ${name}, gracias por tu compra! 🌰\n🛒 El total es de $${totalPurchase}.\n🆔 Tu pedido es el ${flowToken}.\n🚚 Recordá que entrego a domicilio los *sábados de 9 a 13 hs*.\n📞 Si querés decirme algo contactame al ${myPhone}.\n¡Saludos!\n\n${firma}`;
	} else {
		orderConfirmation = `¡👋 Hola ${name}, gracias por tu compra!🌰\n🛒 El total es de $${totalPurchase}.\n🆔 Tu pedido es el ${flowToken}.\n📞 *Contactame al ${myPhone} para coordinar tu entrega*.\n¡Saludos!\n\n${firma}`;
	}
	return orderConfirmation;
};

// Se usa para el caso que se envía un Catálogo
export const catalogOrderConfirmation = (name) => {
	const catalogOrderConfirmation = `¡Gracias por tu compra ${name}! 🌰\n\n🚚 Ahora coordinemos la entrega.`
	return catalogOrderConfirmation;
}

export const adminWelcome = `🔔 *Notificación:*\n\n☰ ¡👋 Hola PILI! En tu celular vas a ver el Menú de Opciones.\n\n*Frutos Secos by Pili*`;
