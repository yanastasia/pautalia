import { useState } from "react";
import { useParams, Link } from "react-router";
import { apartments } from "../data/apartments";
import { ArrowLeft, Home, X, MapPin, Eye, Phone } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { Button } from "../components/ui/button";
import { LeadModal } from "../components/LeadModal";
import { motion } from "motion/react";

export function DigitalTwinPage() {
  const { id } = useParams();
  const apartment = apartments.find((apt) => apt.id === id);
  const [currentRoom, setCurrentRoom] = useState("living");
  const [showFloorplan, setShowFloorplan] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  if (!apartment) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Apartment Not Found</h1>
          <Link to="/apartments" className="text-accent hover:text-accent/80">
            ← Back to Apartments
          </Link>
        </div>
      </div>
    );
  }

  const rooms = [
    { id: "living", name: "Living Room", image: "https://images.unsplash.com/photo-1738168279272-c08d6dd22002?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBhcGFydG1lbnQlMjBpbnRlcmlvciUyMGxpdmluZyUyMHJvb218ZW58MXx8fHwxNzcyMzU2MDczfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" },
    { id: "kitchen", name: "Kitchen", image: "https://images.unsplash.com/photo-1771372343841-d7d1b58391a0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb250ZW1wb3JhcnklMjBraXRjaGVuJTIwZGVzaWduJTIwd2hpdGV8ZW58MXx8fHwxNzcyNDQzNTYxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" },
    { id: "bedroom", name: "Bedroom", image: "https://images.unsplash.com/photo-1638454668466-e8dbd5462f20?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBhcGFydG1lbnQlMjBiZWRyb29tJTIwbWluaW1hbHxlbnwxfHx8fDE3NzI0MzA4OTB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" },
    { id: "bathroom", name: "Bathroom", image: "https://images.unsplash.com/photo-1756079664354-34944e001f6d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBiYXRocm9vbSUyMGludGVyaW9yJTIwbWFyYmxlfGVufDF8fHx8MTc3MjQ0MzU2M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" },
  ];

  const currentRoomData = rooms.find(r => r.id === currentRoom) || rooms[0];

  return (
    <div className="h-screen flex flex-col bg-black">
      {/* Top Navigation Bar */}
      <div className="bg-black/90 backdrop-blur-sm border-b border-white/10 px-6 py-4 z-50">
        <div className="max-w-screen-2xl mx-auto flex items-center justify-between">
          <Link
            to={`/apartment/${apartment.id}`}
            className="flex items-center space-x-2 text-white/80 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="hidden sm:inline">Back to Details</span>
          </Link>

          <div className="text-center">
            <div className="text-white font-semibold text-lg">Unit {apartment.code}</div>
            <div className="text-white/60 text-sm hidden sm:block">360° Virtual Tour</div>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              onClick={() => setModalOpen(true)}
              size="sm"
              className="bg-accent hover:bg-accent/90 text-accent-foreground hidden sm:flex"
            >
              <Phone className="w-4 h-4 mr-2" />
              Contact
            </Button>
            <Button
              onClick={() => setModalOpen(true)}
              size="sm"
              className="bg-accent hover:bg-accent/90 text-accent-foreground sm:hidden"
            >
              <Phone className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Viewer Area */}
      <div className="flex-1 relative">
        {/* 360° Image Viewer */}
        <div className="absolute inset-0">
          <motion.div
            key={currentRoom}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="w-full h-full"
          >
            <ImageWithFallback
              src={currentRoomData.image}
              alt={currentRoomData.name}
              className="w-full h-full object-cover"
            />
            {/* Overlay gradient for better text visibility */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40 pointer-events-none" />
          </motion.div>
        </div>

        {/* Room Label */}
        <div className="absolute top-8 left-1/2 -translate-x-1/2 z-10">
          <div className="bg-black/70 backdrop-blur-md text-white px-6 py-3 rounded-full border border-white/20">
            <div className="flex items-center space-x-2">
              <Eye className="w-4 h-4" />
              <span className="font-medium">{currentRoomData.name}</span>
            </div>
          </div>
        </div>

        {/* Desktop Room Navigation - Left Side */}
        <div className="hidden md:block absolute left-8 top-1/2 -translate-y-1/2 z-10">
          <div className="bg-black/70 backdrop-blur-md rounded-2xl border border-white/20 p-4 space-y-3">
            <div className="text-white/60 text-xs uppercase tracking-wider mb-2 px-2">Rooms</div>
            {rooms.map((room) => (
              <button
                key={room.id}
                onClick={() => setCurrentRoom(room.id)}
                className={`w-full px-4 py-3 rounded-xl transition-all ${
                  currentRoom === room.id
                    ? 'bg-accent text-accent-foreground'
                    : 'text-white/80 hover:bg-white/10 hover:text-white'
                }`}
              >
                {room.name}
              </button>
            ))}
          </div>
        </div>

        {/* Floor Plan Toggle */}
        <div className="absolute right-8 bottom-8 z-10 hidden md:block">
          <Button
            onClick={() => setShowFloorplan(!showFloorplan)}
            className="bg-black/70 backdrop-blur-md text-white border border-white/20 hover:bg-white/10"
          >
            <MapPin className="w-4 h-4 mr-2" />
            {showFloorplan ? 'Hide' : 'Show'} Floor Plan
          </Button>
        </div>

        {/* Floor Plan Overlay */}
        {showFloorplan && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute bottom-24 right-8 z-20 hidden md:block"
          >
            <div className="bg-black/90 backdrop-blur-md rounded-xl border border-white/20 p-4 w-80">
              <div className="flex items-center justify-between mb-3">
                <span className="text-white font-medium">Floor Plan</span>
                <button onClick={() => setShowFloorplan(false)} className="text-white/60 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="aspect-video rounded-lg overflow-hidden">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1721244654195-943615c56ac4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcmNoaXRlY3R1cmFsJTIwZmxvb3IlMjBwbGFuJTIwYmx1ZXByaW50fGVufDF8fHx8MTc3MjQ0MTkxN3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Floor plan"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </motion.div>
        )}

        {/* Disclaimer */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
          <div className="bg-black/50 backdrop-blur-sm text-white/60 text-xs px-4 py-2 rounded-full border border-white/10">
            Visualizations are illustrative
          </div>
        </div>
      </div>

      {/* Mobile Room Navigation - Bottom */}
      <div className="md:hidden bg-black/90 backdrop-blur-sm border-t border-white/10 p-4 z-50">
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {rooms.map((room) => (
            <button
              key={room.id}
              onClick={() => setCurrentRoom(room.id)}
              className={`flex-shrink-0 px-6 py-3 rounded-lg transition-all whitespace-nowrap ${
                currentRoom === room.id
                  ? 'bg-accent text-accent-foreground'
                  : 'bg-white/10 text-white/80 hover:bg-white/20'
              }`}
            >
              {room.name}
            </button>
          ))}
        </div>
      </div>

      {/* Persistent CTA - Mobile */}
      <div className="md:hidden fixed bottom-20 left-0 right-0 px-4 z-40">
        <Button
          onClick={() => setModalOpen(true)}
          className="w-full bg-accent hover:bg-accent/90 text-accent-foreground shadow-2xl"
        >
          <Phone className="w-4 h-4 mr-2" />
          Request Information
        </Button>
      </div>

      <LeadModal open={modalOpen} onOpenChange={setModalOpen} apartmentCode={apartment.code} />
    </div>
  );
}
