export function filterPhone(phone) {
	return phone.replace(/^(\d{3})\d+(\d{4})$/g, "$1****$2");
}
