import Link from "next/link";
import { MapPin, Phone, Mail, Clock, Info, HelpCircle } from "lucide-react";

export default function AboutPage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-muted/60 via-muted/40 to-background border-b">
        <div className="container mx-auto px-4 md:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              About SASCU Fleet
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Learn more about our company, mission, and services
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-4 md:px-8 py-12">
        {/* Who We Are */}
        <div className="bg-card border rounded-lg p-6 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Info className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-bold">Who We Are</h2>
          </div>
          <p className="text-muted-foreground">
            SASCU Fleet is a premier vehicle rental service dedicated to
            providing quality vehicles and exceptional customer service. With
            over 10 years of experience in the industry, we have built a
            reputation for reliability, affordability, and customer
            satisfaction.
          </p>
        </div>

        {/* Our Mission */}
        <div className="bg-card border rounded-lg p-6 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Info className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-bold">Our Mission</h2>
          </div>
          <p className="text-muted-foreground">
            Our mission is to make vehicle rental simple, affordable, and
            accessible to everyone. We strive to provide a diverse fleet of
            well-maintained vehicles that meet the needs of both individual and
            business customers.
          </p>
        </div>

        {/* Why Choose Us */}
        <div className="bg-card border rounded-lg p-6 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <HelpCircle className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-bold">Why Choose Us?</h2>
          </div>
          <ul className="space-y-2 text-muted-foreground">
            <li className="flex items-start gap-2">
              <div className="h-5 w-5 flex-shrink-0" />{" "}
              {/* Placeholder for alignment */}
              Wide selection of vehicles from economy to luxury
            </li>
            <li className="flex items-start gap-2">
              <div className="h-5 w-5 flex-shrink-0" />
              Competitive pricing with no hidden fees
            </li>
            <li className="flex items-start gap-2">
              <div className="h-5 w-5 flex-shrink-0" />
              24/7 customer support
            </li>
            <li className="flex items-start gap-2">
              <div className="h-5 w-5 flex-shrink-0" />
              Flexible rental periods
            </li>
            <li className="flex items-start gap-2">
              <div className="h-5 w-5 flex-shrink-0" />
              Multiple pickup and drop-off locations
            </li>
            <li className="flex items-start gap-2">
              <div className="h-5 w-5 flex-shrink-0" />
              Well-maintained and regularly serviced vehicles
            </li>
            <li className="flex items-start gap-2">
              <div className="h-5 w-5 flex-shrink-0" />
              Easy online booking process
            </li>
          </ul>
        </div>

        {/* Contact Information */}
        <div className="bg-card border rounded-lg p-6 mb-8">
          <div className="flex items-center gap-2 mb-6">
            <Phone className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-bold">Contact Information</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <h3 className="text-xl font-bold">Main Office</h3>
              </div>
              <p className="text-muted-foreground">123 Fleet Street</p>
              <p className="text-muted-foreground">Downtown District</p>
              <p className="text-muted-foreground">City, State 12345</p>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <h3 className="text-xl font-bold">Phone</h3>
              </div>
              <p className="text-muted-foreground">
                General Inquiries: (555) 123-4567
              </p>
              <p className="text-muted-foreground">Bookings: (555) 123-4568</p>
              <p className="text-muted-foreground">Support: (555) 123-4569</p>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <h3 className="text-xl font-bold">Email</h3>
              </div>
              <p className="text-muted-foreground">
                General: info@sascufleet.com
              </p>
              <p className="text-muted-foreground">
                Bookings: bookings@sascufleet.com
              </p>
              <p className="text-muted-foreground">
                Support: support@sascufleet.com
              </p>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <h3 className="text-xl font-bold">Business Hours</h3>
              </div>
              <p className="text-muted-foreground">
                Monday - Friday: 8:00 AM - 6:00 PM
              </p>
              <p className="text-muted-foreground">
                Saturday: 9:00 AM - 5:00 PM
              </p>
              <p className="text-muted-foreground">
                Sunday: 10:00 AM - 4:00 PM
              </p>
              <p className="text-muted-foreground">
                Holidays: Closed (Emergency support available)
              </p>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="h-5 w-5 text-primary" />
              <h3 className="text-xl font-bold">Other Locations</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-muted/40 border rounded-lg p-4">
                <strong className="block mb-1 font-semibold">
                  Airport Branch
                </strong>
                <p className="text-sm text-muted-foreground">
                  Terminal 2, Arrivals Hall
                </p>
                <p className="text-sm text-muted-foreground">Open 24/7</p>
              </div>
              <div className="bg-muted/40 border rounded-lg p-4">
                <strong className="block mb-1 font-semibold">
                  North Side Location
                </strong>
                <p className="text-sm text-muted-foreground">
                  456 North Avenue
                </p>
                <p className="text-sm text-muted-foreground">
                  Mon-Sat: 9:00 AM - 6:00 PM
                </p>
              </div>
              <div className="bg-muted/40 border rounded-lg p-4">
                <strong className="block mb-1 font-semibold">
                  South Side Location
                </strong>
                <p className="text-sm text-muted-foreground">
                  789 South Boulevard
                </p>
                <p className="text-sm text-muted-foreground">
                  Mon-Sat: 9:00 AM - 6:00 PM
                </p>
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <h3 className="text-xl font-bold">Get in Touch</h3>
            </div>
            <p className="text-muted-foreground mb-1">
              Have questions or need assistance? We&apos;re here to help!
            </p>
            <p className="text-muted-foreground">
              You can reach us through any of the contact methods above, or
              visit us at one of our locations.
            </p>
          </div>
        </div>

        {/* Frequently Asked Questions */}
        <div className="bg-card border rounded-lg p-6">
          <div className="flex items-center gap-2 mb-6">
            <HelpCircle className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-bold">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-4">
            <div className="bg-muted/40 border rounded-lg p-4">
              <h4 className="font-semibold mb-2">
                What do I need to rent a vehicle?
              </h4>
              <p className="text-muted-foreground">
                You need a valid driver license, a credit/debit card, and proof
                of insurance.
              </p>
            </div>

            <div className="bg-muted/40 border rounded-lg p-4">
              <h4 className="font-semibold mb-2">
                What is the minimum rental period?
              </h4>
              <p className="text-muted-foreground">
                Our minimum rental period is 24 hours (1 day).
              </p>
            </div>

            <div className="bg-muted/40 border rounded-lg p-4">
              <h4 className="font-semibold mb-2">
                Can I return the vehicle to a different location?
              </h4>
              <p className="text-muted-foreground">
                Yes, we offer one-way rentals. Additional fees may apply.
              </p>
            </div>

            <div className="bg-muted/40 border rounded-lg p-4">
              <h4 className="font-semibold mb-2">
                What is your cancellation policy?
              </h4>
              <p className="text-muted-foreground">
                Free cancellation up to 24 hours before pickup. Cancellations
                within 24 hours may incur a fee.
              </p>
            </div>

            <div className="bg-muted/40 border rounded-lg p-4">
              <h4 className="font-semibold mb-2">Do you offer insurance?</h4>
              <p className="text-muted-foreground">
                Yes, we offer comprehensive insurance coverage. You can also use
                your own insurance if it covers rental vehicles.
              </p>
            </div>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-12">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Back to Home
          </Link>
        </div>
      </section>
    </div>
  );
}
