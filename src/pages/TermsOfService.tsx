import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const TermsOfService = () => {
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
            <CardTitle className="text-3xl">Terms of Service</CardTitle>
            <CardDescription>Last updated: {new Date().toLocaleDateString()}</CardDescription>
          </CardHeader>
          <CardContent className="prose prose-sm dark:prose-invert max-w-none space-y-6">
            <section>
              <h2 className="text-2xl font-semibold mb-3">1. Agreement to Terms</h2>
              <p>
                By accessing or using HackaMaps ("Service"), you agree to be bound by these Terms of Service ("Terms"). If you disagree with any part of these terms, you may not access the Service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">2. Description of Service</h2>
              <p>
                HackaMaps is a platform that provides an interactive map to discover hackathons worldwide. Our Service allows users to:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Browse and search for hackathons on an interactive map</li>
                <li>Filter hackathons by various criteria</li>
                <li>Submit new hackathon information</li>
                <li>Create an account using Google OAuth authentication</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">3. User Accounts</h2>
              <h3 className="text-xl font-semibold mb-2">3.1 Account Creation</h3>
              <p>
                To access certain features, you must create an account using Google OAuth. You are responsible for maintaining the confidentiality of your account credentials.
              </p>

              <h3 className="text-xl font-semibold mb-2 mt-4">3.2 Account Responsibilities</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>You must provide accurate and complete information</li>
                <li>You are responsible for all activities under your account</li>
                <li>You must notify us immediately of any unauthorized use</li>
                <li>You must be at least 16 years old to use this Service</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">4. User Content</h2>
              <h3 className="text-xl font-semibold mb-2">4.1 Content Submission</h3>
              <p>
                Users may submit hackathon information to our platform. By submitting content, you represent and warrant that:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>You own or have the right to submit the content</li>
                <li>The content is accurate and not misleading</li>
                <li>The content does not violate any laws or third-party rights</li>
                <li>The content does not contain malicious code or spam</li>
              </ul>

              <h3 className="text-xl font-semibold mb-2 mt-4">4.2 Content License</h3>
              <p>
                By submitting content, you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, modify, and display the content in connection with the Service.
              </p>

              <h3 className="text-xl font-semibold mb-2 mt-4">4.3 Content Moderation</h3>
              <p>
                We reserve the right to review, modify, or remove any content that violates these Terms or is otherwise objectionable.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">5. Prohibited Conduct</h2>
              <p>You agree not to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Use the Service for any illegal purpose</li>
                <li>Impersonate any person or entity</li>
                <li>Interfere with or disrupt the Service</li>
                <li>Attempt to gain unauthorized access to the Service</li>
                <li>Collect or harvest user information</li>
                <li>Submit false or misleading hackathon information</li>
                <li>Use automated systems (bots) without permission</li>
                <li>Violate any applicable laws or regulations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">6. Intellectual Property</h2>
              <h3 className="text-xl font-semibold mb-2">6.1 Our Rights</h3>
              <p>
                The Service and its original content (excluding user-submitted content), features, and functionality are owned by HackaMaps and are protected by international copyright, trademark, and other intellectual property laws.
              </p>

              <h3 className="text-xl font-semibold mb-2 mt-4">6.2 Limited License</h3>
              <p>
                We grant you a limited, non-exclusive, non-transferable license to access and use the Service for personal, non-commercial purposes.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">7. Third-Party Services</h2>
              <p>
                Our Service integrates with third-party services including Google OAuth and Lovable Cloud. Your use of these services is subject to their respective terms and privacy policies.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">8. Disclaimer of Warranties</h2>
              <p>
                THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED. WE DO NOT WARRANT THAT:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>The Service will be uninterrupted or error-free</li>
                <li>Defects will be corrected</li>
                <li>The Service is free of viruses or harmful components</li>
                <li>Hackathon information is accurate or up-to-date</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">9. Limitation of Liability</h2>
              <p>
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, HACKAMAPS SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, WHETHER INCURRED DIRECTLY OR INDIRECTLY, OR ANY LOSS OF DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">10. Indemnification</h2>
              <p>
                You agree to indemnify and hold harmless HackaMaps and its affiliates from any claims, losses, damages, liabilities, and expenses arising out of:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Your use of the Service</li>
                <li>Your violation of these Terms</li>
                <li>Your violation of any third-party rights</li>
                <li>Content you submit to the Service</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">11. Termination</h2>
              <p>
                We may terminate or suspend your account and access to the Service immediately, without prior notice, for any reason, including breach of these Terms. Upon termination, your right to use the Service will immediately cease.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">12. GDPR Compliance</h2>
              <p>
                We are committed to complying with the General Data Protection Regulation (GDPR). For information about how we collect, use, and protect your personal data, please see our Privacy Policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">13. Changes to Terms</h2>
              <p>
                We reserve the right to modify these Terms at any time. We will notify users of any material changes by posting the new Terms on this page and updating the "Last updated" date. Your continued use of the Service after changes constitutes acceptance of the new Terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">14. Governing Law</h2>
              <p>
                These Terms shall be governed by and construed in accordance with applicable laws, without regard to conflict of law principles. For users in the EEA, you retain all rights under applicable consumer protection laws.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">15. Dispute Resolution</h2>
              <p>
                Any disputes arising from these Terms or the Service shall first be resolved through good faith negotiation. If unresolved, disputes may be submitted to binding arbitration or appropriate courts.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">16. Severability</h2>
              <p>
                If any provision of these Terms is found to be unenforceable, the remaining provisions will continue in full force and effect.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">17. Contact Information</h2>
              <p>
                If you have any questions about these Terms of Service, please contact us at:
              </p>
              <p className="mt-2">
                <strong>Email:</strong> support@hackamaps.com
              </p>
            </section>

            <section className="mt-8 p-4 bg-muted rounded-lg">
              <p className="text-sm">
                By using HackaMaps, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
              </p>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TermsOfService;
