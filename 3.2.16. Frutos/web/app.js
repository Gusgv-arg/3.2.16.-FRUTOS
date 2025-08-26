// Config editable
const PILI = {
	whatsappNumber: "+54 911 6112-7436",
	email: "piligvillafane@hotmail.com",
	messagePreset: "Hola Pili! Quiero hacer un pedido de frutos secos 🙌"
};

// Catálogo a partir de los nombres de archivos en /catalogs
const PRODUCTS = [
  { 
    key: "almendra", 
    name: "Almendras", 
    price: 17700, 
    images: ["../catalogs/almendra.png", "../../catalogs/almendra.png"], 
    textContent: "Ricas en proteínas, fibras y vitamina E." 
  },
  { 
    key: "almendraConChocolate", 
    name: "Almendras con chocolate", 
    price: 30000, 
    images: ["../catalogs/almendraConChocolate.png", "../../catalogs/almendraConChocolate.png"], 
    textContent: "Aporta antioxidantes y energía saludable." 
  },
  { 
    key: "castania", 
    name: "Castañas de Cajú", 
    price: 14700, 
    images: ["../catalogs/castania.png", "../../catalogs/castania.png"], 
    textContent: "Fuente de magnesio, hierro y proteínas." 
  },
  { 
	key: "nuez", 
	name: "Nueces", 
	price: 16800, 
	images: ["../catalogs/nuez.png", "../../catalogs/nuez.png"], 
	textContent: "Ricas en omega-3 y antioxidantes naturales." 
  },
  { 
    key: "chipsBanana", 
    name: "Chips de banana", 
    price: 17500, 
    images: ["../catalogs/chipsBanana.png", "../../catalogs/chipsBanana.png"], 
    textContent: "Aportan potasio y energía de rápida absorción." 
  },
  { 
    key: "pasas", 
    name: "Pasas de Uva", 
    price: 4700, 
    images: ["../catalogs/pasas.png", "../../catalogs/pasas.png"], 
    textContent: "Altas en hierro, potasio y fibra dietética." 
  },
  { 
    key: "pistacho", 
    name: "Pistacho", 
    price: 34200, 
    images: ["../catalogs/pistacho.png", "../../catalogs/pistacho.png"], 
    textContent: "Contienen proteínas, fibra y grasas saludables." 
  },
  { 
    key: "mix", 
    name: "Mix I: almendras, nueces, pasas", 
    price: 13000, 
    images: ["../catalogs/mix.png", "../../catalogs/mix.png"], 
    textContent: "Nutrientes esenciales y energía." 
  },  
  { 
    key: "mix", 
    name: "Mix II: almendras, nueces, chips de banana", 
    price: 18000, 
    images: ["../catalogs/mix.png", "../../catalogs/mix.png"], 
    textContent: "Combinación de nutrientes esenciales y energía." 
  },
  { 
    key: "mix", 
    name: "Mix III: almendras, nueces, castañas, pasas", 
    price: 16000, 
    images: ["../catalogs/mix.png", "../../catalogs/mix.png"], 
    textContent: "Combinación de nutrientes esenciales y energía." 
  },
  { 
    key: "mix", 
    name: "Mix IV: almendras, nueces, castañas, chips de banana", 
    price: 17000, 
    images: ["../catalogs/mix.png", "../../catalogs/mix.png"], 
    textContent: "Combinación de nutrientes esenciales y energía." 
  },
  { 
    key: "mix", 
    name: "Mix V: armalo como vos quieras", 
    price: 0, 
    images: ["../catalogs/mix.png", "../../catalogs/mix.png"], 
    textContent: "Combinación de nutrientes esenciales y energía." 
  }
];

function normalizePhoneForWhatsApp(raw) {
	return raw.replace(/[^\d]/g, "");
}

function buildWhatsAppLink(number, text) {
	const phone = normalizePhoneForWhatsApp(number);
	const urlEncoded = encodeURIComponent(text);
	return `https://wa.me/${phone}?text=${urlEncoded}`;
}

function resolveCatalogPath(relativePath) {
	// Intenta ../catalogs primero; si falla, usa ../../catalogs
	const candidates = [
		`../catalogs/${relativePath}`,
		`../../catalogs/${relativePath}`
	];
	return new Promise((resolve) => {
		let resolved = false;
		let pending = candidates.length;
		candidates.forEach(src => {
			const img = new Image();
			img.onload = () => { if (!resolved) { resolved = true; resolve(src); } };
			img.onerror = () => { pending -= 1; if (pending === 0 && !resolved) resolve(candidates[0]); };
			img.src = src;
		});
	});
}

function resolveFirstAvailable(urls) {
	return new Promise((resolve) => {
		let chosen = null;
		let remaining = urls.length;
		urls.forEach(u => {
			const img = new Image();
			img.onload = () => { if (!chosen) { chosen = u; resolve(u); } };
			img.onerror = () => { remaining -= 1; if (remaining === 0 && !chosen) resolve(urls[0]); };
			img.src = u;
		});
	});
}

async function setStaticImages() {
	const logo = document.getElementById("logoImg");
	const about = document.getElementById("aboutImg");
	const logoPath = await resolveCatalogPath("superFrutos.png");
	if (logo) logo.src = logoPath;
	if (about) about.src = logoPath;
}

async function applyWhatsAppIconToButtons(buttonElements) {
	// Intenta cargar el logo de WhatsApp desde catalogs
	const iconPath = await resolveFirstAvailable([
		"../catalogs/WhatsappLogoSolid.svg",
		"../../catalogs/WhatsappLogoSolid.svg"
	]);
	buttonElements.forEach(btn => {
		if (!btn) return;
		// Evita duplicar íconos si se vuelve a ejecutar
		if (btn.querySelector('img.icon')) return;
		const img = document.createElement('img');
		img.className = 'icon';
		img.alt = 'WhatsApp';
		img.src = iconPath;
		btn.prepend(img);
	});
}

function renderContacts() {
	const yearEl = document.getElementById("year");
	if (yearEl) yearEl.textContent = String(new Date().getFullYear());

	const whatsappLink = buildWhatsAppLink(PILI.whatsappNumber, PILI.messagePreset);

	const wTop = document.getElementById("whatsappTop");
	const wBottom = document.getElementById("whatsappBottom");
	[wTop, wBottom].forEach(a => { if (a) a.href = whatsappLink; });

	// Agrega ícono a botones principales
	applyWhatsAppIconToButtons([wTop, wBottom]);

	const wNum = document.getElementById("whatsappNumber");
	if (wNum) { wNum.href = whatsappLink; wNum.textContent = PILI.whatsappNumber; }

	const emailLink = document.getElementById("emailLink");
	if (emailLink) { emailLink.href = `mailto:${PILI.email}`; emailLink.textContent = PILI.email; }
}

async function renderProducts() {
	const grid = document.getElementById("productGrid");
	if (!grid) return;

	for (const p of PRODUCTS) {
		const card = document.createElement("article");
		card.className = "card";

		const img = document.createElement("img");
		img.alt = p.name;
		img.src = (p.images && p.images[0]) || "";

		const title = document.createElement("h4");
		title.textContent = p.name;

		const desc = document.createElement("p");
		desc.className = "small";
		desc.textContent = p.textContent || "Fuente natural de energía, proteínas y grasas saludables.";

		const cta = document.createElement("div");
		cta.className = "cta";

		const price = document.createElement("span");
		price.className = "price";
		price.textContent = `$ ${p.price.toLocaleString('es-AR')} / kg`;

		const btn = document.createElement("a");
		btn.className = "btn btn-primary";
		btn.target = "_blank";
		btn.rel = "noopener";
		btn.textContent = "Pedir";
		btn.href = buildWhatsAppLink(PILI.whatsappNumber, `Hola Pili! Quiero hacer un pedido de frutos secos 🙌`);

		cta.appendChild(price);
		cta.appendChild(btn);

		card.appendChild(img);
		card.appendChild(title);
		card.appendChild(desc);
		card.appendChild(cta);

		grid.appendChild(card);

		if (p.images && p.images.length > 1) {
			const resolved = await resolveFirstAvailable(p.images);
			img.src = resolved;
		}

		// No agregar ícono de WhatsApp en los botones de cada producto
	}
}

document.addEventListener("DOMContentLoaded", async () => {
	await setStaticImages();
	renderContacts();
	await renderProducts();
});


