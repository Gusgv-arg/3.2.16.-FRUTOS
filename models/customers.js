import mongoose from "mongoose";

// Flow 1-> admin Flow 2->customer
const flowDetailSchema = new mongoose.Schema({
	flowName: String,
	flowDate: String,
	messages: String,
	flow2Response: { type: String, enum: ["si", "no"], default: "no" },
	customer_status: {
		type: String,
		enum: [
			"primer contacto",
			"flow enviado",
			"flow recibido",
			"flow leído",
			"falló envío flow",
			"pedido",
			"entregado",					
		],
	},
	statusDate: String,
	history: String,
	flow_2token: String,
	wamId_flow2: String,	
});

const customerSchema = new mongoose.Schema(
	{
		id_user: { type: String, required: true, unique: true },
		name: {
			type: String,
			required: true,
		},		
		mail: String,
		isActive: {
			type: String,
			enum: ["SI", "NO"],
			default: "SI",
			required: true,
		},
		flows: [flowDetailSchema],
	},
	{
		timestamps: true,
	}
);

const Customers = mongoose.model("Customers", customerSchema);

export default Customers;
