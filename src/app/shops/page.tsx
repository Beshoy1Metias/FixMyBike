import { Metadata } from "next";
import ShopsClient, { Shop } from "./ShopsClient";
import { getCurrentLanguage } from "@/lib/language";

export const metadata: Metadata = {
    title: "Bike Shops in Padova | FixMyBike",
    description: "Find the best bike shops, repair services and cycling specialists in Padova. View ratings, addresses and locations on the map.",
};

const SHOPS_DATA: Shop[] = [
  {
    "id": "1",
    "name": "Student Bike",
    "address": "Piazza A. de Gasperi, 3, 35131 Padova",
    "rating": 4.9,
    "image_url": "/shops/student-bike.webp",
    "lat": 45.4111,
    "lng": 11.8805,
    "hours": {
      "mon": ["11:00-20:00"],
      "tue": ["11:00-20:00"],
      "wed": ["11:00-20:00"],
      "thu": ["11:00-20:00"],
      "fri": ["11:00-20:00"],
      "sat": ["11:00-20:00"],
      "sun": "closed"
    }
  },
  {
    "id": "2",
    "name": "Molena Bike Service",
    "address": "Via Tiziano Aspetti, 172/A, 35132 Padova",
    "rating": 4.8,
    "image_url": "/shops/molena-bike.png",
    "lat": 45.4244,
    "lng": 11.8876,
    "hours": {
      "mon": ["08:30-12:30", "15:00-19:30"],
      "tue": ["08:30-12:30", "15:00-19:30"],
      "wed": ["08:30-12:30", "15:00-19:30"],
      "thu": ["08:30-12:30", "15:00-19:30"],
      "fri": ["08:30-12:30", "15:00-19:30"],
      "sat": ["08:30-13:00", "15:00-19:30"],
      "sun": "closed"
    }
  },
  {
    "id": "3",
    "name": "Shabani Veis",
    "address": "Via Tiziano Aspetti, 136, 35132 Padova",
    "rating": 5.0,
    "image_url": "/shops/shabani-veis.webp",
    "lat": 45.4225,
    "lng": 11.8872,
    "hours": {
      "mon": ["08:30-12:30", "15:30-19:30"],
      "tue": ["08:30-12:30", "15:30-19:30"],
      "wed": ["08:30-12:30", "15:30-19:30"],
      "thu": ["08:30-12:30", "15:30-19:30"],
      "fri": ["08:30-12:30", "15:30-19:30"],
      "sat": ["08:30-12:30", "15:30-19:30"],
      "sun": "closed"
    }
  },
  {
    "id": "4",
    "name": "Street Bike",
    "address": "Via S. Biagio, 28, 35121 Padova",
    "rating": 4.7,
    "image_url": "/shops/street-bike.webp",
    "lat": 45.4081,
    "lng": 11.8794,
    "hours": {
      "mon": ["09:00-12:15", "15:00-19:00"],
      "tue": ["09:00-12:15", "15:00-19:00"],
      "wed": ["09:00-12:15", "15:00-19:00"],
      "thu": ["09:00-12:15", "15:00-19:00"],
      "fri": ["09:00-12:15", "15:00-19:00"],
      "sat": "closed",
      "sun": "closed"
    }
  },
  {
    "id": "5",
    "name": "New Bicycles' Story",
    "address": "Via Jacopo Crescini, 24, 35126 Padova",
    "rating": 4.9,
    "image_url": "/shops/new-bicycles-story.webp",
    "lat": 45.3952,
    "lng": 11.8901,
    "hours": {
      "mon": ["09:00-13:30", "14:30-19:00"],
      "tue": ["09:00-13:30", "14:30-19:00"],
      "wed": ["09:00-13:30", "14:30-19:00"],
      "thu": ["09:00-13:30", "14:30-19:00"],
      "fri": ["09:00-13:30", "14:30-19:00"],
      "sat": "closed",
      "sun": "closed"
    }
  },
  {
    "id": "6",
    "name": "Bike Padova",
    "address": "Via Santa Sofia, 27, 35121 Padova",
    "rating": 4.7,
    "image_url": "/shops/bike-padova.webp",
    "lat": 45.4052,
    "lng": 11.8834,
    "hours": {
      "mon": ["07:30-12:30", "14:30-19:00"],
      "tue": ["07:30-12:30", "14:30-19:00"],
      "wed": ["07:30-12:30", "14:30-19:00"],
      "thu": ["07:30-12:30", "14:30-19:00"],
      "fri": ["07:30-12:30", "14:30-19:00"],
      "sat": ["09:00-13:00"],
      "sun": "closed"
    }
  },
  {
    "id": "7",
    "name": "Motociclo Padova",
    "address": "Via S. Francesco, 121, 35121 Padova",
    "rating": 4.5,
    "image_url": "/shops/motociclo-padova.webp",
    "lat": 45.4055,
    "lng": 11.8812,
    "hours": {
      "mon": ["09:00-12:30", "15:30-19:30"],
      "tue": ["09:00-12:30", "15:30-19:30"],
      "wed": ["09:00-12:30", "15:30-19:30"],
      "thu": ["09:00-12:30", "15:30-19:30"],
      "fri": ["09:00-12:30", "15:30-19:30"],
      "sat": ["09:00-12:30"],
      "sun": "closed"
    }
  },
  {
    "id": "8",
    "name": "MR BIKE",
    "address": "Via Jacopo Facciolati, 22, 35126 Padova",
    "rating": 4.3,
    "image_url": "/shops/mr-bike.webp",
    "lat": 45.3984,
    "lng": 11.8885,
    "hours": {
      "mon": ["08:30-13:00", "15:30-19:00"],
      "tue": ["08:30-13:00", "15:30-19:00"],
      "wed": ["08:30-13:00", "15:30-19:00"],
      "thu": ["08:30-13:00", "15:30-19:00"],
      "fri": ["08:30-13:00", "15:30-19:00"],
      "sat": ["08:30-12:30"],
      "sun": "closed"
    }
  },
  {
    "id": "9",
    "name": "Bici Center",
    "address": "Via Sanmicheli, 1, 35123 Padova",
    "rating": 4.4,
    "image_url": "/shops/bici-center.webp",
    "lat": 45.4011,
    "lng": 11.8824,
    "hours": {
      "mon": ["07:30-12:00", "15:00-19:00"],
      "tue": ["07:30-12:00", "15:00-19:00"],
      "wed": ["07:30-12:00", "15:00-19:00"],
      "thu": ["07:30-12:00", "15:00-19:00"],
      "fri": ["07:30-12:00", "15:00-19:00"],
      "sat": ["08:30-12:00"],
      "sun": "closed"
    }
  },
  {
    "id": "10",
    "name": "Cicli Morello",
    "address": "Via Sorio, 54, 35141 Padova",
    "rating": 4.7,
    "image_url": "/shops/cicli-morello.webp",
    "lat": 45.4022,
    "lng": 11.8601,
    "hours": {
      "mon": ["15:30-19:00"],
      "tue": ["09:00-12:30", "15:30-19:00"],
      "wed": ["09:00-12:30", "15:30-19:00"],
      "thu": ["09:00-12:30", "15:30-19:00"],
      "fri": ["09:00-12:30", "15:30-19:00"],
      "sat": ["09:30-12:00", "16:00-19:00"],
      "sun": "closed"
    }
  },
  {
    "id": "11",
    "name": "Angel Bike",
    "address": "Via Guido Reni, 62, 35133 Padova",
    "rating": 4.6,
    "image_url": "/shops/angel-bike.webp",
    "lat": 45.4354,
    "lng": 11.8845,
    "hours": {
      "mon": "closed",
      "tue": ["09:00-12:30", "15:30-19:00"],
      "wed": ["09:00-12:30", "15:30-19:00"],
      "thu": ["09:00-12:30", "15:30-19:00"],
      "fri": ["09:00-12:30", "15:30-19:00"],
      "sat": ["09:00-12:30", "15:30-19:00"],
      "sun": "closed"
    }
  },
  {
    "id": "12",
    "name": "Bici Mosconi",
    "address": "Via Palestro, 49, 35138 Padova",
    "rating": 4.5,
    "image_url": "/shops/bici-mosconi.webp",
    "lat": 45.4048,
    "lng": 11.8681,
    "hours": {
      "mon": ["08:30-12:30", "15:30-19:30"],
      "tue": ["08:30-12:30", "15:30-19:30"],
      "wed": ["08:30-12:30", "15:30-19:30"],
      "thu": ["08:30-12:30", "15:30-19:30"],
      "fri": ["08:30-12:30", "15:30-19:30"],
      "sat": ["08:30-12:30", "15:30-19:00"],
      "sun": "closed"
    }
  },
  {
    "id": "13",
    "name": "NORD BIKE Store Di Santinello Nicola",
    "address": "Via Tagliamento, 1, 35135 Padova",
    "rating": 4.8,
    "image_url": "/shops/nord-bike.webp",
    "lat": 45.4344,
    "lng": 11.8705,
    "hours": {
      "mon": ["15:00-19:30"],
      "tue": ["08:30-12:30", "15:00-19:30"],
      "wed": ["08:30-12:30", "15:00-19:30"],
      "thu": ["08:30-12:30", "15:30-19:30"],
      "fri": ["08:30-12:30", "15:00-19:30"],
      "sat": ["08:30-12:30", "15:30-18:30"],
      "sun": "closed"
    }
  },
  {
    "id": "14",
    "name": "Faggian Fabio Riparazione Cicli",
    "address": "Via Annibale da Bassano, 4, 35135 Padova",
    "rating": 4.7,
    "image_url": "/shops/faggian-fabio.png",
    "lat": 45.4192,
    "lng": 11.8776,
    "hours": {
      "mon": ["08:30-12:30", "15:00-19:00"],
      "tue": ["08:30-12:30", "15:00-19:00"],
      "wed": ["08:30-12:30", "15:00-19:00"],
      "thu": ["08:30-12:30", "15:00-19:00"],
      "fri": ["09:00-12:30", "15:00-19:00"],
      "sat": ["08:30-12:30"],
      "sun": "closed"
    }
  },
  {
    "id": "15",
    "name": "Pit Bike 3",
    "address": "Via Fabrici Girolamo d'Acquapendente, 59, 35126 Padova",
    "rating": 5.0,
    "image_url": "/shops/pit-bike-3.webp",
    "lat": 45.3882,
    "lng": 11.8808,
    "hours": {
      "mon": ["08:00-19:00"],
      "tue": ["08:00-19:00"],
      "wed": ["08:00-19:00"],
      "thu": ["08:00-19:00"],
      "fri": ["08:00-19:00"],
      "sat": ["08:00-19:00"],
      "sun": "closed"
    }
  },
  {
    "id": "16",
    "name": "Aloha Bikes",
    "address": "Via Monteortone, 29, 35031 Abano Terme PD",
    "rating": 4.7,
    "image_url": "/shops/aloha-bike.png",
    "lat": 45.3549,
    "lng": 11.7708,
    "hours": {
      "mon": ["15:30-19:15"],
      "tue": ["09:00-12:30", "15:30-19:15"],
      "wed": ["09:00-12:30", "15:30-19:15"],
      "thu": ["09:00-12:30", "15:30-19:15"],
      "fri": ["09:00-12:30", "15:30-19:15"],
      "sat": ["09:00-12:30"],
      "sun": "closed"
    }
  },
  {
    "id": "17",
    "name": "Mudi Bike",
    "address": "Via Giambattista Belzoni, 120, 35121 Padova",
    "rating": 4.0,
    "image_url": "/shops/mudi-bike.webp",
    "lat": 45.4071,
    "lng": 11.8897,
    "hours": {
      "mon": ["09:00-12:30", "15:30-18:30"],
      "tue": ["09:00-12:30", "15:00-18:30"],
      "wed": ["09:00-12:30", "15:30-19:00"],
      "thu": ["09:00-12:30", "15:30-19:00"],
      "fri": ["09:00-12:30", "15:00-18:30"],
      "sat": "closed",
      "sun": "closed"
    }
  },
  {
    "id": "18",
    "name": "Pandabike",
    "address": "Via Niccolò Tommaseo, 17, 35131 Padova",
    "rating": 4.4,
    "image_url": "/shops/pandabike.webp",
    "lat": 45.4159,
    "lng": 11.8810,
    "hours": {
      "mon": ["09:30-19:30"],
      "tue": ["09:30-19:30"],
      "wed": ["09:30-19:30"],
      "thu": ["09:30-19:30"],
      "fri": ["09:30-19:30"],
      "sat": ["09:30-19:30"],
      "sun": ["09:30-19:30"]
    }
  },
  {
    "id": "19",
    "name": "Ciclofficina La Mente Comune",
    "address": "Via Cristoforo Moro, 4, 35141 Padova",
    "rating": 4.7,
    "image_url": "/shops/ciclofficina-la-mente-comune.webp",
    "lat": 45.4035,
    "lng": 11.8644,
    "hours": {
      "mon": "closed",
      "tue": ["18:30-21:00"],
      "wed": "closed",
      "thu": ["18:30-21:00"],
      "fri": "closed",
      "sat": "closed",
      "sun": "closed"
    }
  },
  {
    "id": "20",
    "name": "Pit Bike",
    "address": "Via Ognissanti, 9, 35131 Padova",
    "rating": 3.0,
    "image_url": "/shops/pit-bike.webp",
    "lat": 45.4072,
    "lng": 11.8925,
    "hours": {
      "mon": ["08:15-18:30"],
      "tue": ["08:15-18:30"],
      "wed": ["08:15-18:30"],
      "thu": ["08:15-18:30"],
      "fri": ["08:15-18:30"],
      "sat": ["08:15-18:30"],
      "sun": "closed"
    }
  }
];

export default async function ShopsPage() {
    const lang = await getCurrentLanguage();
    
    return (
        <ShopsClient initialShops={SHOPS_DATA} lang={lang as "en" | "it"} />
    );
}
