import { cookies } from "next/headers";
import { api } from "@/app/api/api";
import type { User } from "@/types/user";
import { Note } from "@/types/note";

export interface FetchNotesProps {
	page?: number;
	perPage?: number;
	search?: string;
	tag?: string;
}

export interface FetchNotesResponse {
	notes: Note[];
	totalPages: number;
}

export const fetchServerNotes = async (
	params: FetchNotesProps
): Promise<FetchNotesResponse> => {
	const cookieStore = await cookies();
	const response = await api.get<FetchNotesResponse>("/notes", {
		params,
		headers: {
			Cookie: cookieStore.toString(),
		},
	});
	return response.data;
};

export const fetchServerNoteById = async (id: string): Promise<Note> => {
	const cookieStore = await cookies();
	const response = await api.get<Note>(`/notes/${id}`, {
		headers: {
			Cookie: cookieStore.toString(),
		},
	});
	return response.data;
};

export const checkServerSession = async () => {
	const cookieStore = await cookies();
	return await api.get(`/auth/session`, {
		headers: {
			Cookie: cookieStore.toString(),
		},
	});
};

export const getServerMe = async (): Promise<User> => {
	const cookieStore = await cookies();
	const { data } = await api.get(`/users/current`, {
		headers: {
			Cookie: cookieStore.toString(),
		},
	});
	return data;
};
