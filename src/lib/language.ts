import { cookies } from "next/headers";

export type Language = "en" | "it";

const COOKIE_NAME = "fixmybike_lang";

export async function getCurrentLanguage(): Promise<Language> {
    const cookieStore = await cookies();
    const value = cookieStore.get(COOKIE_NAME)?.value;
    return value === "it" ? "it" : "en";
}

