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
              <h2 className="text-2xl font-semibold mb-3">About Hackamaps</h2>
              <p className="text-base">
                <strong>Hackamaps</strong> is a global hackathon discovery platform that helps developers, students, and innovators find and participate in hackathons worldwide. Our interactive map makes it easy to discover hackathons based on location, dates, categories, and prize pools.
              </p>
              <p className="text-base mt-3">
                <strong>Key Features:</strong>
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Interactive global map showing hackathons worldwide</li>
                <li>Filter hackathons by location, dates, categories, and prize pools</li>
                <li>Submit and share hackathon events with the community</li>
                <li>Track hackathons you've attended and won (optional profile feature)</li>
                <li>View public profiles of other hackathon enthusiasts</li>
              </ul>
            </section>

            <section className="bg-muted/30 p-4 rounded-lg border border-border">
              <h2 className="text-2xl font-semibold mb-3">Why We Need Your Data - Transparency First</h2>
              <p className="text-base font-medium mb-3">
                We believe in complete transparency. Here's exactly what data we collect and why:
              </p>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">🔐 Google Sign-In (Optional)</h3>
                  <p className="text-base"><strong>What we request:</strong> Your name and email address from your Google account</p>
                  <p className="text-base"><strong>Why we need it:</strong> To create and authenticate your account so you can submit hackathons and create a profile</p>
                  <p className="text-base"><strong>How we use it:</strong> Only for account authentication and to display your name on your profile if you choose to make it public</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">👤 Profile Information (Optional)</h3>
                  <p className="text-base"><strong>What we request:</strong> Name, GitHub URL, avatar, hackathons attended, and hackathons won</p>
                  <p className="text-base"><strong>Why we need it:</strong> To let you showcase your hackathon achievements to the community</p>
                  <p className="text-base"><strong>How we use it:</strong> Displayed on your public profile page only if you choose to add this information</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">🗺️ Hackathon Submissions</h3>
                  <p className="text-base"><strong>What we request:</strong> Hackathon details (name, location, dates, website, categories, prize pool)</p>
                  <p className="text-base"><strong>Why we need it:</strong> To display hackathons on our public map for the entire community</p>
                  <p className="text-base"><strong>How we use it:</strong> Made publicly visible to all users on the interactive map</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">📊 Analytics & Usage Data</h3>
                  <p className="text-base"><strong>What we collect:</strong> Page views, clicks, browser type, and general location (city/country level)</p>
                  <p className="text-base"><strong>Why we need it:</strong> To understand how people use Hackamaps and improve the platform</p>
                  <p className="text-base"><strong>How we use it:</strong> Anonymized and aggregated to identify popular features and fix issues</p>
                </div>
              </div>

              <p className="text-base font-medium mt-4 pt-4 border-t border-border">
                <strong>Important:</strong> You can use Hackamaps to browse and discover hackathons without creating an account. Sign-in is only required if you want to submit hackathons or create a profile.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">Information We Collect</h2>
              <h3 className="text-xl font-semibold mb-2">Information You Directly Provide</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Google Account Data:</strong> Name and email address when you sign in with Google</li>
                <li><strong>Profile Data:</strong> Name, GitHub URL, avatar image, hackathons attended, and prizes won (all optional)</li>
                <li><strong>Hackathon Submissions:</strong> Event details you submit including name, location, dates, website, categories, and prize information</li>
                <li><strong>Contact Information:</strong> Email address if you contact us with questions or requests</li>
              </ul>

              <h3 className="text-xl font-semibold mb-2 mt-4">Information Automatically Collected</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Usage Analytics:</strong> Pages viewed, features used, time spent on site</li>
                <li><strong>Device Information:</strong> Browser type, operating system, screen resolution</li>
                <li><strong>Location Data:</strong> Approximate location (city/country level) based on IP address</li>
                <li><strong>Cookies:</strong> Session cookies for authentication and preference storage</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">How We Use Your Information</h2>
              <p className="text-base mb-3">We use your information exclusively for the following purposes:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Service Delivery:</strong> Display hackathons on our map and maintain core platform functionality</li>
                <li><strong>Authentication:</strong> Verify your identity when you sign in with Google</li>
                <li><strong>User Profiles:</strong> Display your public profile information to other users (only if you create a profile)</li>
                <li><strong>Communication:</strong> Send important updates about the service or respond to your inquiries</li>
                <li><strong>Platform Improvement:</strong> Analyze usage patterns to enhance features and fix bugs</li>
                <li><strong>Security:</strong> Prevent fraud, abuse, and unauthorized access</li>
                <li><strong>Legal Compliance:</strong> Comply with applicable laws and respond to legal requests</li>
              </ul>
              <p className="text-base mt-3 font-medium">
                We do NOT sell, rent, or share your personal data with third parties for marketing purposes.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">Data Sharing and Third-Party Services</h2>
              <p className="text-base mb-3"><strong>We do NOT sell your personal data.</strong> We only share data in these limited circumstances:</p>
              
              <h3 className="text-xl font-semibold mb-2 mt-3">Third-Party Services We Use:</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Google OAuth:</strong> For secure authentication. Google's use of your data is governed by their privacy policy</li>
                <li><strong>Backend Services:</strong> We use cloud infrastructure to store and process data securely</li>
                <li><strong>Analytics Tools:</strong> To understand platform usage and improve performance</li>
              </ul>

              <h3 className="text-xl font-semibold mb-2 mt-3">When We May Share Your Data:</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Public Information:</strong> Hackathon submissions and public profile information are visible to all users</li>
                <li><strong>Legal Requirements:</strong> When required by law, court order, or government request</li>
                <li><strong>Service Providers:</strong> With trusted partners who help us operate the platform (under strict confidentiality agreements)</li>
                <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets (users will be notified)</li>
                <li><strong>With Your Consent:</strong> Any other sharing will only occur with your explicit permission</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">Your Rights and Control</h2>
              <h3 className="text-xl font-semibold mb-2">Everyone Has These Rights:</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Access:</strong> Request a copy of all data we have about you</li>
                <li><strong>Correction:</strong> Update or correct inaccurate information</li>
                <li><strong>Deletion:</strong> Request deletion of your account and associated data</li>
                <li><strong>Export:</strong> Download your data in a portable format</li>
                <li><strong>Opt-Out:</strong> Unsubscribe from communications at any time</li>
              </ul>

              <h3 className="text-xl font-semibold mb-2 mt-4">Additional Rights for European Users (GDPR):</h3>
              <p className="text-base mb-2">If you are in the European Economic Area (EEA) or UK, you have additional rights:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Right to Restrict Processing:</strong> Limit how we process your data</li>
                <li><strong>Right to Object:</strong> Object to processing based on legitimate interests</li>
                <li><strong>Right to Withdraw Consent:</strong> Withdraw consent at any time without affecting prior processing</li>
                <li><strong>Right to Lodge a Complaint:</strong> Contact your local data protection authority</li>
              </ul>
              
              <p className="text-base mt-4 font-medium">
                To exercise any of these rights, contact us at <strong>wiecen@gmail.com</strong>
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">Legal Basis for Processing (GDPR)</h2>
              <p className="text-base mb-2">We process your data based on:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Consent:</strong> You have given clear consent (e.g., signing in with Google, creating a profile)</li>
                <li><strong>Contract:</strong> Processing is necessary to provide services you requested</li>
                <li><strong>Legitimate Interests:</strong> To improve our service, prevent fraud, and ensure security (without overriding your rights)</li>
                <li><strong>Legal Obligation:</strong> To comply with applicable laws and regulations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">Data Security</h2>
              <p className="text-base">
                We implement industry-standard security measures to protect your personal data:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li>Encrypted data transmission (HTTPS/SSL)</li>
                <li>Secure authentication via Google OAuth</li>
                <li>Regular security audits and updates</li>
                <li>Access controls and monitoring</li>
                <li>Secure cloud infrastructure</li>
              </ul>
              <p className="text-base mt-3">
                While we take reasonable precautions, no internet transmission is 100% secure. We cannot guarantee absolute security but continuously work to protect your data.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">Data Retention</h2>
              <p className="text-base mb-2">
                We retain your data only as long as necessary:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Account Data:</strong> Retained while your account is active and for 30 days after deletion (for recovery purposes)</li>
                <li><strong>Profile Information:</strong> Deleted immediately when you remove it or delete your account</li>
                <li><strong>Hackathon Submissions:</strong> Retained indefinitely as public community content (unless you request removal)</li>
                <li><strong>Analytics Data:</strong> Anonymized and retained for up to 2 years for platform improvement</li>
                <li><strong>Legal Requirements:</strong> Some data may be retained longer if required by law</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">Cookies and Tracking</h2>
              <p className="text-base mb-2"><strong>Types of Cookies We Use:</strong></p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Essential Cookies:</strong> Required for authentication and basic functionality (cannot be disabled)</li>
                <li><strong>Analytics Cookies:</strong> Help us understand how users interact with the platform</li>
                <li><strong>Preference Cookies:</strong> Remember your settings and choices</li>
              </ul>
              <p className="text-base mt-3">
                You can control cookie preferences through your browser settings. Note that disabling essential cookies may affect platform functionality.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">Children's Privacy</h2>
              <p className="text-base">
                Hackamaps is not intended for children under 16 years of age. We do not knowingly collect personal data from children under 16. If you are a parent or guardian and believe your child has provided us with personal information, please contact us at <strong>wiecen@gmail.com</strong> and we will delete the information immediately.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">International Data Transfers</h2>
              <p className="text-base">
                Your data may be transferred to and processed in countries outside your country of residence, including countries that may have different data protection laws. We ensure appropriate safeguards are in place for such transfers in compliance with GDPR and other applicable regulations.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">Changes to This Privacy Policy</h2>
              <p className="text-base">
                We may update this privacy policy from time to time to reflect changes in our practices or legal requirements. We will notify you of significant changes by:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li>Posting the updated policy on this page</li>
                <li>Updating the "Last updated" date at the top</li>
                <li>Sending an email notification for material changes (if you have an account)</li>
              </ul>
              <p className="text-base mt-3">
                We encourage you to review this policy periodically. Your continued use of Hackamaps after changes constitutes acceptance of the updated policy.
              </p>
            </section>

            <section className="bg-muted/30 p-4 rounded-lg border border-border">
              <h2 className="text-2xl font-semibold mb-3">Contact Us</h2>
              <p className="text-base mb-3">
                If you have any questions, concerns, or requests regarding this privacy policy or how we handle your data, please contact us:
              </p>
              <div className="space-y-2">
                <p className="text-base">
                  <strong>Email:</strong> <a href="mailto:wiecen@gmail.com" className="text-primary hover:underline">wiecen@gmail.com</a>
                </p>
                <p className="text-base">
                  <strong>Response Time:</strong> We aim to respond to all inquiries within 48 hours
                </p>
              </div>
              <p className="text-base mt-4">
                For GDPR-related inquiries or to exercise your rights, email us with "GDPR Request" in the subject line. For users in the EEA/UK, you also have the right to lodge a complaint with your local data protection authority.
              </p>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
