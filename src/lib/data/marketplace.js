/** @typedef {{ id: string, name: string, price: number, image: string, category: string, material: string, color: string, dimensions: string, description: string, collection: string }} CatalogItem */

export const COMPANY = {
	name: 'onepoint',
	tagline: 'Premium mebel mağazası',
	since: 2010
};

/** @type {CatalogItem[]} */
const CATALOG = [
	{ id: 'p1', name: 'Lena 3 yerli divan', price: 817, image: 'https://embawood.az/image/catalog/Sofa%20set/Lena/lena%203%20yerli_2.png', category: 'Yumşaq mebel', material: 'Parça, elastik sükan', color: 'Bej', dimensions: '220×95×88 sm', description: 'Geniş oturacaqlı, rahat 3 yerli divan.', collection: 'Lena' },
	{ id: 'p2', name: 'Borneo 3 yerli divan', price: 1782, image: 'https://embawood.az/image/catalog/Yeni%20divanlar/borneo/borneo2.png', category: 'Yumşaq mebel', material: 'Premium parça', color: 'Tünd boz', dimensions: '245×98×90 sm', description: 'Müasir dizayn, yüksək rahatlıq.', collection: 'Borneo' },
	{ id: 'p3', name: 'Acelya Grey 3 yerli divan', price: 1014, image: 'https://embawood.az/image/catalog/Sofa%20set/Acelya%20grey/acelya_3_yerli_divan_1.png', category: 'Yumşaq mebel', material: 'Parça', color: 'Boz', dimensions: '230×92×86 sm', description: 'Minimalist interyer üçün uyğun.', collection: 'Acelya' },
	{ id: 'p4', name: 'Canary 3 yerli divan', price: 857, image: 'https://embawood.az/image/catalog/canary%203%20yerli_3.png', category: 'Yumşaq mebel', material: 'Parça', color: 'Krem', dimensions: '218×90×84 sm', description: 'İşıqlı rəng palitrası.', collection: 'Canary' },
	{ id: 'p5', name: 'Como 3 yerli divan', price: 1008, image: 'https://embawood.az/image/catalog/Yeni%20divanlar/como/como5.png', category: 'Yumşaq mebel', material: 'Parça, taxta ayaq', color: 'Antrasit', dimensions: '228×94×88 sm', description: 'Yeni kolleksiya.', collection: 'Como' },
	{ id: 'p6', name: 'Hilton 3 yerli divan', price: 1792, image: 'https://embawood.az/image/catalog/Yumusaq%20divanlar/Hilton/hilton_3%20yerli_1310x911_4.png', category: 'Yumşaq mebel', material: 'Premium parça', color: 'Bej-qəhvəyi', dimensions: '250×96×90 sm', description: 'Premium salon divanı.', collection: 'Hilton' },
	{ id: 'p7', name: 'Luca 3 yerli divan', price: 808, image: 'https://embawood.az/image/catalog/Yumusaq%20divanlar/luca%203%20yerli%20divan.png', category: 'Yumşaq mebel', material: 'Parça', color: 'Açıq boz', dimensions: '215×90×85 sm', description: 'Kompakt mənzillər üçün.', collection: 'Luca' },
	{ id: 'p8', name: 'Carino X 3 yerli divan', price: 1248, image: 'https://embawood.az/image/catalog/Sofa%20set/Carino/carino_divan.png', category: 'Yumşaq mebel', material: 'Parça, metal', color: 'Gümüşü-boz', dimensions: '235×93×87 sm', description: 'Elegant müasir xətlər.', collection: 'Carino' },
	{ id: 'p9', name: 'Liberia künc divan', price: 1450, image: 'https://embawood.az/image/catalog/Yumusaq%20divanlar/liberia_künc%201310x911_2%20(3).png', category: 'Künc divanlar', material: 'Parça', color: 'Bej', dimensions: '280×180×88 sm', description: 'Modul künc divan.', collection: 'Liberia' },
	{ id: 'p10', name: 'Yıldız yataq komod-güzgü', price: 792, image: 'https://embawood.az/image/catalog/Bedroom/Yildiz/trumo.png', category: 'Komod və güzgülər', material: 'Laminat, MDF', color: 'Ağ-qəhvəyi', dimensions: '140×45×85 sm', description: 'Güzgülü komod.', collection: 'Yıldız' },
	{ id: 'p11', name: 'Tiffany yataq komod-güzgü', price: 364, image: 'https://embawood.az/image/catalog/Bedroom/Tiffany/tiffany_yataq_trumo.png', category: 'Komod və güzgülər', material: 'MDF', color: 'Ağ', dimensions: '120×42×78 sm', description: 'Kompakt komod.', collection: 'Tiffany' },
	{ id: 'p12', name: 'Portofino tumba', price: 112, image: 'https://embawood.az/image/catalog/Bedroom/Portofino/tumba_1.png', category: 'Komod və güzgülər', material: 'Laminat', color: 'Ağ', dimensions: '45×40×48 sm', description: 'Gecə tumba.', collection: 'Portofino' },
	{ id: 'p13', name: 'Tiffany çarpayı', price: 302, image: 'https://embawood.az/image/catalog/pianta/pianta_yataq%20dəsti_carpayi.png', category: 'Yataq mebeli', material: 'Laminat karkas', color: 'Ağ', dimensions: '160×200 sm', description: 'Tək nəfərlik çarpayı.', collection: 'Tiffany' },
	{ id: 'p14', name: 'Portofino çarpayı', price: 407, image: 'https://embawood.az/image/catalog/Yeni%20yataq%20destler/Siena%20yataq/siena%20yataq%20desti_carpayi.png', category: 'Yataq mebeli', material: 'MDF, laminat', color: 'Ağ-qəhvəyi', dimensions: '160×200 sm', description: 'Portofino kolleksiyası.', collection: 'Portofino' },
	{ id: 'p15', name: 'Kataniya çarpayı', price: 399, image: 'https://embawood.az/image/catalog/Yeni%20yataq%20destler/melina/Melina%20çarpayı.png', category: 'Yataq mebeli', material: 'Laminat', color: 'Ceviz', dimensions: '160×200 sm', description: 'Klassik xətlər.', collection: 'Kataniya' },
	{ id: 'p16', name: 'Toskana çarpayı', price: 401, image: 'https://embawood.az/image/catalog/Yeni%20yataq%20destler/efor/efor%20çarpayı_2.png', category: 'Yataq mebeli', material: 'MDF', color: 'Ağ', dimensions: '180×200 sm', description: 'İki nəfərlik çarpayı.', collection: 'Toskana' },
	{ id: 'p17', name: 'California çarpayı', price: 421, image: 'https://embawood.az/image/catalog/Amalfi/arpayı.jpg', category: 'Yataq mebeli', material: 'Laminat', color: 'Boz', dimensions: '160×200 sm', description: 'Müasir yataq otağı.', collection: 'California' },
	{ id: 'p18', name: 'Prada çarpayı', price: 455, image: 'https://embawood.az/image/catalog/Bedroom/Sanny/sany_yataq_carpayı.png', category: 'Yataq mebeli', material: 'MDF', color: 'Tünd qəhvəyi', dimensions: '180×200 sm', description: 'Premium yataq kolleksiyası.', collection: 'Prada' },
	{ id: 'p19', name: 'Angel gənc çarpayı', price: 438, image: 'https://embawood.az/image/catalog/Usaq%20və%20genc/Angel/angel_yataq_carpayi.png', category: 'Uşaq və gənc', material: 'Laminat', color: 'Ağ-mavi', dimensions: '90×190 sm', description: 'Gənc otağı üçün.', collection: 'Angel' },
	{ id: 'p20', name: 'Siena yataq dəsti çarpayı', price: 1164, image: 'https://embawood.az/image/catalog/Yeni%20yataq%20destler/Siena%20yataq/siena%20yataq%20desti_carpayi.png', category: 'Yataq mebeli', material: 'MDF, laminat', color: 'Ağ', dimensions: '160×200 sm', description: 'Tam yataq dəsti.', collection: 'Siena' },
	{ id: 'p21', name: 'Sky qonaq dəsti komod', price: 845, image: 'https://embawood.az/image/catalog/new/SKy%20qonaq%20desti/sky_qonaq%20dəsti_komod.png', category: 'Qonaq otağı', material: 'Laminat', color: 'Ağ-ceviz', dimensions: '160×45×80 sm', description: 'Qonaq dəsti komponenti.', collection: 'Sky' },
	{ id: 'p22', name: 'Cross stul', price: 59, image: 'https://embawood.az/image/catalog/Stullar/Cross/cross_stul_1.png', category: 'Masa və stullar', material: 'Metal, parça', color: 'Qara', dimensions: '45×52×85 sm', description: 'Ergonomik stul.', collection: 'Cross' },
	{ id: 'p23', name: 'Classy döşək 160×200', price: 149, image: 'https://embawood.az/image/catalog/Matrass/Classy/classy_160x200.png', category: 'Döşəklər', material: 'Pocket yay', color: 'Ağ', dimensions: '160×200 sm', description: 'Ortopedik dəstək.', collection: 'Classy' },
	{ id: 'p24', name: 'Pianta yataq dəsti çarpayı', price: 890, image: 'https://embawood.az/image/catalog/Yeni%20yataq%20destler/Pianta%20yataq%20desti/pianta_yataq%20dəsti_carpayi.png', category: 'Yataq mebeli', material: 'MDF', color: 'Ağ', dimensions: '160×200 sm', description: 'Yeni kolleksiya.', collection: 'Pianta' },
	{ id: 'p25', name: 'Melina çarpayı', price: 520, image: 'https://embawood.az/image/catalog/Yeni%20yataq%20destler/melina/Melina%20çarpayı.png', category: 'Yataq mebeli', material: 'Laminat', color: 'Açıq qəhvəyi', dimensions: '160×200 sm', description: 'İsti tonlar.', collection: 'Melina' },
	{ id: 'p26', name: 'Efor çarpayı', price: 380, image: 'https://embawood.az/image/catalog/Yeni%20yataq%20destler/efor/efor%20çarpayı_2.png', category: 'Yataq mebeli', material: 'MDF', color: 'Ağ', dimensions: '140×200 sm', description: 'Kiçik otaqlar üçün.', collection: 'Efor' },
	{ id: 'p27', name: 'Cross çarpayı MW 1600', price: 454, image: 'https://embawood.az/image/catalog/Yeni%20yataq%20destler/efor/efor%20çarpayı_2.png', category: 'Yataq mebeli', material: 'Laminat', color: 'Boz', dimensions: '160×200 sm', description: 'Yaddaşlı başlıqlı.', collection: 'Cross' },
	{ id: 'p28', name: 'Borneo künc modul', price: 2100, image: 'https://embawood.az/image/catalog/Borneo%20site/borneo1.jpg', category: 'Künc divanlar', material: 'Parça', color: 'Antrasit', dimensions: '300×200×90 sm', description: 'Premium künc divan.', collection: 'Borneo' },
	{ id: 'p29', name: 'Lena divan modulu', price: 650, image: 'https://embawood.az/image/catalog/Sofa%20set/Lena/lena%203%20yerli.png', category: 'Yumşaq mebel', material: 'Parça', color: 'Bej', dimensions: '120×95×88 sm', description: 'Modul əlavə.', collection: 'Lena' },
	{ id: 'p30', name: 'Hilton kreslo', price: 420, image: 'https://embawood.az/image/catalog/Yumusaq%20divanlar/Hilton/hilton_3%20yerli_1310x911_1.png', category: 'Yumşaq mebel', material: 'Parça', color: 'Bej-qəhvəyi', dimensions: '85×90×80 sm', description: 'Hilton kreslo.', collection: 'Hilton' }
];

/** @param {CatalogItem} item @param {number} seed */
function toProduct(item, seed) {
	const onSale = seed % 4 === 0;
	const oldPrice = onSale ? Math.round(item.price * 1.18) : null;
	return {
		...item,
		price: item.price,
		oldPrice,
		onSale,
		isNew: seed % 5 === 0,
		inStock: seed % 11 !== 0,
		freeDelivery: true,
		warrantyYears: 2
	};
}

export const popularSearches = [
	'3 yerli divan',
	'Yataq dəsti',
	'Uşaq çarpayı',
	'Künc divan',
	'Mətbəx masası',
	'Yemək otağı stulu',
	'Paltar dolabı',
	'Ofis masası',
	'Komod güzgü',
	'Döşək 160x200'
];

export const categories = [
	{ name: 'Yumşaq mebel', count: 186, image: 'https://embawood.az/image/catalog/Yumusaq%20divanlar/liberia_künc%201310x911_2%20(3).png', from: 420 },
	{ name: 'Yataq mebeli', count: 142, image: 'https://embawood.az/image/catalog/Yeni%20yataq%20destler/Siena%20yataq/siena%20yataq%20desti_carpayi.png', from: 280 },
	{ name: 'Qonaq otağı', count: 78, image: 'https://embawood.az/image/catalog/new/SKy%20qonaq%20desti/sky_qonaq%20dəsti_komod.png', from: 320 },
	{ name: 'Masa və stullar', count: 96, image: 'https://embawood.az/image/catalog/Stullar/Cross/cross_stul_1.png', from: 59 },
	{ name: 'Uşaq və gənc', count: 54, image: 'https://embawood.az/image/catalog/Usaq%20və%20genc/Angel/angel_yataq_carpayi.png', from: 199 },
	{ name: 'Döşəklər', count: 32, image: 'https://embawood.az/image/catalog/Matrass/Classy/classy_160x200.png', from: 149 },
	{ name: 'Paltar dolabları', count: 41, image: 'https://embawood.az/image/catalog/Bedroom/Yildiz/trumo.png', from: 450 },
	{ name: 'Komod və güzgülər', count: 63, image: 'https://embawood.az/image/catalog/Bedroom/Tiffany/tiffany_yataq_trumo.png', from: 95 },
	{ name: 'Künc divanlar', count: 28, image: 'https://embawood.az/image/catalog/Yeni%20divanlar/borneo/borneo2.png', from: 680 },
	{ name: 'Ofis mebeli', count: 24, image: 'https://embawood.az/image/catalog/Stullar/Cross/cross_stul_1.png', from: 120 }
];

export const collections = [
	{ name: 'Lena', tagline: 'Rahat qonaq otağı', products: 18, image: 'https://embawood.az/image/catalog/Sofa%20set/Lena/lena%203%20yerli_2.png' },
	{ name: 'Siena', tagline: 'Zərif yataq dəstləri', products: 24, image: 'https://embawood.az/image/catalog/Yeni%20yataq%20destler/Siena%20yataq/siena%20yataq%20desti_carpayi.png' },
	{ name: 'Borneo', tagline: 'Premium salon seriyası', products: 12, image: 'https://embawood.az/image/catalog/Yeni%20divanlar/borneo/borneo2.png' },
	{ name: 'Portofino', tagline: 'Minimal yataq otağı', products: 15, image: 'https://embawood.az/image/catalog/Bedroom/Portofino/tumba_1.png' },
	{ name: 'Sky', tagline: 'Müasir qonaq dəsti', products: 9, image: 'https://embawood.az/image/catalog/new/SKy%20qonaq%20desti/sky_qonaq%20dəsti_komod.png' },
	{ name: 'Angel', tagline: 'Uşaq və gənc otağı', products: 11, image: 'https://embawood.az/image/catalog/Usaq%20və%20genc/Angel/angel_yataq_carpayi.png' }
];

export const companyBenefits = [
	{ title: '2 il zəmanət', desc: 'Bütün məhsullara rəsmi zəmanət', icon: '🛡️' },
	{ title: 'Pulsuz çatdırılma', desc: 'Bakı daxilində sürətli çatdırılma', icon: '🚚' },
	{ title: '12 aya böl', desc: 'Sərfəli hissəli ödəniş imkanı', icon: '💳' },
	{ title: 'Peşəkar quraşdırma', desc: 'Öz komandamızla montaj xidməti', icon: '🔧' },
	{ title: 'Öz istehsalatımız', desc: 'Keyfiyyətə tam nəzarət', icon: '🏭' },
	{ title: 'Mağaza şəbəkəsi', desc: 'Azərbaycan üzrə nümayiş salonları', icon: '📍' }
];

export const roomInspirations = [
	{ title: 'Müasir qonaq otağı', items: 24, image: 'https://embawood.az/image/catalog/Sofa%20set/Lena/lena%203%20yerli_2.png', style: 'Müasir' },
	{ title: 'Skandinav yataq otağı', items: 18, image: 'https://embawood.az/image/catalog/Yeni%20yataq%20destler/Siena%20yataq/siena%20yataq%20desti_carpayi.png', style: 'Skandinav' },
	{ title: 'Minimalist yemək zonası', items: 15, image: 'https://embawood.az/image/catalog/Stullar/Cross/cross_stul_1.png', style: 'Minimal' },
	{ title: 'Rəngli uşaq otağı', items: 21, image: 'https://embawood.az/image/catalog/Usaq%20və%20genc/Angel/angel_yataq_carpayi.png', style: 'Uşaq' },
	{ title: 'Ev ofisi küncü', items: 12, image: 'https://embawood.az/image/catalog/Stullar/Cross/cross_stul_1.png', style: 'Ofis' },
	{ title: 'Loft üslubu salon', items: 19, image: 'https://embawood.az/image/catalog/Yeni%20divanlar/borneo/borneo2.png', style: 'Loft' },
	{ title: 'Klassik yataq interyeri', items: 16, image: 'https://embawood.az/image/catalog/Bedroom/Yildiz/trumo.png', style: 'Klassik' },
	{ title: 'Kiçik mənzil həlli', items: 28, image: 'https://embawood.az/image/catalog/Yumusaq%20divanlar/luca%203%20yerli%20divan.png', style: 'Kompakt' }
];

export const allProducts = CATALOG.map((item, i) => toProduct(item, i + 1));
export const featuredProducts = allProducts.slice(0, 24);
export const newestProducts = allProducts.slice(18, 30);

export const stores = [
	{
		id: 'nizami',
		name: 'onepoint Nizami',
		city: 'Bakı',
		address: 'Nizami küç. 85, Port Baku Mall, 2-ci mərtəbə',
		phone: '+994 12 555 01 01',
		hours: 'Hər gün 10:00 – 21:00',
		image: 'https://embawood.az/image/catalog/Sofa%20set/Lena/lena%203%20yerli_2.png'
	},
	{
		id: 'genclik',
		name: 'onepoint Gənclik',
		city: 'Bakı',
		address: 'Atatürk prospekti 189, Gənclik Mall',
		phone: '+994 12 555 01 02',
		hours: 'Hər gün 10:00 – 21:00',
		image: 'https://embawood.az/image/catalog/Yeni%20divanlar/borneo/borneo2.png'
	},
	{
		id: 'sumqayit',
		name: 'onepoint Sumqayıt',
		city: 'Sumqayıt',
		address: 'Koroglu küç. 12, City Park',
		phone: '+994 18 555 01 03',
		hours: 'B.e – Ş: 10:00 – 20:00',
		image: 'https://embawood.az/image/catalog/Yeni%20yataq%20destler/Siena%20yataq/siena%20yataq%20desti_carpayi.png'
	},
	{
		id: 'gence',
		name: 'onepoint Gəncə',
		city: 'Gəncə',
		address: 'Atatürk prospekti 45',
		phone: '+994 22 555 01 04',
		hours: 'B.e – Ş: 10:00 – 20:00',
		image: 'https://embawood.az/image/catalog/Bedroom/Portofino/tumba_1.png'
	}
];

/** @param {string} text */
export function slugify(text) {
	return text
		.toLowerCase()
		.replace(/ə/g, 'e')
		.replace(/ı/g, 'i')
		.replace(/ö/g, 'o')
		.replace(/ü/g, 'u')
		.replace(/ş/g, 's')
		.replace(/ç/g, 'c')
		.replace(/ğ/g, 'g')
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-|-$/g, '');
}

/** @param {string} slug */
export function getCategoryBySlug(slug) {
	return categories.find((c) => slugify(c.name) === slug) ?? null;
}

/** @param {string} slug */
export function getCollectionBySlug(slug) {
	return collections.find((c) => slugify(c.name) === slug) ?? null;
}

/** @param {string} id */
export function getProductById(id) {
	return allProducts.find((p) => p.id === id) ?? null;
}

/** @param {string} categoryName */
export function getProductsByCategory(categoryName) {
	return allProducts.filter((p) => p.category === categoryName);
}

/** @param {string} collectionName */
export function getProductsByCollection(collectionName) {
	return allProducts.filter((p) => p.collection === collectionName);
}

/** @param {string} query */
export function searchProducts(query) {
	const q = query.trim().toLowerCase();
	if (!q) return allProducts;
	return allProducts.filter(
		(p) =>
			p.name.toLowerCase().includes(q) ||
			p.category.toLowerCase().includes(q) ||
			p.collection.toLowerCase().includes(q) ||
			p.description.toLowerCase().includes(q) ||
			p.material.toLowerCase().includes(q)
	);
}

/** @param {string} id @param {number} limit */
export function getRelatedProducts(id, limit = 4) {
	const product = getProductById(id);
	if (!product) return [];
	return allProducts
		.filter((p) => p.id !== id && (p.collection === product.collection || p.category === product.category))
		.slice(0, limit);
}

/** @param {number} price */
export function formatPrice(price) {
	return `${price.toLocaleString('az-AZ')} ₼`;
}

/** @param {string} name */
export function categoryHref(name) {
	return `/category/${slugify(name)}`;
}

/** @param {string} name */
export function collectionHref(name) {
	return `/collection/${slugify(name)}`;
}
