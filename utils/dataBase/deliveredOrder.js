import Customers from "../../models/customers.js"

export const deliveredOrders = async(userMessage)=>{

    try {
       const { deliveredId } = userMessage;

        // Busca el cliente que tenga un pedido con ese order_id
        const customer = await Customers.findOne({ "orders.order_id": deliveredId });
        if (!customer) {
            throw new Error("Cliente o pedido no encontrado");
        }

        // Actualiza el customer_status del pedido correspondiente
        const updated = await Customers.updateOne(
            { "orders.order_id": deliveredId },
            { $set: { "orders.$.customer_status": "entregado" } }
        );
        console.log("Pedido marcado como entregado:", deliveredId);
        return `Pedido marcado como entregado: ${deliveredId}`;
         
    } catch (error) {
        throw error
    }
}