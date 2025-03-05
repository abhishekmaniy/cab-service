import { create } from "zustand";

type LocationStore = {
  location: { latitude: number; longitude: number } | null
  setLocation: (location: {
    latitude: number
    longitude: number
  } | null) => void
}

export const useLocationStore = create<LocationStore>(set => ({
  location: null,
  setLocation: location => set({ location: location })
}))
