import { Navigation } from "../components/Navigation";
import { Footer } from "../components/Footer";
import { buildingInfo } from "../data/apartments";
import { CheckCircle2, Calendar, Shield, Zap, Building2 } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { Link } from "react-router";
import { motion } from "motion/react";

export function BuildingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      {/* Hero Header */}
      <section className="relative h-[60vh] flex items-end overflow-hidden">
        <div className="absolute inset-0 z-0">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1771337744364-e7dd00c2921c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXNpZGVudGlhbCUyMGJ1aWxkaW5nJTIwZXh0ZXJpb3IlMjBmYWNhZGV8ZW58MXx8fHwxNzcyNDQzNTYxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt="Building exterior"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        </div>
        
        <div className="relative z-10 w-full px-6 pb-16 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 leading-tight">
              {buildingInfo.name}
            </h1>
            <p className="text-xl text-white/90 max-w-2xl">
              Premium residential construction with modern design and superior quality standards
            </p>
          </motion.div>
        </div>
      </section>

      {/* Key Stats */}
      <section className="py-16 px-6 bg-white border-b border-border">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-accent mb-2">{buildingInfo.totalUnits}</div>
              <div className="text-sm text-muted-foreground">Total Units</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-accent mb-2">{buildingInfo.floors}</div>
              <div className="text-sm text-muted-foreground">Floors</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-accent mb-2">{buildingInfo.parkingSpaces}</div>
              <div className="text-sm text-muted-foreground">Parking</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-accent mb-2">{buildingInfo.energyClass}</div>
              <div className="text-sm text-muted-foreground">Energy Class</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-accent mb-2">{buildingInfo.deliveryDate}</div>
              <div className="text-sm text-muted-foreground">Delivery</div>
            </div>
          </div>
        </div>
      </section>

      {/* Construction Quality */}
      <section className="py-24 px-6 bg-secondary">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-primary leading-tight">
                Built to Last
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                We believe in doing things right. {buildingInfo.name} is constructed using 
                {' '}{buildingInfo.constructionType.toLowerCase()} and premium materials selected 
                for durability and performance.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Every structural element meets the highest European standards. Our commitment 
                to quality means your investment is protected for generations.
              </p>
              
              <div className="space-y-4 pt-4">
                <div className="flex items-start space-x-3">
                  <Shield className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                  <div>
                    <div className="font-semibold text-primary mb-1">Structural Integrity</div>
                    <div className="text-muted-foreground">
                      {buildingInfo.constructionType} construction with seismic resistance
                    </div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Zap className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                  <div>
                    <div className="font-semibold text-primary mb-1">Energy Efficiency</div>
                    <div className="text-muted-foreground">
                      Class {buildingInfo.energyClass} rating with advanced insulation systems
                    </div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Calendar className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                  <div>
                    <div className="font-semibold text-primary mb-1">On-Time Delivery</div>
                    <div className="text-muted-foreground">
                      Committed completion date: {buildingInfo.deliveryDate}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1771372343841-d7d1b58391a0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb250ZW1wb3JhcnklMjBraXRjaGVuJTIwZGVzaWduJTIwd2hpdGV8ZW58MXx8fHwxNzcyNDQzNTYxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Premium construction"
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Building Features */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6">
              Building Features
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Modern amenities designed for comfort, security, and convenience
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {buildingInfo.features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="flex items-start space-x-4 p-6 bg-secondary rounded-xl"
              >
                <CheckCircle2 className="w-6 h-6 text-accent flex-shrink-0 mt-0.5" />
                <span className="text-lg text-primary">{feature}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Floor Overview */}
      <section className="py-24 px-6 bg-secondary">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6">
            Floor Overview
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-16">
            Three residential floors with 8 apartments per level, designed for optimal 
            natural light and privacy
          </p>

          <div className="aspect-video rounded-2xl overflow-hidden shadow-2xl mb-12 bg-white">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1721244654195-943615c56ac4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcmNoaXRlY3R1cmFsJTIwZmxvb3IlMjBwbGFuJTIwYmx1ZXByaW50fGVufDF8fHx8MTc3MjQ0MTkxN3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              alt="Floor plan overview"
              className="w-full h-full object-cover"
            />
          </div>

          <Link
            to="/apartments"
            className="inline-flex items-center justify-center px-8 py-4 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-all shadow-sm"
          >
            <Building2 className="w-5 h-5 mr-2" />
            View Available Apartments
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
