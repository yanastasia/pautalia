import { Link } from "react-router";
import { Navigation } from "../components/Navigation";
import { Footer } from "../components/Footer";
import { ArrowRight, Building2, MapPin, Maximize2 } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { motion } from "motion/react";

export function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1667375721269-448f78e68022?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjByZXNpZGVudGlhbCUyMGJ1aWxkaW5nJTIwYXJjaGl0ZWN0dXJlfGVufDF8fHx8MTc3MjQ0MzU2Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt="Residence Kyustendil"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60" />
        </div>
        
        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight tracking-tight">
              Your New Home
              <br />
              Begins Here
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-2xl mx-auto font-light">
              Modern living spaces in the heart of Kyustendil. Quality, comfort, and trust.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/apartments"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-primary rounded-lg hover:bg-white/90 transition-all shadow-lg group"
              >
                Explore Apartments
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/building"
                className="inline-flex items-center justify-center px-8 py-4 bg-white/10 text-white border-2 border-white/50 rounded-lg hover:bg-white/20 transition-all backdrop-blur-sm"
              >
                Discover the Project
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* The Vision */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1738168279272-c08d6dd22002?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBhcGFydG1lbnQlMjBpbnRlcmlvciUyMGxpdmluZyUyMHJvb218ZW58MXx8fHwxNzcyMzU2MDczfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Modern living space"
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-primary leading-tight">
                A Vision of
                <br />
                Modern Living
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Residence Kyustendil represents a new standard in residential development. 
                Every detail has been carefully considered to create homes that blend contemporary 
                design with the warmth and character of quality craftsmanship.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Natural light floods through large windows. Premium materials create a sense of 
                permanence and quality. Thoughtful layouts maximize every square meter.
              </p>
              <div className="pt-4">
                <Link
                  to="/building"
                  className="inline-flex items-center text-accent hover:text-accent/80 transition-colors group"
                >
                  Learn more about the building
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why This Location */}
      <section className="py-24 px-6 bg-secondary">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6">
              Why Kyustendil?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A small city with big advantages. Nature, infrastructure, and community come together.
            </p>
          </div>

          {/* Location Image */}
          <div className="aspect-[21/9] rounded-2xl overflow-hidden shadow-2xl mb-12">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1676967790580-fb06f6ca9d0e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3VudGFpbiUyMGxhbmRzY2FwZSUyMGJ1bGdhcmlhJTIwbmF0dXJlfGVufDF8fHx8MTc3MjQ0MzgxOHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              alt="Kyustendil mountain landscape"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="w-14 h-14 bg-accent/10 rounded-xl flex items-center justify-center mb-6">
                <MapPin className="w-7 h-7 text-accent" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-primary">Walkable & Central</h3>
              <p className="text-muted-foreground leading-relaxed">
                Everything you need within walking distance. Schools, parks, shopping, 
                and healthcare all nearby. True neighborhood living.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="w-14 h-14 bg-accent/10 rounded-xl flex items-center justify-center mb-6">
                <Building2 className="w-7 h-7 text-accent" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-primary">Growing Infrastructure</h3>
              <p className="text-muted-foreground leading-relaxed">
                Kyustendil is developing rapidly with modern amenities while maintaining 
                its charm and character. The perfect balance.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="w-14 h-14 bg-accent/10 rounded-xl flex items-center justify-center mb-6">
                <Maximize2 className="w-7 h-7 text-accent" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-primary">Nature at Your Door</h3>
              <p className="text-muted-foreground leading-relaxed">
                Surrounded by mountains and mineral springs. Fresh air, hiking trails, 
                and natural beauty create a healthy living environment.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Building Overview Snapshot */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6">
            The Building
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-16">
            24 thoughtfully designed apartments across 3 floors. Premium construction, 
            modern amenities, delivery in Q4 2027.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
            <div className="space-y-2">
              <div className="text-5xl font-bold text-accent">24</div>
              <div className="text-muted-foreground">Apartments</div>
            </div>
            <div className="space-y-2">
              <div className="text-5xl font-bold text-accent">3</div>
              <div className="text-muted-foreground">Floors</div>
            </div>
            <div className="space-y-2">
              <div className="text-5xl font-bold text-accent">24</div>
              <div className="text-muted-foreground">Parking Spaces</div>
            </div>
            <div className="space-y-2">
              <div className="text-5xl font-bold text-accent">A</div>
              <div className="text-muted-foreground">Energy Class</div>
            </div>
          </div>

          <Link
            to="/apartments"
            className="inline-flex items-center justify-center px-8 py-4 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-all shadow-sm"
          >
            View Available Apartments
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Experience Before It's Built */}
      <section className="py-24 px-6 bg-primary text-primary-foreground">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <h2 className="text-4xl md:text-5xl font-bold leading-tight">
                Experience Your Home
                <br />
                Before It's Built
              </h2>
              <p className="text-lg text-primary-foreground/80 leading-relaxed">
                Walk through your future apartment in stunning 360° detail. 
                See the space, feel the layout, make confident decisions.
              </p>
              <p className="text-lg text-primary-foreground/80 leading-relaxed">
                Our digital twin technology lets you explore every room, 
                understand the flow, and visualize your new life.
              </p>
              <div className="pt-4">
                <Link
                  to="/apartments"
                  className="inline-flex items-center justify-center px-8 py-4 bg-white text-primary rounded-lg hover:bg-white/90 transition-all shadow-lg group"
                >
                  Explore in 3D
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1638454668466-e8dbd5462f20?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBhcGFydG1lbnQlMjBiZWRyb29tJTIwbWluaW1hbHxlbnwxfHx8fDE3NzI0MzA4OTB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="3D apartment visualization"
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}