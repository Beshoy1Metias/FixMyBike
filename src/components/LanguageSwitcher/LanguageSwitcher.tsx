"use client";

import { useLanguage } from "@/components/LanguageProvider/LanguageProvider";
import { useRouter } from "next/navigation";

export default function LanguageSwitcher() {
    const { language, setLanguage } = useLanguage();
    const router = useRouter();

    const handleChange = (lang: "en" | "it") => {
        if (lang === language) return;
        setLanguage(lang);
        router.refresh();
    };

    return (
        <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
            <button
                type="button"
                onClick={() => handleChange("en")}
                className="btn btn-ghost btn-xs"
                aria-label="Switch language to English"
                style={{
                    paddingInline: "0.5rem",
                    opacity: language === "en" ? 1 : 0.6,
                    fontWeight: language === "en" ? 600 : 400,
                }}
            >
                EN
            </button>
            <span style={{ opacity: 0.4 }}>|</span>
            <button
                type="button"
                onClick={() => handleChange("it")}
                className="btn btn-ghost btn-xs"
                aria-label="Cambia lingua in italiano"
                style={{
                    paddingInline: "0.5rem",
                    opacity: language === "it" ? 1 : 0.6,
                    fontWeight: language === "it" ? 600 : 400,
                }}
            >
                IT
            </button>
        </div>
    );
}

