import { cookies } from "next/headers";

export type Language = "en" | "it";

const COOKIE_NAME = "fixmybike_lang";

export function getCurrentLanguage(): Language {
    const cookieStore = cookies();
    const value = cookieStore.get(COOKIE_NAME)?.value;
    return value === "it" ? "it" : "en";
}

