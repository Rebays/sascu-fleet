import Link from "next/link";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Info,
  HelpCircle,
  CheckCircle,
  Car,
  Shield,
  Headphones,
  DollarSign,
} from "lucide-react";
import Breadcrumb from "@/components/Breadcrumb";

export default function AboutPage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-muted/60 via-muted/40 to-background border-b">
        <div className="container mx-auto px-4 md:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              About SASCU
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Your trusted partner for quality vehicle rentals and exceptional
              service
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-4 md:px-8 py-12">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Breadcrumb items={[{ label: "About" }]} />
        </div>

        {/* Who We Are & Mission - Side by Side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
          <div className="bg-card border rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <Info className="h-5 w-5 text-primary" />
              <h2 className="text-2xl font-bold">Who We Are</h2>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              SASCU is a premier vehicle rental service dedicated to providing
              quality vehicles and exceptional customer service. With over 10
              years of experience in the industry, we have built a reputation
              for reliability, affordability, and customer satisfaction.
            </p>
          </div>

          <div className="bg-card border rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle className="h-5 w-5 text-primary" />
              <h2 className="text-2xl font-bold">Our Mission</h2>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Our mission is to make vehicle rental simple, affordable, and
              accessible to everyone. We strive to provide a diverse fleet of
              well-maintained vehicles that meet the needs of both individual
              and business customers.
            </p>
          </div>
        </div>

        {/* Why Choose Us - Grid Layout */}
        <div className="bg-card border rounded-lg p-8 mb-12">
          <div className="flex items-center gap-2 mb-6">
            <HelpCircle className="h-6 w-6 text-primary" />
            <h2 className="text-3xl font-bold">Why Choose SASCU?</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="flex items-start gap-3 p-4 bg-muted/20 rounded-lg border border-muted">
              <Car className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold mb-1">Wide Selection</h3>
                <p className="text-sm text-muted-foreground">
                  From economy to luxury vehicles
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-muted/20 rounded-lg border border-muted">
              <DollarSign className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold mb-1">Competitive Pricing</h3>
                <p className="text-sm text-muted-foreground">
                  No hidden fees guaranteed
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-muted/20 rounded-lg border border-muted">
              <Headphones className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold mb-1">24/7 Support</h3>
                <p className="text-sm text-muted-foreground">
                  Always here when you need us
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-muted/20 rounded-lg border border-muted">
              <Clock className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold mb-1">Flexible Rentals</h3>
                <p className="text-sm text-muted-foreground">
                  Hourly or daily rental options
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-muted/20 rounded-lg border border-muted">
              <MapPin className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold mb-1">Multiple Locations</h3>
                <p className="text-sm text-muted-foreground">
                  Convenient pickup and drop-off
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-muted/20 rounded-lg border border-muted">
              <Shield className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold mb-1">Well-Maintained</h3>
                <p className="text-sm text-muted-foreground">
                  Regular service and inspections
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Information - Improved Layout */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2">Get In Touch</h2>
            <p className="text-muted-foreground">
              We&apos;re here to help with all your rental needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-card border rounded-lg p-6">
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="h-5 w-5 text-primary" />
                <h3 className="font-bold">Main Office</h3>
              </div>
              <p className="text-sm text-muted-foreground">123 Fleet Street</p>
              <p className="text-sm text-muted-foreground">Downtown District</p>
              <p className="text-sm text-muted-foreground">City, State 12345</p>
            </div>

            <div className="bg-card border rounded-lg p-6">
              <div className="flex items-center gap-2 mb-3">
                <Phone className="h-5 w-5 text-primary" />
                <h3 className="font-bold">Phone</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-1">
                General: (555) 123-4567
              </p>
              <p className="text-sm text-muted-foreground mb-1">
                Bookings: (555) 123-4568
              </p>
              <p className="text-sm text-muted-foreground">
                Support: (555) 123-4569
              </p>
            </div>

            <div className="bg-card border rounded-lg p-6">
              <div className="flex items-center gap-2 mb-3">
                <Mail className="h-5 w-5 text-primary" />
                <h3 className="font-bold">Email</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-1">
                info@sascufleet.com
              </p>
              <p className="text-sm text-muted-foreground mb-1">
                bookings@sascufleet.com
              </p>
              <p className="text-sm text-muted-foreground">
                support@sascufleet.com
              </p>
            </div>

            <div className="bg-card border rounded-lg p-6">
              <div className="flex items-center gap-2 mb-3">
                <Clock className="h-5 w-5 text-primary" />
                <h3 className="font-bold">Hours</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-1">
                Mon-Fri: 8AM - 6PM
              </p>
              <p className="text-sm text-muted-foreground mb-1">
                Sat: 9AM - 5PM
              </p>
              <p className="text-sm text-muted-foreground">Sun: 10AM - 4PM</p>
            </div>
          </div>

          {/* Other Locations */}
          <div className="bg-card border rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="h-5 w-5 text-primary" />
              <h3 className="text-xl font-bold">Additional Locations</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-muted/40 border rounded-lg p-4">
                <h4 className="font-semibold mb-2">Airport Branch</h4>
                <p className="text-sm text-muted-foreground mb-1">
                  Terminal 2, Arrivals Hall
                </p>
                <p className="text-sm text-primary font-medium">Open 24/7</p>
              </div>
              <div className="bg-muted/40 border rounded-lg p-4">
                <h4 className="font-semibold mb-2">North Side Location</h4>
                <p className="text-sm text-muted-foreground mb-1">
                  456 North Avenue
                </p>
                <p className="text-sm text-muted-foreground">
                  Mon-Sat: 9AM - 6PM
                </p>
              </div>
              <div className="bg-muted/40 border rounded-lg p-4">
                <h4 className="font-semibold mb-2">South Side Location</h4>
                <p className="text-sm text-muted-foreground mb-1">
                  789 South Boulevard
                </p>
                <p className="text-sm text-muted-foreground">
                  Mon-Sat: 9AM - 6PM
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Frequently Asked Questions */}
        <div className="bg-card border rounded-lg p-8 mb-12">
          <div className="flex items-center gap-2 mb-6">
            <HelpCircle className="h-6 w-6 text-primary" />
            <h2 className="text-3xl font-bold">Frequently Asked Questions</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-muted/20 border rounded-lg p-4">
              <h4 className="font-semibold mb-2 flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                What do I need to rent a vehicle?
              </h4>
              <p className="text-sm text-muted-foreground ml-7">
                A valid driver license, credit/debit card, and proof of
                insurance.
              </p>
            </div>

            <div className="bg-muted/20 border rounded-lg p-4">
              <h4 className="font-semibold mb-2 flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                What is the minimum rental period?
              </h4>
              <p className="text-sm text-muted-foreground ml-7">
                Our minimum rental period is 24 hours (1 day).
              </p>
            </div>

            <div className="bg-muted/20 border rounded-lg p-4">
              <h4 className="font-semibold mb-2 flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                Can I return to a different location?
              </h4>
              <p className="text-sm text-muted-foreground ml-7">
                Yes, we offer one-way rentals. Additional fees may apply.
              </p>
            </div>

            <div className="bg-muted/20 border rounded-lg p-4">
              <h4 className="font-semibold mb-2 flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                What is your cancellation policy?
              </h4>
              <p className="text-sm text-muted-foreground ml-7">
                Free cancellation up to 24 hours before pickup.
              </p>
            </div>

            <div className="bg-muted/20 border rounded-lg p-4">
              <h4 className="font-semibold mb-2 flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                Do you offer insurance?
              </h4>
              <p className="text-sm text-muted-foreground ml-7">
                Yes, we offer comprehensive coverage or use your own.
              </p>
            </div>

            <div className="bg-muted/20 border rounded-lg p-4">
              <h4 className="font-semibold mb-2 flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                How do I track my booking?
              </h4>
              <p className="text-sm text-muted-foreground ml-7">
                Use your booking reference number on our tracking page.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-lg p-8">
          <h3 className="text-2xl font-bold mb-3">Ready to Get Started?</h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Browse our fleet and book your perfect vehicle today
          </p>
          <Link
            href="/vehicles"
            className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <Car className="h-4 w-4" />
            Browse Vehicles
          </Link>
        </div>
      </section>
    </div>
  );
}
