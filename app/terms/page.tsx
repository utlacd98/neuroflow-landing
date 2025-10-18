'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function TermsPage() {
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
          Terms of Service
        </h1>

        <Card className="bg-slate-800/50 border-slate-700 p-8 space-y-6">
          <section>
            <h2 className="text-2xl font-bold text-teal-400 mb-4">1. Acceptance of Terms</h2>
            <p className="text-slate-300 leading-relaxed">
              By accessing and using FOCUSYNC, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-teal-400 mb-4">2. Use License</h2>
            <p className="text-slate-300 leading-relaxed mb-4">
              Permission is granted to temporarily download one copy of the materials (information or software) on FOCUSYNC for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
            </p>
            <ul className="list-disc list-inside text-slate-300 space-y-2 ml-4">
              <li>Modifying or copying the materials</li>
              <li>Using the materials for any commercial purpose or for any public display</li>
              <li>Attempting to decompile or reverse engineer any software contained on FOCUSYNC</li>
              <li>Removing any copyright or other proprietary notations from the materials</li>
              <li>Transferring the materials to another person or "mirroring" the materials on any other server</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-teal-400 mb-4">3. Disclaimer</h2>
            <p className="text-slate-300 leading-relaxed">
              The materials on FOCUSYNC are provided on an 'as is' basis. FOCUSYNC makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-teal-400 mb-4">4. Limitations</h2>
            <p className="text-slate-300 leading-relaxed">
              In no event shall FOCUSYNC or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on FOCUSYNC.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-teal-400 mb-4">5. Accuracy of Materials</h2>
            <p className="text-slate-300 leading-relaxed">
              The materials appearing on FOCUSYNC could include technical, typographical, or photographic errors. FOCUSYNC does not warrant that any of the materials on its website are accurate, complete, or current. FOCUSYNC may make changes to the materials contained on its website at any time without notice.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-teal-400 mb-4">6. Links</h2>
            <p className="text-slate-300 leading-relaxed">
              FOCUSYNC has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by FOCUSYNC of the site. Use of any such linked website is at the user's own risk.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-teal-400 mb-4">7. Modifications</h2>
            <p className="text-slate-300 leading-relaxed">
              FOCUSYNC may revise these terms of service for its website at any time without notice. By using this website, you are agreeing to be bound by the then current version of these terms of service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-teal-400 mb-4">8. Governing Law</h2>
            <p className="text-slate-300 leading-relaxed">
              These terms and conditions are governed by and construed in accordance with the laws of the United Kingdom, and you irrevocably submit to the exclusive jurisdiction of the courts located in the United Kingdom.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-teal-400 mb-4">9. Contact Information</h2>
            <p className="text-slate-300 leading-relaxed">
              If you have any questions about these Terms of Service, please contact us at support@focusync.app
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

