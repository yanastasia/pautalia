import { useState } from "react";
import { useParams, Link } from "react-router";
import { Navigation } from "../components/Navigation";
import { Footer } from "../components/Footer";
import { LeadModal } from "../components/LeadModal";
import { apartments } from "../data/apartments";
import { ArrowLeft, Download, Maximize2, CheckCircle2, Eye } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { motion } from "motion/react";

export function UnitDetailPage() {
  const { id } = useParams();
  const [modalOpen, setModalOpen] = useState(false);
  const apartment = apartments.find((apt) => apt.id === id);

  if (!apartment) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-primary mb-4">Apartment Not Found</h1>
            <Link to="/apartments" className="text-accent hover:text-accent/80">
              ← Back to Apartments
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

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
    <div className="min-h-screen flex flex-col">
      <Navigation />

      {/* Breadcrumb */}
      <div className="bg-secondary py-4 px-6 border-b border-border">
        <div className="max-w-7xl mx-auto">
          <Link
            to="/apartments"
            className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Apartments
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <section className="py-12 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-8">
              <div>
                <h1 className="text-5xl font-bold text-primary mb-4">Unit {apartment.code}</h1>
                <p className="text-xl text-muted-foreground">{apartment.orientation} Facing • Floor {apartment.floor}</p>
              </div>
              <Badge className={`${statusColors[apartment.status]} border text-lg px-4 py-2 mt-4 md:mt-0`}>
                {statusLabels[apartment.status]}
              </Badge>
            </div>

            {/* Quick Facts Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
              <div className="bg-secondary p-6 rounded-xl">
                <div className="text-sm text-muted-foreground mb-1">Bedrooms</div>
                <div className="text-3xl font-bold text-accent">{apartment.bedrooms}</div>
              </div>
              <div className="bg-secondary p-6 rounded-xl">
                <div className="text-sm text-muted-foreground mb-1">Area</div>
                <div className="text-3xl font-bold text-accent">{apartment.area} m²</div>
              </div>
              <div className="bg-secondary p-6 rounded-xl">
                <div className="text-sm text-muted-foreground mb-1">Floor</div>
                <div className="text-3xl font-bold text-accent">{apartment.floor}</div>
              </div>
              <div className="bg-secondary p-6 rounded-xl">
                <div className="text-sm text-muted-foreground mb-1">Price</div>
                <div className="text-3xl font-bold text-accent">
                  {apartment.status === 'sold' ? '—' : `€${apartment.price.toLocaleString()}`}
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            {apartment.status !== 'sold' && (
              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <Link
                  to={`/digital-twin/${apartment.id}`}
                  className="flex-1 flex items-center justify-center px-8 py-4 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-all shadow-sm group"
                >
                  <Eye className="w-5 h-5 mr-2" />
                  Explore in 3D
                </Link>
                <Button
                  onClick={() => setModalOpen(true)}
                  className="flex-1 px-8 py-4 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all shadow-sm"
                >
                  Request Information
                </Button>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Description */}
      <section className="py-12 px-6 bg-secondary">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold text-primary mb-6">About This Apartment</h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                {apartment.description}
              </p>
              
              <div className="space-y-3">
                {apartment.features.map((feature, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                    <span className="text-primary">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white p-8 rounded-xl border border-border">
                <h3 className="text-xl font-semibold text-primary mb-4">Apartment Details</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Unit Code</span>
                    <span className="font-semibold text-primary">{apartment.code}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Bedrooms</span>
                    <span className="font-semibold text-primary">{apartment.bedrooms}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Total Area</span>
                    <span className="font-semibold text-primary">{apartment.area} m²</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Floor</span>
                    <span className="font-semibold text-primary">{apartment.floor}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Orientation</span>
                    <span className="font-semibold text-primary">{apartment.orientation}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-muted-foreground">Status</span>
                    <span className="font-semibold text-primary capitalize">{apartment.status}</span>
                  </div>
                </div>
              </div>

              {apartment.status !== 'sold' && (
                <Button
                  onClick={() => setModalOpen(true)}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  Schedule a Viewing
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Floor Plan */}
      <section className="py-12 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-primary mb-4">Floor Plan</h2>
            <p className="text-muted-foreground">
              Detailed layout showing room dimensions and flow
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="aspect-video rounded-2xl overflow-hidden shadow-2xl mb-6 bg-secondary">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1721244654195-943615c56ac4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcmNoaXRlY3R1cmFsJTIwZmxvb3IlMjBwbGFuJTIwYmx1ZXByaW50fGVufDF8fHx8MTc3MjQ0MTkxN3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt={`Floor plan for unit ${apartment.code}`}
                className="w-full h-full object-cover"
              />
            </div>

            <Button variant="outline" className="w-full">
              <Download className="w-4 h-4 mr-2" />
              Download Floor Plan PDF
            </Button>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-12 px-6 bg-secondary">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-primary mb-8 text-center">
            Lifestyle Gallery
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="aspect-[4/3] rounded-xl overflow-hidden shadow-lg">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1771372343841-d7d1b58391a0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb250ZW1wb3JhcnklMjBraXRjaGVuJTIwZGVzaWduJTIwd2hpdGV8ZW58MXx8fHwxNzcyNDQzNTYxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Kitchen"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="aspect-[4/3] rounded-xl overflow-hidden shadow-lg">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1638454668466-e8dbd5462f20?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBhcGFydG1lbnQlMjBiZWRyb29tJTIwbWluaW1hbHxlbnwxfHx8fDE3NzI0MzA4OTB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Bedroom"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="aspect-[4/3] rounded-xl overflow-hidden shadow-lg">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1756079664354-34944e001f6d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBiYXRocm9vbSUyMGludGVyaW9yJTIwbWFyYmxlfGVufDF8fHx8MTc3MjQ0MzU2M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Bathroom"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
          </div>

          <p className="text-center text-sm text-muted-foreground mt-8">
            All images are illustrative and may differ from the final construction
          </p>
        </div>
      </section>

      <Footer />
      <LeadModal open={modalOpen} onOpenChange={setModalOpen} apartmentCode={apartment.code} />
    </div>
  );
}
