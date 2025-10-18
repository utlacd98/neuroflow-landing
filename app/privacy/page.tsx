'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Header */}
      <div className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent">
          Privacy Policy
        </h1>

        <Card className="bg-slate-800/50 border-slate-700 p-8 space-y-6">
          <section>
            <h2 className="text-2xl font-bold text-teal-400 mb-4">1. Introduction</h2>
            <p className="text-slate-300 leading-relaxed">
              FOCUSYNC ("we" or "us" or "our") operates the FOCUSYNC website. This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our Service and the choices you have associated with that data.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-teal-400 mb-4">2. Information Collection and Use</h2>
            <p className="text-slate-300 leading-relaxed mb-4">
              We collect several different types of information for various purposes to provide and improve our Service to you.
            </p>
            <div className="space-y-3">
              <div>
                <h3 className="font-semibold text-emerald-400 mb-2">Personal Data:</h3>
                <p className="text-slate-300">Email address, name, and profile information you provide during registration.</p>
              </div>
              <div>
                <h3 className="font-semibold text-emerald-400 mb-2">Usage Data:</h3>
                <p className="text-slate-300">Information about how you interact with our Service (session duration, features used, etc.).</p>
              </div>
              <div>
                <h3 className="font-semibold text-emerald-400 mb-2">Local Storage:</h3>
                <p className="text-slate-300">Session data and preferences stored locally in your browser. This data never leaves your device.</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-teal-400 mb-4">3. Data Storage and Security</h2>
            <p className="text-slate-300 leading-relaxed">
              Your session data and focus metrics are stored locally in your browser and never transmitted to our servers without your explicit consent. We use industry-standard security measures to protect your personal information.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-teal-400 mb-4">4. Use of Data</h2>
            <p className="text-slate-300 leading-relaxed">
              FOCUSYNC uses the collected data for various purposes:
            </p>
            <ul className="list-disc list-inside text-slate-300 space-y-2 ml-4 mt-3">
              <li>To provide and maintain our Service</li>
              <li>To notify you about changes to our Service</li>
              <li>To allow you to participate in interactive features of our Service</li>
              <li>To provide customer support</li>
              <li>To gather analysis or valuable information so that we can improve our Service</li>
              <li>To monitor the usage of our Service</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-teal-400 mb-4">5. Third-Party Services</h2>
            <p className="text-slate-300 leading-relaxed">
              Our Service may contain links to third-party sites that are not operated by us. This Privacy Policy does not apply to third-party websites, and we are not responsible for their privacy practices.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-teal-400 mb-4">6. Children's Privacy</h2>
            <p className="text-slate-300 leading-relaxed">
              Our Service does not address anyone under the age of 13. We do not knowingly collect personally identifiable information from children under 13.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-teal-400 mb-4">7. Changes to This Privacy Policy</h2>
            <p className="text-slate-300 leading-relaxed">
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date at the bottom of this Privacy Policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-teal-400 mb-4">8. Contact Us</h2>
            <p className="text-slate-300 leading-relaxed">
              If you have any questions about this Privacy Policy, please contact us at privacy@focusync.app
            </p>
          </section>

          <div className="pt-6 border-t border-slate-700">
            <p className="text-slate-400 text-sm">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}

