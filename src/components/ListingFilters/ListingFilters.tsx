"use client";

import { useState, useEffect, useCallback } from "react";
import styles from "./ListingFilters.module.css";

interface ListingFiltersProps {
    type: "bikes" | "parts" | "mechanics" | "wanted";
    lang: "en" | "it";
    onFilterChange: (filters: any) => void;
    initialFilters?: any;
}

const TEXT = {
    en: {
        searchPlaceholder: "Search...",
        filters: "Filters",
        apply: "Apply Filters",
        clear: "Clear All",
        sortBy: "Sort By",
        newest: "Newest",
        priceLow: "Price: Low to High",
        priceHigh: "Price: High to Low",
        condition: "Condition",
        bikeType: "Bike Type",
        frameSize: "Frame Size",
        category: "Category",
        skillLevel: "Skill Level",
        availability: "Availability",
        all: "All",
        maxBudget: "Max Budget",
        location: "Location",
    },
    it: {
        searchPlaceholder: "Cerca...",
        filters: "Filtri",
        apply: "Applica filtri",
        clear: "Cancella tutto",
        sortBy: "Ordina per",
        newest: "Più recenti",
        priceLow: "Prezzo: dal più basso",
        priceHigh: "Prezzo: dal più alto",
        condition: "Condizione",
        bikeType: "Tipo di bici",
        frameSize: "Taglia telaio",
        category: "Categoria",
        skillLevel: "Livello",
        availability: "Disponibilità",
        all: "Tutte",
        maxBudget: "Budget massimo",
        location: "Città",
    },
};

export default function ListingFilters({ type, lang, onFilterChange, initialFilters = {} }: ListingFiltersProps) {
    const t = TEXT[lang];
    const [filters, setFilters] = useState(initialFilters);
    const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState(initialFilters.q || "");

    // Debounce search term
    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchTerm !== filters.q) {
                const newFilters = { ...filters, q: searchTerm };
                setFilters(newFilters);
                onFilterChange(newFilters);
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm, filters, onFilterChange]);

    const handleFilterChange = (name: string, value: any) => {
        const newFilters = { ...filters, [name]: value };
        setFilters(newFilters);
        onFilterChange(newFilters);
    };

    const clearFilters = () => {
        const emptyFilters = { q: searchTerm };
        setFilters(emptyFilters);
        onFilterChange(emptyFilters);
    };

    const renderBikesFilters = () => (
        <>
            <select 
                className="form-select" 
                value={filters.bikeType || ""} 
                onChange={(e) => handleFilterChange("bikeType", e.target.value)}
            >
                <option value="">{t.bikeType}</option>
                <option value="ROAD">Road</option>
                <option value="MOUNTAIN">MTB</option>
                <option value="GRAVEL">Gravel</option>
                <option value="HYBRID">Hybrid</option>
                <option value="ELECTRIC">E-Bike</option>
                <option value="BMX">BMX</option>
                <option value="FOLDING">Folding</option>
                <option value="CITY">City</option>
            </select>
            <select 
                className="form-select" 
                value={filters.frameSize || ""} 
                onChange={(e) => handleFilterChange("frameSize", e.target.value)}
            >
                <option value="">{t.frameSize}</option>
                <option value="XS">XS</option>
                <option value="S">S</option>
                <option value="M">M</option>
                <option value="L">L</option>
                <option value="XL">XL</option>
                <option value="XXL">XXL</option>
            </select>
            <select 
                className="form-select" 
                value={filters.maxPrice || ""} 
                onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
            >
                <option value="">{t.maxBudget}</option>
                <option value="500">Under €500</option>
                <option value="1000">Under €1,000</option>
                <option value="2000">Under €2,000</option>
                <option value="5000">Under €5,000</option>
            </select>
        </>
    );

    const renderPartsFilters = () => (
        <>
            <select 
                className="form-select" 
                value={filters.category || ""} 
                onChange={(e) => handleFilterChange("category", e.target.value)}
            >
                <option value="">{t.category}</option>
                <option value="BRAKES">Brakes</option>
                <option value="DRIVETRAIN">Drivetrain</option>
                <option value="WHEELS">Wheels</option>
                <option value="HANDLEBARS">Handlebars</option>
                <option value="SADDLE">Saddle</option>
                <option value="FRAME">Frame</option>
                <option value="FORKS">Forks</option>
                <option value="PEDALS">Pedals</option>
                <option value="LIGHTS">Lights</option>
                <option value="ACCESSORIES">Accessories</option>
            </select>
            <select 
                className="form-select" 
                value={filters.condition || ""} 
                onChange={(e) => handleFilterChange("condition", e.target.value)}
            >
                <option value="">{t.condition}</option>
                <option value="NEW">New</option>
                <option value="LIKE_NEW">Like New</option>
                <option value="GOOD">Good</option>
                <option value="FAIR">Fair</option>
            </select>
            <select 
                className="form-select" 
                value={filters.maxPrice || ""} 
                onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
            >
                <option value="">{t.maxBudget}</option>
                <option value="50">Under €50</option>
                <option value="100">Under €100</option>
                <option value="200">Under €200</option>
                <option value="500">Under €500</option>
            </select>
        </>
    );

    const renderMechanicsFilters = () => (
        <>
            <select 
                className="form-select" 
                value={filters.skillLevel || ""} 
                onChange={(e) => handleFilterChange("skillLevel", e.target.value)}
            >
                <option value="">{t.skillLevel}</option>
                <option value="BEGINNER">Beginner</option>
                <option value="INTERMEDIATE">Intermediate</option>
                <option value="EXPERT">Expert</option>
                <option value="PROFESSIONAL">Professional</option>
            </select>
            <select 
                className="form-select" 
                value={filters.maxRate || ""} 
                onChange={(e) => handleFilterChange("maxRate", e.target.value)}
            >
                <option value="">{lang === "it" ? "Tariffa max" : "Max Rate"}</option>
                <option value="30">Under €30/hr</option>
                <option value="50">Under €50/hr</option>
                <option value="80">Under €80/hr</option>
            </select>
            <input 
                className="form-input"
                style={{ width: 140 }}
                placeholder={t.location}
                value={filters.location || ""}
                onChange={(e) => handleFilterChange("location", e.target.value)}
            />
        </>
    );

    const renderWantedFilters = () => (
        <>
            <select 
                className="form-select" 
                value={filters.bikeType || ""} 
                onChange={(e) => handleFilterChange("bikeType", e.target.value)}
            >
                <option value="">{t.bikeType}</option>
                <option value="ROAD">Road</option>
                <option value="MOUNTAIN">MTB</option>
                <option value="GRAVEL">Gravel</option>
                <option value="ELECTRIC">E-Bike</option>
            </select>
            <select 
                className="form-select" 
                value={filters.maxBudget || ""} 
                onChange={(e) => handleFilterChange("maxBudget", e.target.value)}
            >
                <option value="">{t.maxBudget}</option>
                <option value="500">Under €500</option>
                <option value="1000">Under €1,000</option>
                <option value="2000">Under €2,000</option>
            </select>
        </>
    );

    return (
        <div className={styles.wrapper}>
            <div className={styles.desktopBar}>
                <div className={styles.searchWrapper}>
                    <input
                        className="form-input"
                        placeholder={t.searchPlaceholder}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                
                <div className={styles.filtersGroup}>
                    {type === "bikes" && renderBikesFilters()}
                    {type === "parts" && renderPartsFilters()}
                    {type === "mechanics" && renderMechanicsFilters()}
                    {type === "wanted" && renderWantedFilters()}
                    
                    <button className={styles.mobileFilterToggle} onClick={() => setIsMobileFiltersOpen(true)}>
                        <span>🔍</span> {t.filters}
                    </button>
                </div>

                <div className={styles.sortGroup}>
                    <select 
                        className="form-select" 
                        value={filters.sort || ""} 
                        onChange={(e) => handleFilterChange("sort", e.target.value)}
                    >
                        <option value="">{t.newest}</option>
                        <option value="price_asc">{t.priceLow}</option>
                        <option value="price_desc">{t.priceHigh}</option>
                    </select>
                </div>
            </div>

            {/* Mobile Filters Drawer */}
            {isMobileFiltersOpen && (
                <div className={styles.mobileDrawerOverlay}>
                    <div className={styles.mobileDrawer}>
                        <div className={styles.drawerHeader}>
                            <h3>{t.filters}</h3>
                            <button className={styles.closeBtn} onClick={() => setIsMobileFiltersOpen(false)}>✕</button>
                        </div>
                        <div className={styles.drawerBody}>
                            <div className="form-group">
                                <label className="form-label">{t.searchPlaceholder}</label>
                                <input
                                    className="form-input"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            
                            {type === "bikes" && renderBikesFilters()}
                            {type === "parts" && renderPartsFilters()}
                            {type === "mechanics" && renderMechanicsFilters()}
                            {type === "wanted" && renderWantedFilters()}
                            
                            <div className="form-group">
                                <label className="form-label">{t.sortBy}</label>
                                <select 
                                    className="form-select" 
                                    value={filters.sort || ""} 
                                    onChange={(e) => handleFilterChange("sort", e.target.value)}
                                >
                                    <option value="">{t.newest}</option>
                                    <option value="price_asc">{t.priceLow}</option>
                                    <option value="price_desc">{t.priceHigh}</option>
                                </select>
                            </div>
                        </div>
                        <div className={styles.drawerFooter}>
                            <button className="btn btn-gray" onClick={clearFilters}>
                                {t.clear}
                            </button>
                            <button className="btn btn-primary" onClick={() => setIsMobileFiltersOpen(false)}>
                                {t.apply}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
