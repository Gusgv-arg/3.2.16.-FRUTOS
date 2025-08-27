import Customers from "../../models/customers.js";
import { totalPurchase } from "../functions/totalPurchase.js";

// Función para grabar el pedido del cliente
export const saveOrderFromCatalog = async (userMessage) => {

	// Obtain current date and hour
	const currentDateTime = new Date().toLocaleString("es-AR", {
		timeZone: "America/Argentina/Buenos_Aires",
		day: "2-digit",
		month: "2-digit",
		year: "numeric",
		hour: "2-digit",
		minute: "2-digit",
		second: "2-digit",

	});
	try {
		// Formatear orderDetails si viene como array y calcular total
		const formatPriceARS = (price)=>`$ ${new Intl.NumberFormat("es-AR", { minimumFractionDigits: 0 }).format(price)}`;
		const prettifyProductName = (name)=>{
			if (typeof name !== "string") return "";
			// Insertar espacios antes de mayúsculas y convertir a minúsculas
			const spaced = name.replace(/([a-z])([A-Z])/g, "$1 $2");
			return spaced.toLowerCase();
		};

		let formattedOrderDetails = userMessage.message || "";
		let computedTotal = 0;

		if (Array.isArray(userMessage.message)) {
			const parts = [];
			for (let i = 0; i < userMessage.message.length; i += 4) {
				const product = prettifyProductName(userMessage.message[i]);
				const quantity = userMessage.message[i + 1];
				const price = userMessage.message[i + 2];
				// const currency = userMessage.message[i + 3]; // Asumimos ARS
				if (typeof product === "string" && typeof quantity === "number" && typeof price === "number") {
					parts.push(`${quantity} kg. ${product}: ${formatPriceARS(price)}`);
				}
			}
			formattedOrderDetails = parts.join("; ");
			computedTotal = totalPurchase(userMessage.message);
		}

		// Buscar cliente en la base de datos
		const customer = await Customers.findOne({
			id_user: userMessage.userPhone,
		});

		if (customer) {
			// Cliente existe - agregar nuevo registro al array de orders
			const newOrder = {
				date: currentDateTime,
				orderResponse: "no",
				customer_status: "pedido",
				orderDetails: formattedOrderDetails,
				delivery: "no",
				totalPurchase: computedTotal,
				statusDate: currentDateTime,
				history: `${currentDateTime}: Primer contacto`,
				order_token: "",
				order_wamId: "",
			};

			// Agregar el nuevo order al array
			customer.orders.push(newOrder);
			await customer.save();

			console.log(`Cliente existente actualizado: ${customer.name}`);
			return `Cliente existente actualizado - Nuevo order agregado`;
		} else {
			// Cliente no existe - Puede pasar si un cliente nuevo le reenvían el catálogo y responde
			const newCustomer = new Customers({
				id_user: userMessage.userPhone,
				name: userMessage.name || "Cliente sin nombre",
				address: "",
				mail: "",
				isActive: "SI",
				orders: [
					{
						date: currentDateTime,
						orderResponse: "si",
						customer_status: "pedido",
						orderDetails: formattedOrderDetails,
						delivery: "no",
						totalPurchase: computedTotal,
						statusDate: currentDateTime,
						history: `${currentDateTime}: Primer contacto`,
						order_token: "",
						order_wamId: "",
					},
				],
			});

			await newCustomer.save();
			console.log(`Nuevo cliente creado: ${newCustomer.name}`);
			return `Nuevo cliente creado`;
		}
	} catch (error) {
		console.error("Error en saveSentCatalog:", error);
		throw new Error(`Error guardando respuesta del catálogo: ${error.message}`);
	}
};
