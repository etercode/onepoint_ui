/** @type {Record<string, string>} */
export const roomLabels = {
	'living-room': 'Qonaq otağı',
	bedroom: 'Yataq otağı',
	kitchen: 'Mətbəx / yemək otağı',
	kids: 'Uşaq otağı',
	office: 'Ev ofisi'
};

export const consultationRoomOptions = Object.entries(roomLabels).map(([value, label]) => ({
	value,
	label
}));
