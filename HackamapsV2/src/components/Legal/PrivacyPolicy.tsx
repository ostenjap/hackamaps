import React from 'react';

export function PrivacyPolicy() {
    return (
        <div className="max-w-3xl mx-auto px-6 py-12 text-neutral-300 animate-in fade-in duration-500">
            <h1 className="text-3xl font-extrabold text-white mb-8 tracking-tight font-mono">
                Datenschutzerklärung <span className="text-blue-500 font-sans text-sm block font-medium mt-1">Privacy Policy</span>
            </h1>

            <section className="space-y-6 text-sm leading-relaxed">
                <div>
                    <h2 className="text-lg font-bold text-white mb-2">1. Datenschutz auf einen Blick</h2>
                    <p className="mb-2">
                        Wir nehmen den Schutz Ihrer persönlichen Daten sehr ernst. Personenbezogene Daten werden auf dieser Webseite nur im technisch notwendigen Umfang sowie zur Bereitstellung unserer Dienstleistungen erhoben.
                    </p>
                    <p>
                        Die folgende Datenschutzerklärung gibt Ihnen einen Überblick darüber, wie wir diesen Schutz gewährleisten und welche Art von Daten zu welchem Zweck erhoben werden.
                    </p>
                </div>

                <div>
                    <h2 className="text-lg font-bold text-white mb-2">2. Verantwortliche Stelle</h2>
                    <p className="font-semibold text-white">Hackamaps UG (haftungsbeschränkt)</p>
                    <p>Musterstraße 42, 10115 Berlin, Deutschland</p>
                    <p>E-Mail: <a href="mailto:support@hackamaps.com" className="text-blue-400 hover:underline">support@hackamaps.com</a></p>
                </div>

                <div>
                    <h2 className="text-lg font-bold text-white mb-2">3. Datenerfassung auf unserer Website</h2>
                    <h3 className="font-semibold text-white mt-3 mb-1">A. Registrierung und Benutzerprofil (Supabase)</h3>
                    <p className="mb-2">
                        Wenn Sie sich auf unserer Webseite registrieren, erheben wir personenbezogene Daten wie Ihre E-Mail-Adresse, Ihren Namen, Ihren Benutzernamen sowie Ihr Profilbild (Avatar).
                    </p>
                    <p className="mb-2">
                        Die Datenverarbeitung erfolgt auf Grundlage von Art. 6 Abs. 1 lit. b DSGVO zur Durchführung des Nutzungsvertrags. Wir schützen diese Profile durch strenge Row-Level-Security (RLS) Richtlinien, sodass Ihre privaten Daten nur für Sie selbst zugänglich sind.
                    </p>

                    <h3 className="font-semibold text-white mt-3 mb-1">B. Zahlungsabwicklung (Stripe)</h3>
                    <p className="mb-2">
                        Wenn Sie ein Premium-Abonnement erwerben, erfolgt die Zahlungsabwicklung über den Zahlungsdienstleister Stripe. Stripe erfasst Zahlungs- und Transaktionsdaten gem. Art. 6 Abs. 1 lit. b DSGVO. Wir selbst speichern keine Kreditkarteninformationen.
                    </p>

                    <h3 className="font-semibold text-white mt-3 mb-1">C. Hacker Face Map (Pins)</h3>
                    <p className="mb-2">
                        Wenn Sie der Face Map beitreten, werden Ihr Profilbild, Ihr Name, Ihre geographischen Koordinaten (Breiten- und Längengrad) sowie Ihre Social-Media-Links für andere Nutzer sichtbar auf der Karte gerendert. 
                    </p>
                    <p>
                        Diese Freigabe erfolgt ausschließlich auf Grundlage Ihrer ausdrücklichen Einwilligung gemäß Art. 6 Abs. 1 lit. a DSGVO. Sie können Ihre Einwilligung und Ihren Pin jederzeit über Ihr Profil löschen.
                    </p>
                </div>

                <div>
                    <h2 className="text-lg font-bold text-white mb-2">4. Speicherdauer</h2>
                    <p>
                        Ihre Daten werden so lange gespeichert, wie Ihr Benutzerkonto besteht oder es zur Erfüllung unserer vertraglichen und gesetzlichen Pflichten erforderlich ist. Wenn Sie Ihr Profil löschen, werden Ihre Daten unverzüglich aus der Live-Datenbank entfernt.
                    </p>
                </div>

                <div>
                    <h2 className="text-lg font-bold text-white mb-2">5. Ihre Rechte als betroffene Person</h2>
                    <p className="mb-2">Sie haben das Recht:</p>
                    <ul className="list-disc pl-5 space-y-1.5">
                        <li>Auskunft über Ihre bei uns gespeicherten personenbezogenen Daten zu erhalten (Art. 15 DSGVO).</li>
                        <li>Die Berichtigung unrichtiger Daten zu verlangen (Art. 16 DSGVO).</li>
                        <li>Die Löschung Ihrer gespeicherten Daten zu verlangen (Art. 17 DSGVO).</li>
                        <li>Die Einschränkung der Verarbeitung zu verlangen (Art. 18 DSGVO).</li>
                        <li>Ihre erteilte Einwilligung jederzeit zu widerrufen (Art. 7 Abs. 3 DSGVO).</li>
                        <li>Sich bei einer Datenschutz-Aufsichtsbehörde zu beschweren (Art. 77 DSGVO).</li>
                    </ul>
                </div>

                <div className="border-t border-white/10 pt-6 mt-8">
                    <p className="text-xs text-neutral-500 italic">
                        Stand: Mai 2026. Diese Datenschutzerklärung entspricht den Vorgaben der EU-Datenschutz-Grundverordnung (DSGVO).
                    </p>
                </div>
            </section>
        </div>
    );
}
