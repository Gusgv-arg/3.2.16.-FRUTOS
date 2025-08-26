import mongoose from "mongoose";

// Flow 1-> admin Flow 2->customer
const orderSchema = new mongoose.Schema({
	date: String,
	orderResponse: { type: String, enum: ["si", "no"], default: "no" },
	customer_status: {
		type: String,
		enum: [
			"primer_contacto",
			"carrito_enviado",
			"carrito_recibido",
			"carrito_leído",
			"falló_envío_carrito",
			"pedido",
			"entregado",					
		],
	},
	orderDetails: String,
	delivery: { type: String, enum: ["si", "no"], default: "no" },
	totalPurchase: Number,
	statusDate: String,
	history: String,
	order_token: String,
	order_wamId: String,	
});

const customerSchema = new mongoose.Schema(
	{
		id_user: { type: String, required: true, unique: true },
		name: {
			type: String,
			required: true,
		},		
		address: String,
		mail: String,
		isActive: {
			type: String,
			enum: ["SI", "NO"],
			default: "SI",
			required: true,
		},
		orders: [orderSchema],
	},
	{
		timestamps: true,
	}
);

const Customers = mongoose.model("Customers", customerSchema);

export default Customers;
