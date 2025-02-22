import { create } from "zustand"
import { Ride } from "@prisma/client"

type RideStore = {
  currentRide: Ride | null
  setCurrentRide: (ride: Ride | null) => void
}

export const useRideStore = create<RideStore>((set) => ({
  currentRide: null,
  setCurrentRide: (ride) => set({ currentRide: ride }),
}))
