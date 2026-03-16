export interface Monkey {
  id: number;
  slug: string;
  name: string;
  displayName: string;
  scientificName: string;
  family: string;
  conservationStatus: "LC" | "NT" | "VU" | "EN" | "CR";
  imageUrl: string;
  imageCredit: string;
  habitatImageUrl: string;
  habitatImageCaption: string;
  soundUrl?: string;
  soundUrlMp3?: string;
  audioQuote: string;
  audioMeta: string;
  notes: [string, string];
  habitatName: string;
  coordinates: string;
  lat: number;
  lng: number;
  locationName: string;
  sensory: {
    thermal: string;
    olfactory: string;
    auditory: string;
  };
  quote: string;
  diet: string;
  lifespan: number;
  weight: number;
  activityPattern: "diurnal" | "nocturnal" | "crepuscular";
  populationEstimate: string;
  habitatRecoveryRate: string;
  populationHistory: { year: number; population: number }[];
  conservationText: string;
  dedicationText: string;
}
