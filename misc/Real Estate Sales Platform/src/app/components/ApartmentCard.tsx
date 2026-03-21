import { Link } from "react-router";
import { Apartment } from "../data/apartments";
import { Bed, Maximize2, Building2, ArrowRight } from "lucide-react";
import { Badge } from "./ui/badge";

interface ApartmentCardProps {
  apartment: Apartment;
}

export function ApartmentCard({ apartment }: ApartmentCardProps) {
  const statusColors = {
    available: "bg-green-100 text-green-800 border-green-200",
    reserved: "bg-yellow-100 text-yellow-800 border-yellow-200",
    sold: "bg-gray-100 text-gray-600 border-gray-200",
  };

  const statusLabels = {
    available: "Available",
    reserved: "Reserved",
    sold: "Sold",
  };

  return (
    <div className="bg-white rounded-xl border border-border overflow-hidden hover:shadow-lg transition-all group">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-2xl font-bold text-primary mb-1">Unit {apartment.code}</h3>
            <p className="text-sm text-muted-foreground">{apartment.orientation} Facing</p>
          </div>
          <Badge className={`${statusColors[apartment.status]} border`}>
            {statusLabels[apartment.status]}
          </Badge>
        </div>

        {/* Quick Facts */}
        <div className="grid grid-cols-3 gap-4 mb-6 pb-6 border-b border-border">
          <div className="flex items-center space-x-2">
            <Bed className="w-4 h-4 text-muted-foreground" />
            <div>
              <div className="text-sm text-muted-foreground">Bedrooms</div>
              <div className="font-semibold text-primary">{apartment.bedrooms}</div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Maximize2 className="w-4 h-4 text-muted-foreground" />
            <div>
              <div className="text-sm text-muted-foreground">Area</div>
              <div className="font-semibold text-primary">{apartment.area} m²</div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Building2 className="w-4 h-4 text-muted-foreground" />
            <div>
              <div className="text-sm text-muted-foreground">Floor</div>
              <div className="font-semibold text-primary">{apartment.floor}</div>
            </div>
          </div>
        </div>

        {/* Price */}
        {apartment.status !== 'sold' && (
          <div className="mb-6">
            <div className="text-sm text-muted-foreground mb-1">Starting from</div>
            <div className="text-3xl font-bold text-accent">
              €{apartment.price.toLocaleString()}
            </div>
          </div>
        )}

        {/* Action Button */}
        <Link
          to={`/apartment/${apartment.id}`}
          className={`w-full flex items-center justify-center px-6 py-3 rounded-lg transition-all ${
            apartment.status === 'sold'
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-primary text-primary-foreground hover:bg-primary/90 group-hover:shadow-md'
          }`}
        >
          {apartment.status === 'sold' ? (
            'No Longer Available'
          ) : (
            <>
              View Details
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </Link>
      </div>
    </div>
  );
}
