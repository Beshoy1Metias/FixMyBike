"use client";

import { createContext, useContext, useEffect, useState } from "react";

export type Language = "en" | "it";

interface LanguageContextValue {
    language: Language;
    setLanguage: (lang: Language) => void;
}

const COOKIE_NAME = "fixmybike_lang";

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

function readLanguageFromCookie(): Language {
    if (typeof document === "undefined") return "it";
    const match = document.cookie.split(";").find((c) => c.trim().startsWith(`${COOKIE_NAME}=`));
    if (!match) return "it";
    const value = match.split("=")[1]?.trim();
    return value === "en" ? "en" : "it";
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [language, setLanguageState] = useState<Language>("it");

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setLanguageState(readLanguageFromCookie());
    }, []);

    const setLanguage = (lang: Language) => {
        setLanguageState(lang);
        if (typeof document !== "undefined") {
            const oneYear = 60 * 60 * 24 * 365;
            document.cookie = `${COOKIE_NAME}=${lang}; path=/; max-age=${oneYear}`;
        }
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage(): LanguageContextValue {
    const ctx = useContext(LanguageContext);
    if (!ctx) {
        throw new Error("useLanguage must be used within a LanguageProvider");
    }
    return ctx;
}

