import DriverDashboard from "@/components/DriverDashboard";
import Map from "@/components/Map";
import RideStatus from "@/components/RideStatus";

export default function DriverPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-800">Driver Dashboard</h1>
      <Map />
      <div className="grid md:grid-cols-2 gap-8">
        <DriverDashboard />
        <RideStatus role="driver" />
      </div>
    </div>
  )
}

