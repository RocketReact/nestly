import { cookies } from "next/headers";
import { api } from "./api";
import type { User } from "@/types/user";
import { GetDiaryEntriesRep, Note } from "@/types/note";

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

import type { DiaryEntry } from "@/types/note";

// Получить запись по id (PATCH с пустым телом)
export async function fetchDiaryByIdServer(
  noteId: string
): Promise<DiaryEntry | null> {
  try {
    const cookieStore = await cookies();

    const res = await fetch(`https://lehlehka.b.goit.study/diary/${noteId}`, {
      method: "PATCH",
      headers: {
        Cookie: cookieStore.toString(),
      },
      body: JSON.stringify({}),
    });

    if (!res.ok) {
      console.error(
        "[fetchDiaryByIdServer] fetch failed with status:",
        res.status
      );
      return null;
    }

    const data = await res.json();

    return {
      _id: data._id ?? data.id ?? noteId,
      title: data.title ?? "",
      description: data.description ?? data.text ?? "",
      date: data.date ?? data.createdAt ?? new Date().toISOString(),
      emotions: Array.isArray(data.emotions) ? data.emotions : [],
    };
  } catch (e: unknown) {
    if (e instanceof Error) {
      console.error("[fetchDiaryByIdServer] error:", e.message);
    } else {
      console.error("[fetchDiaryByIdServer] unknown error:", e);
    }
    return null;
  }
}

// Обновить запись (PATCH с данными)
export async function updateDiaryEntry(
  noteId: string,
  updates: Partial<Omit<DiaryEntry, "_id">>
): Promise<DiaryEntry | null> {
  try {
    const cookieStore = await cookies();

    const res = await fetch(`https://lehlehka.b.goit.study/diary/${noteId}`, {
      method: "PATCH",
      headers: {
        Cookie: cookieStore.toString(),
      },
      body: JSON.stringify(updates),
    });

    if (!res.ok) {
      console.error("[updateDiaryEntry] fetch failed with status:", res.status);
      return null;
    }

    const data = await res.json();

    return {
      _id: data._id ?? data.id ?? noteId,
      title: data.title ?? "",
      description: data.description ?? data.text ?? "",
      date: data.date ?? data.createdAt ?? new Date().toISOString(),
      emotions: Array.isArray(data.emotions) ? data.emotions : [],
    };
  } catch (e: unknown) {
    if (e instanceof Error) {
      console.error("[updateDiaryEntry] error:", e.message);
    } else {
      console.error("[updateDiaryEntry] unknown error:", e);
    }
    return null;
  }
}

export const getDiaryListServer = async (): Promise<GetDiaryEntriesRep> => {
  const cookieStore = await cookies();
  const { data } = await api.get<GetDiaryEntriesRep>("/diary", {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  return data;
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

export type BabyData = {
  analogy: string;
  image: string;
  description: string[];
  interestingFact: string;
};

export const getWeekInfoBaby = async ({
  weekNumber,
}: {
  weekNumber: string;
}): Promise<BabyData> => {
  const cookieStore = await cookies();
  const { data } = await api.get(`/weeks/${weekNumber}/baby`, {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  return data;
};

export type MomData = {
  feelings: {
    states: string[];
    sensationDescr: string;
  };
  comfortTips: {
    category: string;
    tip: string;
  }[];
};

export const getWeekInfoMom = async ({
  weekNumber,
}: {
  weekNumber: string;
}): Promise<MomData> => {
  const cookieStore = await cookies();
  const { data } = await api.get(`/weeks/${weekNumber}/mom`, {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  return data;
};
