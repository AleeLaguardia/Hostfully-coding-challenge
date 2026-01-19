const fs = require('fs');
const path = require('path');

// Data arrays for generating realistic hotels
const hotelPrefixes = ['Grand', 'Royal', 'Luxury', 'Elite', 'Premier', 'Golden', 'Silver', 'Diamond', 'Crystal', 'Sunset', 'Sunrise', 'Ocean', 'Mountain', 'Valley', 'Harbor', 'Riverside', 'Lakeside', 'Paradise', 'Majestic', 'Imperial', 'Regal', 'Noble', 'Classic', 'Modern', 'Urban', 'Coastal', 'Historic', 'Boutique', 'Garden', 'Plaza'];
const hotelSuffixes = ['Hotel', 'Inn', 'Resort', 'Suites', 'Lodge', 'Palace', 'Retreat', 'Manor', 'House', 'Tower', 'Place', 'Court', 'Residences', 'Collection', 'Grand Hotel'];

const categories = ['Luxury', 'Boutique', 'Resort', 'Budget', 'Business', 'Family', 'Romantic', 'Eco-Friendly', 'Historic', 'Modern'];

const tags = [
  'view', 'air conditioning', 'concierge', 'pool', 'spa', 'gym', 'restaurant', 'bar',
  'room service', 'free wifi', 'parking', 'pet friendly', 'beach access', 'ski access',
  'business center', 'conference room', 'laundry', 'airport shuttle', 'kids club', 'rooftop'
];

const roomTypes = ['Budget Room', 'Standard Room', 'Deluxe Room', 'Suite', 'Executive Suite', 'Presidential Suite', 'Family Room', 'Studio'];
const bedOptions = ['1 Queen Bed', '1 King Bed', '2 Double Beds', '2 Queen Beds', '1 King Bed + Sofa', '2 Twin Beds'];
const roomTags = ['vcr/dvd', 'jacuzzi tub', 'suite', 'bathroom shower', 'coffee maker', 'minibar', 'tv', 'balcony', 'ocean view', 'city view', 'mountain view'];
const viewTypes = ['City View', 'Ocean View', 'Mountain View', 'Garden View', 'Pool View', 'Waterfront View', 'Cityside', 'Courtyard'];

// Cities with coordinates and state info
const cities = [
  { city: 'New York', state: 'NY', country: 'USA', lat: 40.7128, lng: -74.0060, streets: ['5th Ave', 'Broadway', 'Park Ave', 'Madison Ave', 'Lexington Ave', 'Wall St', '42nd St'] },
  { city: 'Los Angeles', state: 'CA', country: 'USA', lat: 34.0522, lng: -118.2437, streets: ['Sunset Blvd', 'Hollywood Blvd', 'Wilshire Blvd', 'Santa Monica Blvd', 'Rodeo Dr', 'Melrose Ave'] },
  { city: 'Chicago', state: 'IL', country: 'USA', lat: 41.8781, lng: -87.6298, streets: ['Michigan Ave', 'State St', 'Lake Shore Dr', 'Wacker Dr', 'Clark St', 'Halsted St'] },
  { city: 'Miami', state: 'FL', country: 'USA', lat: 25.7617, lng: -80.1918, streets: ['Ocean Dr', 'Collins Ave', 'Lincoln Rd', 'Brickell Ave', 'Calle Ocho', 'Biscayne Blvd'] },
  { city: 'San Francisco', state: 'CA', country: 'USA', lat: 37.7749, lng: -122.4194, streets: ['Market St', 'Mission St', 'Van Ness Ave', 'Lombard St', 'Fishermans Wharf', 'Union Square'] },
  { city: 'Seattle', state: 'WA', country: 'USA', lat: 47.6062, lng: -122.3321, streets: ['Pike St', 'Pine St', 'First Ave', 'Aurora Ave', 'Rainier Ave', 'University Way'] },
  { city: 'Boston', state: 'MA', country: 'USA', lat: 42.3601, lng: -71.0589, streets: ['Boylston St', 'Newbury St', 'Beacon St', 'Commonwealth Ave', 'Tremont St', 'Atlantic Ave'] },
  { city: 'Denver', state: 'CO', country: 'USA', lat: 39.7392, lng: -104.9903, streets: ['16th St', 'Colfax Ave', 'Broadway', 'Larimer St', 'Blake St', 'Wynkoop St'] },
  { city: 'Austin', state: 'TX', country: 'USA', lat: 30.2672, lng: -97.7431, streets: ['Congress Ave', '6th St', 'Lamar Blvd', 'South Congress', 'Rainey St', 'Red River St'] },
  { city: 'Nashville', state: 'TN', country: 'USA', lat: 36.1627, lng: -86.7816, streets: ['Broadway', 'Music Row', 'West End Ave', '2nd Ave', 'Demonbreun St', 'Church St'] },
  { city: 'Las Vegas', state: 'NV', country: 'USA', lat: 36.1699, lng: -115.1398, streets: ['Las Vegas Blvd', 'Fremont St', 'Paradise Rd', 'Sahara Ave', 'Tropicana Ave', 'Flamingo Rd'] },
  { city: 'San Diego', state: 'CA', country: 'USA', lat: 32.7157, lng: -117.1611, streets: ['Harbor Dr', 'Broadway', 'Pacific Hwy', 'University Ave', 'Garnet Ave', 'Coronado Bridge'] },
  { city: 'Phoenix', state: 'AZ', country: 'USA', lat: 33.4484, lng: -112.0740, streets: ['Central Ave', 'Camelback Rd', 'Indian School Rd', 'McDowell Rd', 'Van Buren St', 'Roosevelt St'] },
  { city: 'Philadelphia', state: 'PA', country: 'USA', lat: 39.9526, lng: -75.1652, streets: ['Market St', 'Broad St', 'Chestnut St', 'Walnut St', 'South St', 'Benjamin Franklin Pkwy'] },
  { city: 'Portland', state: 'OR', country: 'USA', lat: 45.5051, lng: -122.6750, streets: ['Burnside St', 'Hawthorne Blvd', 'Alberta St', 'Division St', 'MLK Blvd', 'Pearl District'] },
  { city: 'Atlanta', state: 'GA', country: 'USA', lat: 33.7490, lng: -84.3880, streets: ['Peachtree St', 'Ponce de Leon Ave', 'Piedmont Ave', 'Marietta St', 'Auburn Ave', 'Edgewood Ave'] },
  { city: 'New Orleans', state: 'LA', country: 'USA', lat: 29.9511, lng: -90.0715, streets: ['Bourbon St', 'Canal St', 'Royal St', 'Magazine St', 'Frenchmen St', 'St Charles Ave'] },
  { city: 'Honolulu', state: 'HI', country: 'USA', lat: 21.3069, lng: -157.8583, streets: ['Kalakaua Ave', 'Ala Moana Blvd', 'Waikiki Beach', 'Kapiolani Blvd', 'King St', 'Beretania St'] },
  { city: 'Washington', state: 'DC', country: 'USA', lat: 38.9072, lng: -77.0369, streets: ['Pennsylvania Ave', 'Constitution Ave', 'K St', 'M St', 'Connecticut Ave', 'Wisconsin Ave'] },
  { city: 'Orlando', state: 'FL', country: 'USA', lat: 28.5383, lng: -81.3792, streets: ['International Dr', 'Orange Ave', 'Colonial Dr', 'Sand Lake Rd', 'Universal Blvd', 'Kirkman Rd'] }
];

// Hotel images (using placeholder hotel images from various sources)
const hotelImages = [
  'https://cf.bstatic.com/xdata/images/hotel/max1024x768/78133927.jpg?k=96f840c9de7f4d412bef79a03d5f694fd9674ffcda920c6de8ed81682e431eac&o=&hp=1',
  'https://cf.bstatic.com/xdata/images/hotel/max1024x768/215955381.jpg?k=ff739f99c9eb5a4a3b0e4c5e2f1ed5cba2b0cd0ad5a8d7b4a4c9f27a5d4a0f4d&o=&hp=1',
  'https://cf.bstatic.com/xdata/images/hotel/max1024x768/276671066.jpg?k=e11ea4e5e3e6c7b7a5a5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5&o=&hp=1',
  'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1024',
  'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1024',
  'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1024',
  'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1024',
  'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=1024',
  'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1024',
  'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=1024',
  'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1024',
  'https://images.unsplash.com/photo-1561501900-3701fa6a0864?w=1024',
  'https://images.unsplash.com/photo-1596436889106-be35e843f974?w=1024',
  'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=1024',
  'https://images.unsplash.com/photo-1535827841776-24afc1e255ac?w=1024'
];

// Helper functions
const randomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const randomFloat = (min, max, decimals = 2) => parseFloat((Math.random() * (max - min) + min).toFixed(decimals));
const randomSubset = (arr, min, max) => {
  const count = randomNumber(min, max);
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

// Generate random date in the past
const randomPastDate = (yearsBack = 10) => {
  const now = new Date();
  const past = new Date(now.getFullYear() - randomNumber(1, yearsBack), randomNumber(0, 11), randomNumber(1, 28));
  return past.toISOString();
};

// Generate hotel description
const generateDescription = (hotelName, city, category) => {
  const descriptions = [
    `${hotelName} offers an exceptional stay in the heart of ${city}. With its ${category.toLowerCase()} atmosphere and world-class amenities, guests enjoy a memorable experience. The hotel features stunning views, comfortable accommodations, and easy access to local attractions.`,
    `Nestled in ${city}, ${hotelName} combines elegance with comfort. This ${category.toLowerCase()} property provides guests with top-tier service, spacious rooms, and convenient location near popular destinations and dining options.`,
    `Experience the best of ${city} at ${hotelName}. Our ${category.toLowerCase()} hotel offers sophisticated rooms, exceptional dining, and personalized service. Ideal for both business and leisure travelers seeking quality accommodation.`,
    `${hotelName} stands as a premier destination in ${city}. Our ${category.toLowerCase()} accommodations feature modern amenities, stylish decor, and attentive staff dedicated to making your stay unforgettable.`,
    `Welcome to ${hotelName}, your home away from home in ${city}. This ${category.toLowerCase()} establishment offers comfortable rooms, excellent facilities, and a prime location for exploring the city's attractions.`
  ];
  return randomElement(descriptions);
};

// Generate French description
const generateDescriptionFr = (hotelName, city, category) => {
  const descriptions = [
    `${hotelName} offre un séjour exceptionnel au cœur de ${city}. Avec son atmosphère ${category.toLowerCase()} et ses équipements de classe mondiale, les clients profitent d'une expérience mémorable.`,
    `Niché à ${city}, ${hotelName} combine élégance et confort. Cette propriété ${category.toLowerCase()} offre aux clients un service de premier ordre et des chambres spacieuses.`,
    `Découvrez le meilleur de ${city} au ${hotelName}. Notre hôtel ${category.toLowerCase()} propose des chambres sophistiquées, une restauration exceptionnelle et un service personnalisé.`,
    `${hotelName} est une destination de premier choix à ${city}. Nos hébergements ${category.toLowerCase()} disposent d'équipements modernes et d'un personnel attentif.`,
    `Bienvenue au ${hotelName}, votre chez-vous à ${city}. Cet établissement ${category.toLowerCase()} offre des chambres confortables et d'excellentes installations.`
  ];
  return randomElement(descriptions);
};

// Generate rooms for a hotel
const generateRooms = () => {
  const numRooms = randomNumber(3, 8);
  const rooms = [];

  for (let i = 0; i < numRooms; i++) {
    const type = randomElement(roomTypes);
    const bedOption = randomElement(bedOptions);
    const view = randomElement(viewTypes);

    rooms.push({
      Description: `${type}, ${bedOption} (${view})`,
      Description_fr: `${type === 'Budget Room' ? 'Chambre Économique' : type === 'Standard Room' ? 'Chambre Standard' : type === 'Deluxe Room' ? 'Chambre Deluxe' : type === 'Suite' ? 'Suite' : type}, ${bedOption} (${view})`,
      Type: type,
      BaseRate: randomFloat(79.99, 499.99),
      BedOptions: bedOption,
      SleepsCount: randomNumber(2, 6),
      SmokingAllowed: Math.random() > 0.7,
      Tags: randomSubset(roomTags, 1, 4)
    });
  }

  return rooms;
};

// Generate a single hotel
const generateHotel = (id) => {
  const cityData = randomElement(cities);
  const prefix = randomElement(hotelPrefixes);
  const suffix = randomElement(hotelSuffixes);
  const hotelName = `${prefix} ${cityData.city} ${suffix}`;
  const category = randomElement(categories);
  const streetNum = randomNumber(1, 9999);
  const street = randomElement(cityData.streets);

  // Add small random offset to coordinates for variety
  const latOffset = randomFloat(-0.05, 0.05, 6);
  const lngOffset = randomFloat(-0.05, 0.05, 6);

  return {
    HotelId: String(id),
    ImageSource: randomElement(hotelImages),
    HotelName: hotelName,
    Description: generateDescription(hotelName, cityData.city, category),
    Description_fr: generateDescriptionFr(hotelName, cityData.city, category),
    Category: category,
    Tags: randomSubset(tags, 3, 6),
    ParkingIncluded: Math.random() > 0.5,
    LastRenovationDate: randomPastDate(),
    Rating: randomFloat(2.5, 5.0, 1),
    Address: {
      StreetAddress: `${streetNum} ${street}`,
      City: cityData.city,
      StateProvince: cityData.state,
      PostalCode: String(randomNumber(10000, 99999)),
      Country: cityData.country
    },
    Location: {
      type: 'Point',
      coordinates: [
        parseFloat((cityData.lng + lngOffset).toFixed(6)),
        parseFloat((cityData.lat + latOffset).toFixed(6))
      ]
    },
    Rooms: generateRooms()
  };
};

// Main function to generate hotels
const generateHotels = (count) => {
  console.log(`Generating ${count} hotels...`);
  const hotels = [];

  for (let i = 1; i <= count; i++) {
    hotels.push(generateHotel(i));
    if (i % 50 === 0) {
      console.log(`Generated ${i} hotels...`);
    }
  }

  return hotels;
};

// Read existing db.json to preserve users and reservations
const dbPath = path.join(__dirname, '..', 'db.json');
let existingData = { users: [], reservations: [] };

try {
  const fileContent = fs.readFileSync(dbPath, 'utf8');
  existingData = JSON.parse(fileContent);
  console.log('Loaded existing users and reservations from db.json');
} catch (e) {
  console.log('No existing db.json found, creating new one');
}

// Generate new hotels
const hotels = generateHotels(250);

// Create final db object
const db = {
  hotels: hotels,
  users: existingData.users || [
    {
      id: '1',
      email: 'test@example.com',
      password: 'password123',
      name: 'John Doe'
    }
  ],
  reservations: existingData.reservations || []
};

// Write to db.json
fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
console.log(`Successfully wrote ${hotels.length} hotels to db.json`);
console.log(`Preserved ${db.users.length} users and ${db.reservations.length} reservations`);
