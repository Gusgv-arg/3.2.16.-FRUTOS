//message: '{"Metodo_de_Entrega":"Retiro_personalmente","Direccion_de_Entrega":"La dire es zzz","Para_Informacion":"Necesito q vengas","Almendras":"1","AlmConChoc":"2","Chips":"3","Castanias":"4","Nueces":"5","Pasas":"6","Pistacho":"7","Mix I":"8","Mix II":"9","flow_token":"2"}',

//'{"Metodo_de_Entrega":"Env\\u00edo_a_domicilio","Direccion_de_Entrega":"Mi dire","Para_Informacion":"Mi info","Almendras":"1","Chips":"3","Castanias":"4","Nueces":"5","Pasas":"6","Pistacho":"7","Mix I":"8","Mix II":"9","flow_token":"2"}',

export const totalPurchase = (purchase)=>{
let total = 0

// Espera un array en el formato:
// [producto, cantidad, precio, moneda, producto2, cantidad2, precio2, moneda2, ...]
if (Array.isArray(purchase)) {
	for (let index = 0; index < purchase.length; index += 4) {
		const quantity = purchase[index + 1]
		const unitPrice = purchase[index + 2]
		const qtyNum = typeof quantity === "number" ? quantity : Number(quantity)
		const priceNum = typeof unitPrice === "number" ? unitPrice : Number(unitPrice)
		if (!Number.isNaN(qtyNum) && !Number.isNaN(priceNum)) {
			total += qtyNum * priceNum
		}
	}
}

return total
}