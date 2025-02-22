import Map from "@/components/Map";
import RideRequest from "@/components/RiderRequest";
import RideStatus from "@/components/RideStatus";

export default function RiderPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-800">Rider Dashboard</h1>
      <Map />
      <div className="grid md:grid-cols-2 gap-8">
        <RideRequest />
        <RideStatus role="rider" />
      </div>
    </div>
  )
}

