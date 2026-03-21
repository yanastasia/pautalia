import { Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-10 h-10 bg-primary-foreground/10 rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-xl">R</span>
              </div>
              <div>
                <div className="font-bold text-lg">Residence</div>
                <div className="text-sm text-primary-foreground/70 -mt-1">Kyustendil</div>
              </div>
            </div>
            <p className="text-sm text-primary-foreground/70 leading-relaxed">
              A premium residential development in the heart of Kyustendil, Bulgaria. 
              Quality living spaces designed for modern families.
            </p>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4">Contact</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 mt-0.5 text-primary-foreground/70" />
                <span className="text-primary-foreground/70">Kyustendil, Bulgaria</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-primary-foreground/70" />
                <span className="text-primary-foreground/70">+359 XX XXX XXXX</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-primary-foreground/70" />
                <span className="text-primary-foreground/70">info@residence-kyustendil.bg</span>
              </div>
            </div>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold mb-4">Information</h3>
            <div className="space-y-2 text-sm">
              <a href="#" className="block text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="block text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                Terms & Conditions
              </a>
              <a href="#" className="block text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                Legal Disclaimer
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-primary-foreground/10 text-center text-sm text-primary-foreground/50">
          <p>© 2026 Residence Kyustendil. All rights reserved.</p>
          <p className="mt-2 text-xs">
            All visualizations and renderings are illustrative and may differ from the final construction.
          </p>
        </div>
      </div>
    </footer>
  );
}
