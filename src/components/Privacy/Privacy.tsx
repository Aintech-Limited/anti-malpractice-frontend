import { APP_NAME } from "@/src/lib/data";

export default function PrivacyPolicy() {
  const sections = [
    { id: "collection", name: "1. Personal Data Collection & Use" },
    { id: "types-of-data", name: "   1.1 Types of Data Collected" },
    { id: "use-of-data", name: "   1.2 Use of Data" },
    { id: "gdpr", name: "   1.3 Legal Basis Under GDPR" },
    { id: "sharing", name: "2. Sharing Personal Data" },
    { id: "law-enforcement", name: "   2.1 Disclosure for Law Enforcement" },
    { id: "third-parties", name: "   2.2 Third Party Service Providers" },
    { id: "cookies", name: "3. Cookies & Tracking" },
    { id: "retention", name: "4. Data Retention" },
    { id: "rights", name: "5. Your Rights" },
  ];

  return (
    <div className="bg-slate-900 dark:bg-white min-h-screen text-slate-100 dark:text-slate-200 py-12 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-6xl mx-auto">
        <header className="mb-12 border-b border-slate-200 dark:border-slate-800 pb-8">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-100 dark:text-black">
            Privacy Policy
          </h1>
          <p className="mt-4 text-sm text-slate-500 dark:text-slate-900 font-medium">
            Effective date:{" "}
            <span className="text-slate-900 dark:text-slate-700">
              April 27th, 2026
            </span>
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          <aside className="hidden lg:block lg:col-span-1">
            <nav className="sticky top-8 space-y-1 p-4 bg-white dark:bg-gray-100 rounded-xl border border-slate-200/80 dark:border-slate-300 shadow-sm">
              <h2 className="text-xs font-semibold text-slate-900 dark:text-slate-900 uppercase tracking-wider mb-3 px-2">
                Table of Contents
              </h2>
              {sections.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className="block text-xs text-slate-600 dark:text-slate-800 hover:text-indigo-600 dark:hover:text-indigo-400 py-1.5 px-2 rounded-md transition-colors whitespace-pre"
                >
                  {section.name}
                </a>
              ))}
            </nav>
          </aside>

          <main className="lg:col-span-3 space-y-10 text-slate-600 dark:text-slate-300 leading-relaxed">
            <section className="bg-white dark:bg-white-800/40 p-6 sm:p-8 rounded-2xl border border-gray-100 dark:border-gray-100 shadow-sm space-y-4">
              <p className="text-slate-900 dark:text-slate-800">
                <strong className="text-slate-900 dark:text-slate-800">
                  {APP_NAME}
                </strong>{" "}
                (“us”, “we”, or “our”) operates the Aintech website (the
                “Service”).
              </p>
              <p className="text-slate-900 dark:text-slate-800">
                This page informs you of our policies regarding the collection,
                use, and disclosure of personal data when you use our Service
                and the choices you have associated with that data.
              </p>
              <p className="text-slate-900 dark:text-slate-800">
                We use your data to provide and improve the Service. By using
                the Service, you agree to the collection and use of information
                in accordance with this policy.
              </p>
            </section>

            <section id="collection" className="scroll-mt-8 space-y-6">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-2">
                1. Personal Data Collection and Use
              </h2>

              <div id="types-of-data" className="scroll-mt-8 space-y-4 ">
                <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-900">
                  1.1 Types of Data Collected
                </h3>

                <div className=" bg-white dark:bg-white-800/40 p-6 sm:p-8 rounded-2xl border border-gray-100 dark:border-gray-100 shadow-sm space-y-4">
                  <h4 className="font-semibold text-slate-900 dark:text-slate-900">
                    Personal Data
                  </h4>
                  <p className="text-slate-900 dark:text-slate-800">
                    While using our Service, we may ask you to provide us with
                    certain personally identifiable information that can be used
                    to contact or identify you (“Personal Data”). Personally
                    identifiable information may include, but is not limited to:
                  </p>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 text-sm">
                    <li className="flex items-center gap-2 dark:text-slate-500">
                      <span className="h-1.5 w-1.5 rounded-full bg-indigo-500"></span>
                      Email address
                    </li>
                    <li className="flex items-center gap-2 dark:text-slate-500">
                      <span className="h-1.5 w-1.5 rounded-full bg-indigo-500"></span>
                      First name and last name
                    </li>
                    <li className="flex items-center gap-2 dark:text-slate-500">
                      <span className="h-1.5 w-1.5 rounded-full bg-indigo-500"></span>
                      Phone number
                    </li>
                    <li className="flex items-center gap-2 dark:text-slate-500">
                      <span className="h-1.5 w-1.5 rounded-full bg-indigo-500"></span>
                      Cookies and Usage Data
                    </li>
                  </ul>
                </div>

                <div className="bg-white dark:bg-white-800/40 p-6 sm:p-8 rounded-2xl border border-gray-100 dark:border-gray-100 shadow-sm space-y-4">
                  <h4 className="font-semibold text-slate-900 dark:text-slate-900">
                    Usage Data
                  </h4>
                  <p className="text-slate-900 dark:text-slate-800">
                    We may also collect information on how the Service is
                    accessed and used (“Usage Data”). This Usage Data may
                    include information such as your computer’s Internet
                    Protocol address (e.g. IP address), browser type, browser
                    version, the pages of our Service that you visit, the time
                    and date of your visit, the time spent on those pages,
                    unique device identifiers, and other diagnostic data.
                  </p>
                </div>
              </div>

              <div id="use-of-data" className="scroll-mt-8 space-y-4">
                <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-900">
                  1.2 Use of Data
                </h3>
                <p className="dark:text-slate-800">
                  {APP_NAME} uses the collected data for various purposes:
                </p>
                <ul className="space-y-2 list-disc list-inside bg-white  p-6 rounded-xl bg-white dark:bg-white-800/40 p-6 sm:p-8 rounded-2xl border border-gray-100 dark:border-gray-100 shadow-sm space-y-4">
                  <li className="dark:text-slate-800">
                    To provide and maintain the Service
                  </li>
                  <li className="dark:text-slate-800">
                    To notify you about changes to our Service
                  </li>
                  <li className="dark:text-slate-800">
                    To allow you to participate in interactive features of our
                    Service when you choose to do so
                  </li>
                  <li className="dark:text-slate-800">
                    To provide customer care and support
                  </li>
                  <li className="dark:text-slate-800">
                    To provide analysis or valuable information so that we can
                    improve the Service
                  </li>
                  <li className="dark:text-slate-800">
                    To monitor the usage of the Service
                  </li>
                  <li className="dark:text-slate-800">
                    To detect, prevent and address technical issues
                  </li>
                </ul>
              </div>

              <div id="gdpr" className="scroll-mt-8 space-y-4">
                <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-900">
                  1.3 Legal Basis for Processing Personal Data under GDPR
                </h3>
                <p className="dark:text-slate-800">
                  If you are from the European Economic Area (EEA), Aintech
                  Limited&apos;s legal basis for collecting and using the
                  personal information described in this Privacy Policy depends
                  on the Personal Data we collect and the specific context in
                  which we collect it.
                </p>
                <p className="dark:text-slate-900">
                  {APP_NAME} may process your Personal Data because:
                </p>
                <ul className="space-y-2 list-disc list-inside  p-6 rounded-xl   bg-white dark:bg-white-800/40 p-6 sm:p-8 rounded-2xl border border-gray-100 dark:border-gray-100 shadow-sm space-y-4">
                  <li className="text-slate-800">
                    We need to perform a contract with you
                  </li>
                  <li className="text-slate-800">
                    You have given us permission to do so
                  </li>
                  <li className="text-slate-800">
                    The processing is in our legitimate interests and it’s not
                    overridden by your rights
                  </li>
                  <li className="text-slate-800">To comply with the law</li>
                </ul>
              </div>
            </section>

            <section id="sharing" className="scroll-mt-8 space-y-6">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-900 border-b border-slate-200 dark:border-slate-800 pb-2">
                2. Sharing Personal Data
              </h2>

              <div id="law-enforcement" className="scroll-mt-8 space-y-3">
                <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-800">
                  2.1 Disclosure for Law Enforcement
                </h3>
                <p className="text-slate-800">
                  Under certain circumstances, {APP_NAME} may be required to
                  disclose your Personal Data if required to do so by law or in
                  response to valid requests by public authorities (e.g. a court
                  or a government agency).
                </p>
              </div>

              <div id="third-parties" className="scroll-mt-8 space-y-3">
                <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-900">
                  2.2 Third Party Service Providers
                </h3>
                <p className="text-slate-800">
                  We may employ third party companies and individuals to
                  facilitate our Service (“Service Providers”), to provide the
                  Service on our behalf, to perform Service-related services or
                  to assist us in analyzing how our Service is used.
                </p>
                <p className="text-slate-800">
                  These third parties have access to your Personal Data only to
                  perform these tasks on our behalf and are obligated not to
                  disclose or use it for any other purpose.
                </p>
              </div>
            </section>

            <section id="cookies" className="scroll-mt-8 space-y-4">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-900 border-b border-slate-200 dark:border-slate-800 pb-2">
                3. Cookies and Other Tracking Technologies
              </h2>
              <p className="text-slate-800">
                We use cookies and similar tracking technologies to track the
                activity on our Service and we hold certain information.
              </p>
              <p className="text-slate-800">
                Cookies are files with small amount of data which may include an
                anonymous unique identifier. Cookies are sent to your browser
                from a website and stored on your device. Tracking technologies
                also used are beacons, tags, and scripts to collect and track
                information and to improve and analyze our Service.
              </p>
              <p className="text-slate-800">
                You can instruct your browser to refuse all cookies or to
                indicate when a cookie is being sent. However, if you do not
                accept cookies, you may not be able to use some portions of our
                Service.
              </p>

              <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white dark:bg-white p-4 rounded-xl  border-gray-100 dark:border-gray-100 shadow-sm space-y-4">
                  <h4 className="font-semibold text-slate-900 dark:text-slate-900 mb-1">
                    Session Cookies
                  </h4>
                  <p className="text-xs text-slate-800">
                    Used to operate our Service.
                  </p>
                </div>
                <div className="bg-white dark:bg-white p-4 rounded-xl  border-gray-100 dark:border-gray-100 shadow-sm space-y-4">
                  <h4 className="font-semibold text-slate-900 dark:text-slate-900 mb-1">
                    Preference Cookies
                  </h4>
                  <p className="text-xs  text-slate-800">
                    Used to remember your preferences and various settings.
                  </p>
                </div>
                <div className="bg-white dark:bg-white p-4 rounded-xl  border-gray-100 dark:border-gray-100 shadow-sm space-y-4">
                  <h4 className="font-semibold text-slate-900 dark:text-slate-900 mb-1">
                    Security Cookies
                  </h4>
                  <p className="text-xs  text-slate-800">
                    Used for security purposes.
                  </p>
                </div>
              </div>
            </section>

            <section id="retention" className="scroll-mt-8 space-y-4">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-900 border-b border-slate-200 dark:border-slate-800 pb-2">
                4. Data Retention
              </h2>
              <p className="text-slate-800">
                {APP_NAME} will retain your Personal Data only for as long as is
                necessary for the purposes set out in this Privacy Policy. We
                will retain and use your Personal Data to the extent necessary
                to comply with our legal obligations (for example, if we are
                required to retain your data to comply with applicable laws),
                resolve disputes, and enforce our legal agreements and policies.
              </p>
            </section>

            <section id="rights" className="scroll-mt-8 space-y-4">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-900 border-b border-slate-200 dark:border-slate-800 pb-2">
                5. Your Rights
              </h2>
              <p className="text-slate-800">
                {APP_NAME} aims to take reasonable steps to allow you to
                correct, amend, delete, or limit the use of your Personal Data.
                If you wish to be informed about what Personal Data we hold
                about you and if you want it to be removed from our systems,
                please contact us.
              </p>
              <p className="text-slate-800">
                In certain circumstances, you have the following data protection
                rights:
              </p>

              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {[
                  "The right to access, update or delete the information we have on you",
                  "The right of rectification",
                  "The right to object",
                  "The right of restriction",
                  "The right to data portability",
                  "The right to withdraw consent",
                ].map((right, idx) => (
                  <li
                    key={idx}
                    className="bg-white p-3.5 rounded-xl border border-slate-200/80 border-gray-100 text-sm font-medium flex items-start gap-3"
                  >
                    <span className="flex-shrink-0 text-indigo-500 font-bold">
                      ✓
                    </span>
                    <span className="text-slate-800">{right}</span>
                  </li>
                ))}
              </ul>

              <div className="bg-amber-50 dark:bg-white border border-indigo-200 dark:border-indigo-800/50 p-4 rounded-xl text-xs text-indigo-800 dark:text-indigo-700 mt-4">
                <strong>Please note:</strong> We may ask you to verify your
                identity before responding to such requests.
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}
