import { studentReadingImage } from "@/public/assetLinks";
import Image from "next/image";

const ContactAndNewsletter = () => {
  return (
    <section className="max-w-6xl mx-auto px-6 py-20 font-sans">
      <div className="bg-blue-600 rounded-[40px] p-8 md:p-16 flex flex-col md:flex-row items-center justify-between gap-12 mb-24">
        <div className="flex-1 text-white">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            Ready to make a change for the future?
          </h2>
          <p className="text-lg opacity-90 mb-8 max-w-md leading-relaxed">
            Fill the form to make enquiries or request a demo. A representative
            will respond promptly.
          </p>
          <button className="bg-[#00008B] hover:bg-black text-white px-8 py-4 rounded-2xl font-semibold transition-all">
            Contact Us
          </button>
        </div>

        <div className="flex-1 w-full max-w-md">
          <Image
            src={studentReadingImage}
            alt="Student working on tablet"
            width={100}
            height={150}
            className="rounded-3xl w-full h-100 object-cover shadow-2xl"
          />
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-8 border-t border-gray-100 pt-12">
        <div className="text-left w-full md:w-auto">
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Join our newsletter
          </h3>
          <p className="text-gray-500">
            We&apos;ll send you a nice letter once per week. No spam.
          </p>
        </div>

        <div className="flex w-full md:w-auto gap-3">
          <input
            type="email"
            placeholder="Enter your email"
            className="grow md:w-80 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors">
            Subscribe
          </button>
        </div>
      </div>
    </section>
  );
};

export default ContactAndNewsletter;
