export interface User {
	id: string;
	email: string;
	name: string;
	avatar?: string;
	childGender?: "boy" | "girl" | "unknown";
	deliveryDate?: string;
	createdAt: Date;
	updatedAt: Date;
}

export interface LoginData {
	email: string;
	password: string;
}

export interface RegisterData {
	name: string;
	email: string;
	password: string;
}

export interface ProfileUpdatePayload {
	username: string;
	email: string;
}
