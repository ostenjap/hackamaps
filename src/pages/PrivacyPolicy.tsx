import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const PrivacyPolicy = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate("/home")}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>

        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">Privacy Policy</CardTitle>
            <CardDescription>Last updated: {new Date().toLocaleDateString()}</CardDescription>
          </CardHeader>
          <CardContent className="prose prose-sm dark:prose-invert max-w-none space-y-6">
            <section>
              <h2 className="text-2xl font-semibold mb-3">1. Introduction</h2>
              <p>
                Welcome to HackaMaps ("we," "our," or "us"). We respect your privacy and are committed to protecting your personal data. This privacy policy explains how we collect, use, and safeguard your information when you use our hackathon discovery platform.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">2. Information We Collect</h2>
              <h3 className="text-xl font-semibold mb-2">2.1 Information You Provide</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Account information (name, email address) when you sign up via Google OAuth</li>
                <li>Profile information you choose to provide</li>
                <li>Hackathon submissions and related content</li>
              </ul>

              <h3 className="text-xl font-semibold mb-2 mt-4">2.2 Automatically Collected Information</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Usage data and analytics</li>
                <li>Device information and browser type</li>
                <li>IP address and location data</li>
                <li>Cookies and similar tracking technologies</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">3. How We Use Your Information</h2>
              <p>We use your information to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Provide and maintain our services</li>
                <li>Authenticate your account via Google OAuth</li>
                <li>Display hackathon information on our interactive map</li>
                <li>Send you notifications about hackathons you're interested in</li>
                <li>Improve and personalize your experience</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">4. Legal Basis for Processing (GDPR)</h2>
              <p>Under the General Data Protection Regulation (GDPR), we process your data based on:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Consent:</strong> You have given clear consent for us to process your personal data for specific purposes</li>
                <li><strong>Contract:</strong> Processing is necessary for a contract we have with you</li>
                <li><strong>Legitimate interests:</strong> Processing is necessary for our legitimate interests or those of a third party</li>
                <li><strong>Legal obligation:</strong> Processing is necessary to comply with the law</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">5. Data Sharing and Disclosure</h2>
              <p>We do not sell your personal data. We may share your information with:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Service providers:</strong> Third-party services that help us operate (e.g., Lovable Cloud, Google OAuth)</li>
                <li><strong>Legal requirements:</strong> When required by law or to protect our rights</li>
                <li><strong>Business transfers:</strong> In connection with mergers, acquisitions, or asset sales</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">6. Your Rights Under GDPR</h2>
              <p>If you are in the European Economic Area (EEA), you have the following rights:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Right to access:</strong> Request copies of your personal data</li>
                <li><strong>Right to rectification:</strong> Request correction of inaccurate data</li>
                <li><strong>Right to erasure:</strong> Request deletion of your data</li>
                <li><strong>Right to restrict processing:</strong> Request limitation of data processing</li>
                <li><strong>Right to data portability:</strong> Request transfer of your data</li>
                <li><strong>Right to object:</strong> Object to our processing of your data</li>
                <li><strong>Right to withdraw consent:</strong> Withdraw consent at any time</li>
              </ul>
              <p className="mt-3">To exercise these rights, please contact us at the email address provided below.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">7. Data Security</h2>
              <p>
                We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">8. Data Retention</h2>
              <p>
                We retain your personal data only for as long as necessary to fulfill the purposes outlined in this privacy policy, unless a longer retention period is required by law.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">9. Cookies and Tracking</h2>
              <p>
                We use cookies and similar tracking technologies to enhance your experience. You can control cookie preferences through your browser settings.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">10. Third-Party Services</h2>
              <p>Our service integrates with:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Google OAuth:</strong> For authentication purposes</li>
                <li><strong>Lovable Cloud:</strong> For backend services and data storage</li>
              </ul>
              <p className="mt-3">These third parties have their own privacy policies governing their use of your information.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">11. Children's Privacy</h2>
              <p>
                Our service is not intended for children under 16 years of age. We do not knowingly collect personal data from children under 16.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">12. International Data Transfers</h2>
              <p>
                Your data may be transferred to and processed in countries outside the EEA. We ensure appropriate safeguards are in place for such transfers in compliance with GDPR.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">13. Changes to This Policy</h2>
              <p>
                We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last updated" date.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">14. Contact Us</h2>
              <p>
                If you have any questions about this privacy policy or wish to exercise your rights, please contact us at:
              </p>
              <p className="mt-2">
                <strong>Email:</strong> privacy@hackamaps.com
              </p>
              <p className="mt-2">
                For GDPR-related inquiries, you may also contact your local data protection authority.
              </p>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
