import { Metadata } from "next";
import ShopsClient from "./ShopsClient";
import { getCurrentLanguage } from "@/lib/language";

export const metadata: Metadata = {
    title: "Bike Shops in Padova | FixMyBike",
    description: "Find the best bike shops, repair services and cycling specialists in Padova. View ratings, addresses and locations on the map.",
};

const SHOPS_DATA = [
    { "id": "1", "name": "Student Bike", "address": "Piazza A. de Gasperi, 3, 35131 Padova", "rating": 4.9, "image_url": "/shops/student-bike.webp", "lat": 45.4111, "lng": 11.8805, "phone": "+39 049 875 0666" },
    { "id": "2", "name": "Molena Bike Service", "address": "Via Tiziano Aspetti, 172/A, 35132 Padova", "rating": 4.8, "image_url": "/shops/molena-bike.png", "lat": 45.4244, "lng": 11.8876, "phone": "+39 049 601 234" },
    { "id": "3", "name": "Shabani Veis", "address": "Via Tiziano Aspetti, 136, 35132 Padova", "rating": 5.0, "image_url": "/shops/shabani-veis.webp", "lat": 45.4225, "lng": 11.8872, "phone": "+39 345 678 9012" },
    { "id": "4", "name": "Street Bike", "address": "Via S. Biagio, 28, 35121 Padova", "rating": 4.7, "image_url": "/shops/street-bike.webp", "lat": 45.4081, "lng": 11.8794, "phone": "+39 049 661 223" },
    { "id": "5", "name": "New Bicycles' Story", "address": "Via Jacopo Crescini, 24, 35126 Padova", "rating": 4.9, "image_url": "/shops/new-bicycles-story.webp", "lat": 45.3952, "lng": 11.8901, "phone": "+39 049 750 111" },
    { "id": "6", "name": "Bike Padova", "address": "Via Santa Sofia, 27, 35121 Padova", "rating": 4.7, "image_url": "/shops/bike-padova.webp", "lat": 45.4052, "lng": 11.8834, "phone": "+39 049 875 4321" },
    { "id": "7", "name": "Motociclo Padova", "address": "Via S. Francesco, 121, 35121 Padova", "rating": 4.5, "image_url": "/shops/motociclo-padova.webp", "lat": 45.4055, "lng": 11.8812, "phone": "+39 049 654 321" },
    { "id": "8", "name": "MR BIKE", "address": "Via Jacopo Facciolati, 22, 35126 Padova", "rating": 4.3, "image_url": "/shops/mr-bike.webp", "lat": 45.3984, "lng": 11.8885, "phone": "+39 049 755 888" },
    { "id": "9", "name": "Bici Center", "address": "Via Sanmicheli, 1, 35123 Padova", "rating": 4.4, "image_url": "/shops/bici-center.webp", "lat": 45.4011, "lng": 11.8824, "phone": "+39 049 875 999" },
    { "id": "10", "name": "Cicli Morello", "address": "Via Sorio, 54, 35141 Padova", "rating": 4.7, "image_url": "/shops/cicli-morello.webp", "lat": 45.4022, "lng": 11.8601, "phone": "+39 049 871 000" },
    { "id": "11", "name": "Angel Bike", "address": "Via Guido Reni, 62, 35133 Padova", "rating": 4.6, "image_url": "/shops/angel-bike.webp", "lat": 45.4354, "lng": 11.8845, "phone": "+39 049 600 111" },
    { "id": "12", "name": "Aloha Cicloriparazioni", "address": "Via Milazzo, 2a/b, 35139 Padova", "rating": 4.8, "image_url": "/shops/aloha-bike.png", "lat": 45.4015, "lng": 11.8712, "phone": "+39 049 872 222" },
    { "id": "13", "name": "Bici Mosconi", "address": "Via Palestro, 49, 35138 Padova", "rating": 4.5, "image_url": "/shops/bici-mosconi.webp", "lat": 45.4048, "lng": 11.8681, "phone": "+39 049 873 333" }
];

export default async function ShopsPage() {
    const lang = await getCurrentLanguage();
    
    return (
        <ShopsClient initialShops={SHOPS_DATA} lang={lang as "en" | "it"} />
    );
}
