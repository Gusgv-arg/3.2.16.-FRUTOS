import Customers from "../../models/customers.js";

// Función para crear al cliente o actualizar
export const saveSentCatalog = async (userMessage) => {

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
        
        // Buscar cliente en la base de datos
        const customer = await Customers.findOne({
            id_user: userMessage.userPhone,
        });

        if (customer) {
            // Cliente existe 
            const newOrder = {
                date: currentDateTime,
                orderResponse: "no",
                messages: userMessage.message || "",
                customer_status: "primer_contacto",
                orderDetails: "",
                delivery: "no",
                totalPurchase: 0,
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
            // Cliente no existe - crear nuevo cliente
            const newCustomer = new Customers({
                id_user: userMessage.userPhone,
                name: userMessage.name || "Cliente sin nombre",
                address: "",
                mail: "",
                isActive: "SI",
                orders: [
                    {
                        date: currentDateTime,
                        orderResponse: "no",
                        customer_status: "primer_contacto",
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
