import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-4">About SASCU Fleet</h1>
      <Link href="/" className="underline mb-8 inline-block">Back to Home</Link>

      <div>
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-3">Who We Are</h2>
          <p>
            SASCU Fleet is a premier vehicle rental service dedicated to providing quality vehicles
            and exceptional customer service. With over 10 years of experience in the industry,
            we have built a reputation for reliability, affordability, and customer satisfaction.
          </p>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-3">Our Mission</h2>
          <p>
            Our mission is to make vehicle rental simple, affordable, and accessible to everyone.
            We strive to provide a diverse fleet of well-maintained vehicles that meet the needs
            of both individual and business customers.
          </p>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-3">Why Choose Us?</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>Wide selection of vehicles from economy to luxury</li>
            <li>Competitive pricing with no hidden fees</li>
            <li>24/7 customer support</li>
            <li>Flexible rental periods</li>
            <li>Multiple pickup and drop-off locations</li>
            <li>Well-maintained and regularly serviced vehicles</li>
            <li>Easy online booking process</li>
          </ul>
        </div>

        <div className="border p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6">Contact Information</h2>

          <div className="mb-6">
            <h3 className="text-xl font-bold mb-2">Main Office</h3>
            <p>123 Fleet Street</p>
            <p>Downtown District</p>
            <p>City, State 12345</p>
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-bold mb-2">Phone</h3>
            <p>General Inquiries: (555) 123-4567</p>
            <p>Bookings: (555) 123-4568</p>
            <p>Support: (555) 123-4569</p>
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-bold mb-2">Email</h3>
            <p>General: info@sascufleet.com</p>
            <p>Bookings: bookings@sascufleet.com</p>
            <p>Support: support@sascufleet.com</p>
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-bold mb-2">Business Hours</h3>
            <p>Monday - Friday: 8:00 AM - 6:00 PM</p>
            <p>Saturday: 9:00 AM - 5:00 PM</p>
            <p>Sunday: 10:00 AM - 4:00 PM</p>
            <p>Holidays: Closed (Emergency support available)</p>
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-bold mb-2">Other Locations</h3>
            <ul className="space-y-4">
              <li className="border p-4">
                <strong className="block mb-1">Airport Branch</strong>
                <p>Terminal 2, Arrivals Hall</p>
                <p>Open 24/7</p>
              </li>
              <li className="border p-4">
                <strong className="block mb-1">North Side Location</strong>
                <p>456 North Avenue</p>
                <p>Mon-Sat: 9:00 AM - 6:00 PM</p>
              </li>
              <li className="border p-4">
                <strong className="block mb-1">South Side Location</strong>
                <p>789 South Boulevard</p>
                <p>Mon-Sat: 9:00 AM - 6:00 PM</p>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-2">Get in Touch</h3>
            <p className="mb-1">Have questions or need assistance? We&apos;re here to help!</p>
            <p>You can reach us through any of the contact methods above, or visit us at one of our locations.</p>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>

          <div className="space-y-6">
            <div className="border p-4">
              <h4 className="font-bold mb-2">What do I need to rent a vehicle?</h4>
              <p>You need a valid driver license, a credit/debit card, and proof of insurance.</p>
            </div>

            <div className="border p-4">
              <h4 className="font-bold mb-2">What is the minimum rental period?</h4>
              <p>Our minimum rental period is 24 hours (1 day).</p>
            </div>

            <div className="border p-4">
              <h4 className="font-bold mb-2">Can I return the vehicle to a different location?</h4>
              <p>Yes, we offer one-way rentals. Additional fees may apply.</p>
            </div>

            <div className="border p-4">
              <h4 className="font-bold mb-2">What is your cancellation policy?</h4>
              <p>Free cancellation up to 24 hours before pickup. Cancellations within 24 hours may incur a fee.</p>
            </div>

            <div className="border p-4">
              <h4 className="font-bold mb-2">Do you offer insurance?</h4>
              <p>Yes, we offer comprehensive insurance coverage. You can also use your own insurance if it covers rental vehicles.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
