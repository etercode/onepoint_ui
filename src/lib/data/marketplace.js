export const COMPANY = {
	name: 'Mirvari Mebel',
	tagline: 'Premium mebel mağazası',
	since: 2010
};

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

export const stores = [
	{
		id: 'nizami',
		name: 'Mirvari Mebel Nizami',
		city: 'Bakı',
		address: 'Nizami küç. 85, Port Baku Mall, 2-ci mərtəbə',
		phone: '+994 12 555 01 01',
		hours: 'Hər gün 10:00 – 21:00',
		image: 'https://embawood.az/image/catalog/Sofa%20set/Lena/lena%203%20yerli_2.png'
	},
	{
		id: 'genclik',
		name: 'Mirvari Mebel Gənclik',
		city: 'Bakı',
		address: 'Atatürk prospekti 189, Gənclik Mall',
		phone: '+994 12 555 01 02',
		hours: 'Hər gün 10:00 – 21:00',
		image: 'https://embawood.az/image/catalog/Yeni%20divanlar/borneo/borneo2.png'
	},
	{
		id: 'sumqayit',
		name: 'Mirvari Mebel Sumqayıt',
		city: 'Sumqayıt',
		address: 'Koroglu küç. 12, City Park',
		phone: '+994 18 555 01 03',
		hours: 'B.e – Ş: 10:00 – 20:00',
		image: 'https://embawood.az/image/catalog/Yeni%20yataq%20destler/Siena%20yataq/siena%20yataq%20desti_carpayi.png'
	},
	{
		id: 'gence',
		name: 'Mirvari Mebel Gəncə',
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

/** @param {number} price */
export function formatPrice(price) {
	return `${price.toLocaleString('az-AZ')} ₼`;
}

/** @param {string} slug */
export function categoryHref(slug) {
	return `/category/${slug}`;
}

/** @param {string} slug */
export function collectionHref(slug) {
	return `/collection/${slug}`;
}
