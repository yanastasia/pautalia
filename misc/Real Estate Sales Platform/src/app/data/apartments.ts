export type ApartmentStatus = 'available' | 'reserved' | 'sold';

export interface Apartment {
  id: string;
  code: string;
  bedrooms: number;
  area: number;
  floor: number;
  orientation: string;
  status: ApartmentStatus;
  price: number;
  floorplanUrl?: string;
  images: string[];
  features: string[];
  description: string;
}

export const apartments: Apartment[] = [
  {
    id: '1',
    code: 'A-12',
    bedrooms: 2,
    area: 68,
    floor: 1,
    orientation: 'South',
    status: 'available',
    price: 89000,
    images: [],
    features: ['Spacious living room', 'Modern kitchen', 'Balcony with garden view', 'Premium finishes'],
    description: 'A beautifully designed 2-bedroom apartment featuring an open-plan living area with abundant natural light. Perfect for small families or couples seeking quality and comfort.'
  },
  {
    id: '2',
    code: 'A-15',
    bedrooms: 3,
    area: 92,
    floor: 1,
    orientation: 'East',
    status: 'available',
    price: 119000,
    images: [],
    features: ['Master bedroom with en-suite', 'Separate kitchen', 'Two balconies', 'Storage room'],
    description: 'Spacious 3-bedroom apartment ideal for families. Features include a master bedroom with private bathroom and two generous balconies.'
  },
  {
    id: '3',
    code: 'B-23',
    bedrooms: 2,
    area: 74,
    floor: 2,
    orientation: 'South-West',
    status: 'reserved',
    price: 95000,
    images: [],
    features: ['Corner unit', 'Panoramic windows', 'Premium flooring', 'Walk-in closet'],
    description: 'Premium corner apartment with exceptional natural light and mountain views. High-end finishes throughout.'
  },
  {
    id: '4',
    code: 'B-24',
    bedrooms: 1,
    area: 52,
    floor: 2,
    orientation: 'North',
    status: 'available',
    price: 68000,
    images: [],
    features: ['Compact layout', 'Modern bathroom', 'Built-in storage', 'Energy efficient'],
    description: 'Perfectly designed 1-bedroom apartment for individuals or investors. Optimized layout maximizes every square meter.'
  },
  {
    id: '5',
    code: 'C-31',
    bedrooms: 3,
    area: 98,
    floor: 3,
    orientation: 'South',
    status: 'available',
    price: 128000,
    images: [],
    features: ['Top floor', 'Mountain views', 'Large terrace', 'Premium kitchen appliances'],
    description: 'Exceptional top-floor residence with breathtaking mountain views. Spacious terrace perfect for outdoor living.'
  },
  {
    id: '6',
    code: 'C-32',
    bedrooms: 2,
    area: 71,
    floor: 3,
    orientation: 'West',
    status: 'sold',
    price: 92000,
    images: [],
    features: ['Sunset views', 'Open kitchen', 'Balcony', 'Premium finishes'],
    description: 'Sold - Beautiful apartment with western exposure offering stunning sunset views.'
  },
  {
    id: '7',
    code: 'A-11',
    bedrooms: 2,
    area: 69,
    floor: 1,
    orientation: 'North-East',
    status: 'available',
    price: 88000,
    images: [],
    features: ['Garden access', 'Modern design', 'Large windows', 'Efficient layout'],
    description: 'Ground floor apartment with direct garden access. Ideal for families with children or pets.'
  },
  {
    id: '8',
    code: 'B-21',
    bedrooms: 3,
    area: 95,
    floor: 2,
    orientation: 'South-East',
    status: 'available',
    price: 122000,
    images: [],
    features: ['Corner apartment', 'Two bathrooms', 'Laundry room', 'Large balcony'],
    description: 'Luxurious 3-bedroom corner unit with superior natural light and cross ventilation.'
  },
];

export const buildingInfo = {
  name: 'Residence Kyustendil',
  totalUnits: 24,
  floors: 3,
  parkingSpaces: 24,
  deliveryDate: 'Q4 2027',
  constructionType: 'Reinforced concrete',
  energyClass: 'A',
  features: [
    'Underground parking',
    'Energy-efficient design',
    'Premium construction materials',
    'Landscaped common areas',
    'Video surveillance',
    'Access control system'
  ]
};
