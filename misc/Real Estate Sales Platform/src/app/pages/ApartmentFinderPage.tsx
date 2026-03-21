import { useState } from "react";
import { Navigation } from "../components/Navigation";
import { Footer } from "../components/Footer";
import { ApartmentCard } from "../components/ApartmentCard";
import { apartments } from "../data/apartments";
import { SlidersHorizontal, X } from "lucide-react";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { motion } from "motion/react";

export function ApartmentFinderPage() {
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    bedrooms: "all",
    floor: "all",
    status: "all",
    orientation: "all",
  });

  const filteredApartments = apartments.filter((apt) => {
    if (filters.bedrooms !== "all" && apt.bedrooms !== parseInt(filters.bedrooms)) return false;
    if (filters.floor !== "all" && apt.floor !== parseInt(filters.floor)) return false;
    if (filters.status !== "all" && apt.status !== filters.status) return false;
    if (filters.orientation !== "all" && !apt.orientation.toLowerCase().includes(filters.orientation.toLowerCase())) return false;
    return true;
  });

  const resetFilters = () => {
    setFilters({
      bedrooms: "all",
      floor: "all",
      status: "all",
      orientation: "all",
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      {/* Header */}
      <section className="bg-primary text-primary-foreground py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-4">Find Your Apartment</h1>
            <p className="text-xl text-primary-foreground/80 max-w-2xl">
              Browse our selection of thoughtfully designed apartments. 
              Use filters to find the perfect match for your needs.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters and Results */}
      <section className="flex-1 py-12 px-6 bg-background">
        <div className="max-w-7xl mx-auto">
          {/* Mobile Filter Toggle */}
          <div className="lg:hidden mb-6">
            <Button
              onClick={() => setShowFilters(!showFilters)}
              variant="outline"
              className="w-full flex items-center justify-center space-x-2"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>{showFilters ? 'Hide' : 'Show'} Filters</span>
            </Button>
          </div>

          <div className="grid lg:grid-cols-4 gap-8">
            {/* Filters Sidebar */}
            <div className={`lg:block ${showFilters ? 'block' : 'hidden'} lg:col-span-1`}>
              <div className="bg-white rounded-xl border border-border p-6 sticky top-24">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-primary">Filters</h2>
                  <Button
                    onClick={resetFilters}
                    variant="ghost"
                    size="sm"
                    className="text-accent hover:text-accent/80"
                  >
                    Reset
                  </Button>
                </div>

                <div className="space-y-6">
                  {/* Bedrooms */}
                  <div className="space-y-2">
                    <Label>Bedrooms</Label>
                    <Select value={filters.bedrooms} onValueChange={(val) => setFilters({ ...filters, bedrooms: val })}>
                      <SelectTrigger className="bg-input-background">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="1">1 Bedroom</SelectItem>
                        <SelectItem value="2">2 Bedrooms</SelectItem>
                        <SelectItem value="3">3 Bedrooms</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Floor */}
                  <div className="space-y-2">
                    <Label>Floor</Label>
                    <Select value={filters.floor} onValueChange={(val) => setFilters({ ...filters, floor: val })}>
                      <SelectTrigger className="bg-input-background">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Floors</SelectItem>
                        <SelectItem value="1">Floor 1</SelectItem>
                        <SelectItem value="2">Floor 2</SelectItem>
                        <SelectItem value="3">Floor 3</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Orientation */}
                  <div className="space-y-2">
                    <Label>Orientation</Label>
                    <Select value={filters.orientation} onValueChange={(val) => setFilters({ ...filters, orientation: val })}>
                      <SelectTrigger className="bg-input-background">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="north">North</SelectItem>
                        <SelectItem value="south">South</SelectItem>
                        <SelectItem value="east">East</SelectItem>
                        <SelectItem value="west">West</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Status */}
                  <div className="space-y-2">
                    <Label>Availability</Label>
                    <Select value={filters.status} onValueChange={(val) => setFilters({ ...filters, status: val })}>
                      <SelectTrigger className="bg-input-background">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="available">Available</SelectItem>
                        <SelectItem value="reserved">Reserved</SelectItem>
                        <SelectItem value="sold">Sold</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>

            {/* Results Grid */}
            <div className="lg:col-span-3">
              <div className="mb-6">
                <p className="text-muted-foreground">
                  Showing <span className="font-semibold text-primary">{filteredApartments.length}</span> of{' '}
                  <span className="font-semibold text-primary">{apartments.length}</span> apartments
                </p>
              </div>

              {filteredApartments.length === 0 ? (
                <div className="bg-white rounded-xl border border-border p-12 text-center">
                  <X className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-primary mb-2">No apartments found</h3>
                  <p className="text-muted-foreground mb-4">
                    Try adjusting your filters to see more results
                  </p>
                  <Button onClick={resetFilters} variant="outline">
                    Reset Filters
                  </Button>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-6">
                  {filteredApartments.map((apartment, index) => (
                    <motion.div
                      key={apartment.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                    >
                      <ApartmentCard apartment={apartment} />
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
