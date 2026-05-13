import HeroPrimary from "@/components/sections/hero-banners/HeroPrimary";

const PrivacyMain = () => {
  return (
    <>
      <HeroPrimary title="Privacy Policy" path="Privacy Policy" />
      <section className="py-30px lg:py-50px">
        <div className="container">
          <div className="max-w-4xl mx-auto bg-whiteColor dark:bg-whiteColor-dark shadow-accordion dark:shadow-accordion-dark rounded-5 p-10px md:p-10">
            <div className="mb-6 pb-5 border-b-2 border-borderColor dark:border-borderColor-dark">
              <p className="text-sm text-contentColor dark:text-contentColor-dark">
                Effective Date: 21 May 2025
              </p>
              <p className="text-sm text-contentColor dark:text-contentColor-dark mt-1">
                Operated by: Expert Square FZC
              </p>
              <p className="text-sm text-contentColor dark:text-contentColor-dark">
                Licensed Under: SRTIP Free Zone Authority, License No. 7294
              </p>
            </div>

            <div className="space-y-6 text-contentColor dark:text-contentColor-dark leading-relaxed">
              <p>
                Tutorbay (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is a service owned
                and operated by Expert Square FZC, a Free Zone Company registered with the Sharjah
                Research Technology and Innovation Park (SRTIP) in the UAE. This Privacy Policy
                outlines how we collect, use, and safeguard your personal information when you use
                our website and services.
              </p>

              <section>
                <h2 className="text-xl font-bold text-blackColor dark:text-blackColor-dark mb-3">
                  1. Information We Collect
                </h2>
                <p className="mb-2">We may collect the following:</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    <strong>Personal Data:</strong> Name, email, phone number, address, nationality,
                    profession.
                  </li>
                  <li>
                    <strong>Student Details:</strong> Grade, subjects, learning requirements.
                  </li>
                  <li>
                    <strong>Tutor Information:</strong> Qualifications, experience, teaching
                    preferences.
                  </li>
                  <li>
                    <strong>Usage Data:</strong> Browser type, IP address, cookies, device info.
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-blackColor dark:text-blackColor-dark mb-3">
                  2. How We Use Your Information
                </h2>
                <p className="mb-2">We use your information to:</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Match parents with suitable tutors.</li>
                  <li>Communicate updates or changes to services.</li>
                  <li>Improve user experience and customer support.</li>
                  <li>Prevent fraud or misuse of our platform.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-blackColor dark:text-blackColor-dark mb-3">
                  3. How We Share Information
                </h2>
                <p className="mb-2">We may share data:</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>With tutors or parents based on your submitted request.</li>
                  <li>With payment processors (when applicable).</li>
                  <li>When required by UAE law, authorities, or Free Zone regulations.</li>
                </ul>
                <p className="mt-2">
                  We do <strong>not</strong> sell or rent your personal data to any third party.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-blackColor dark:text-blackColor-dark mb-3">
                  4. Data Storage and Security
                </h2>
                <p>
                  Your data is stored securely on our systems and protected using industry-standard
                  encryption. We comply with the UAE&apos;s data protection regulations and Free
                  Zone compliance standards.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-blackColor dark:text-blackColor-dark mb-3">
                  5. Your Rights
                </h2>
                <p className="mb-2">You have the right to:</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Access or correct your data.</li>
                  <li>Request deletion of your profile.</li>
                  <li>Opt-out from communications at any time.</li>
                </ul>
                <p className="mt-2">
                  To request this, contact:
                </p>
                <p className="mt-1">
                  Email:{" "}
                  <a href="mailto:support@tutorbay.ae" className="text-primaryColor hover:underline">
                    support@tutorbay.ae
                  </a>
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-blackColor dark:text-blackColor-dark mb-3">
                  6. Children&apos;s Privacy
                </h2>
                <p>
                  We only collect children&apos;s data with parental consent and solely for the
                  purpose of providing tuition services. Parents can request removal at any time.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-blackColor dark:text-blackColor-dark mb-3">
                  7. Changes to This Policy
                </h2>
                <p>
                  We may update this Privacy Policy occasionally. Updates will be posted on this
                  page, with the &quot;Effective Date&quot; updated accordingly.
                </p>
              </section>

              <section className="pt-4 border-t-2 border-borderColor dark:border-borderColor-dark">
                <h2 className="text-xl font-bold text-blackColor dark:text-blackColor-dark mb-3">
                  8. Contact Information
                </h2>
                <p>Tutorbay is a service owned and operated by:</p>
                <div className="mt-2 space-y-1">
                  <p className="font-medium">Expert Square FZC</p>
                  <p>SRTIP Address: Block B – B37-028</p>
                  <p>License No: 7294</p>
                  <p>Sharjah Research Technology and Innovation Park</p>
                  <p>United Arab Emirates</p>
                </div>
                <div className="mt-4">
                  <p>
                    Email:{" "}
                    <a
                      href="mailto:support@tutorbay.ae"
                      className="text-primaryColor hover:underline"
                    >
                      support@tutorbay.ae
                    </a>
                  </p>
                </div>
              </section>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default PrivacyMain;
