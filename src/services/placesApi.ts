export interface Restaurant {
  title: string;
  image: string;
  rating: string;
  tags: string;
  address?: string;
  priceLevel?: string;
}

interface PlacesResponse {
  places: Array<{
    displayName: { text: string };
    photos?: Array<{ name: string }>;
    rating?: number;
    priceLevel?: string;
    formattedAddress?: string;
    types?: string[];
  }>;
}

export const fetchNearbyRestaurants = async (
  lat: number,
  lon: number
): Promise<Restaurant[]> => {
  const apiKey = import.meta.env.VITE_GOOGLE_PLACES_API_KEY;

  console.log('API Key loaded:', apiKey ? `${apiKey.substring(0, 10)}...` : 'undefined');
  console.log('All env vars:', import.meta.env);

  const response = await fetch(
    'https://places.googleapis.com/v1/places:searchText',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask': 'places.displayName,places.photos,places.rating,places.formattedAddress,places.priceLevel,places.types'
      },
      body: JSON.stringify({
        textQuery: 'restaurants',
        locationBias: {
          circle: {
            center: {
              latitude: lat,
              longitude: lon
            },
            radius: 5000.0
          }
        },
        maxResultCount: 20,
        languageCode: 'en'
      })
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch restaurants: ${response.statusText}`);
  }

  const data: PlacesResponse = await response.json();

  if (!data.places || data.places.length === 0) {
    throw new Error('No restaurants found nearby. Try a different location.');
  }

  return data.places.map(place => ({
    title: place.displayName.text,
    image: place.photos?.[0]?.name 
      ? `https://places.googleapis.com/v1/${place.photos[0].name}/media?key=${apiKey}&maxHeightPx=600`
      : '/LastBiteStandingBackground.jpg',
    rating: '⭐'.repeat(Math.round(place.rating || 0)),
    tags: place.types?.slice(0, 2).join(', ') || 'Restaurant',
    address: place.formattedAddress,
    priceLevel: place.priceLevel
  }));
};

