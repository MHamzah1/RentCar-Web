/**
 * RentCar — dummy data layer.
 * All photos come from Unsplash (remote URLs, configured in next.config.ts).
 */

export const unsplash = (id: string, w = 1200, q = 70) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=${q}`;

/** Guaranteed-good fallback used by <CarImage /> when a photo fails to load. */
export const FALLBACK_IMAGE = unsplash("1492144534655-ae79c964c9d7");

export const site = {
  name: "RentCar",
  tagline: "Experience the road like never before",
  phone: "+62 812-3456-789",
  email: "hello@rentcar.id",
  address: "Jl. Sudirman Kav. 21, Jakarta 12920, Indonesia",
  hours: "Mon – Sun: 08.00 – 21.00",
  nav: [
    { label: "Home", href: "/" },
    { label: "Vehicles", href: "/vehicles" },
    { label: "Details", href: "/vehicles/tesla-model-3" },
    { label: "About Us", href: "/about" },
    { label: "Contact Us", href: "/contact" },
  ],
};

/* ------------------------------------------------------------------ types */

export const categories = [
  "All vehicles",
  "Sedan",
  "Cabriolet",
  "Pickup",
  "SUV",
  "Minivan",
] as const;

export type Category = (typeof categories)[number];

export interface Car {
  slug: string;
  name: string;
  category: Exclude<Category, "All vehicles">;
  pricePerDay: number;
  rating: number;
  reviewCount: string;
  image: string;
  gallery: string[];
  description: string;
  specs: {
    gearBox: string;
    fuel: string;
    doors: number;
    airConditioner: string;
    seats: number;
    distance: string;
  };
  equipment: string[];
}

/* ------------------------------------------------------------------- cars */

const DRIVE_SHOTS = [
  unsplash("1492144534655-ae79c964c9d7"), // night drive
  unsplash("1502877338535-766e1452684a"), // dusk road
  unsplash("1533473359331-0135ef1b58bf"), // headlights on road
];

const baseEquipment = [
  "ABS & EBD braking",
  "Air conditioning",
  "Bluetooth audio",
  "Cruise control",
  "Rear-view camera",
  "USB fast charging",
];

const car = (
  slug: string,
  name: string,
  category: Car["category"],
  pricePerDay: number,
  rating: number,
  reviewCount: string,
  photoId: string,
  seats: number,
  doors: number,
  fuel: string,
  gearBox = "Automatic",
): Car => ({
  slug,
  name,
  category,
  pricePerDay,
  rating,
  reviewCount,
  image: unsplash(photoId),
  gallery: [unsplash(photoId), ...DRIVE_SHOTS],
  description:
    `${name} is ready for your next trip — professionally maintained, fully insured, ` +
    `and delivered with a full tank. Enjoy a smooth ${gearBox.toLowerCase()} drive, ` +
    `${seats} comfortable seats, and everything you need for the city or the open road.`,
  specs: {
    gearBox,
    fuel,
    doors,
    airConditioner: "Yes",
    seats,
    distance: "Unlimited",
  },
  equipment: baseEquipment,
});

export const cars: Car[] = [
  car("tesla-model-3", "Tesla Model 3", "Sedan", 89, 4.8, "2.4k", "1560958089-b8a1929cea89", 5, 4, "Electric"),
  car("tesla-model-s", "Tesla Model S", "Sedan", 135, 4.9, "1.8k", "1617788138017-80ad40651399", 5, 4, "Electric"),
  car("bmw-m8-gran-coupe", "BMW M8 Gran Coupe", "Sedan", 165, 4.9, "1.1k", "1555215695-3004980ad54e", 4, 4, "Petrol"),
  car("bmw-m4-competition", "BMW M4 Competition", "Sedan", 150, 4.7, "980", "1544636331-e26879cd4d9b", 4, 2, "Petrol"),
  car("audi-a6", "Audi A6", "Sedan", 95, 4.6, "1.5k", "1533473359331-0135ef1b58bf", 5, 4, "Hybrid"),
  car("ford-mustang-gt", "Ford Mustang GT", "Cabriolet", 120, 4.8, "2.1k", "1494976388531-d1058494cdd8", 4, 2, "Petrol"),
  car("chevrolet-camaro-ss", "Chevrolet Camaro SS", "Cabriolet", 115, 4.6, "870", "1552519507-da3b142c6e3d", 4, 2, "Petrol"),
  car("porsche-911-carrera", "Porsche 911 Carrera", "Cabriolet", 180, 5.0, "760", "1503376780353-7e6692767b70", 2, 2, "Petrol"),
  car("mazda-mx5", "Mazda MX-5", "Cabriolet", 75, 4.5, "640", "1549317661-bd32c8ce0db2", 2, 2, "Petrol", "Manual"),
  car("jeep-gladiator", "Jeep Gladiator", "Pickup", 110, 4.7, "530", "1568605117036-5fe5e7bab0b7", 5, 4, "Diesel"),
  car("bmw-x5", "BMW X5", "SUV", 140, 4.8, "1.2k", "1580273916550-e323be2ae537", 5, 4, "Diesel"),
  car("mercedes-v-class", "Mercedes V-Class", "Minivan", 130, 4.7, "410", "1542362567-b07e54358753", 7, 4, "Diesel"),
];

export const getCar = (slug: string) => cars.find((c) => c.slug === slug);

export const popularCars = [
  cars[0], // Tesla Model 3
  cars[5], // Mustang
  cars[10], // BMW X5
  cars[7], // Porsche 911
];

/* -------------------------------------------------------------- avatars */

export const avatars = {
  woman1: unsplash("1494790108377-be9c29b29330", 200),
  man1: unsplash("1507003211169-0a1dd7228f2d", 200),
  woman2: unsplash("1438761681033-6461ffad8d80", 200),
  man2: unsplash("1472099645785-5658abf4ff4e", 200),
};

/* -------------------------------------------------------------- content */

export const stats = [
  { value: "540+", label: "Cars" },
  { value: "20k+", label: "Customers" },
  { value: "25+", label: "Years" },
  { value: "20m+", label: "Miles" },
];

export const reviews = [
  {
    quote:
      "Booked a Tesla for a weekend trip and everything was flawless — spotless car, quick pickup, and the price never changed at checkout.",
    name: "Amanda Putri",
    city: "Jakarta",
    avatar: avatars.woman1,
  },
  {
    quote:
      "The support team answered in minutes when my flight was delayed and moved my pickup time for free. That is how rental should work.",
    name: "Daniel Wijaya",
    city: "Bandung",
    avatar: avatars.man1,
  },
  {
    quote:
      "Huge fleet, honest pricing, unlimited mileage. RentCar has become my default choice for every business trip out of town.",
    name: "Sarah Chen",
    city: "Surabaya",
    avatar: avatars.woman2,
  },
];

export const heroImage = unsplash("1555215695-3004980ad54e", 1400);
export const whyChooseImage = unsplash("1503376780353-7e6692767b70", 1200);
export const aboutHeroImage = unsplash("1502877338535-766e1452684a", 1800);
export const aboutStoryImage = unsplash("1492144534655-ae79c964c9d7", 1200);
export const appScreens = [
  unsplash("1560958089-b8a1929cea89", 700),
  unsplash("1544636331-e26879cd4d9b", 700),
];
