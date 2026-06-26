import React from 'react';

export function PrivacyPolicy() {
    return (
        <div className="max-w-3xl mx-auto px-6 py-12 text-neutral-300 animate-in fade-in duration-500 font-sans">
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
                        Die folgende Datenschutzerklärung gibt Ihnen einen Überblick darüber, wie wir diesen Schutz gewährleisten und welche Art von Daten zu welchem Zweck erhoben werden. Wir verwenden aus Sicherheitsgründen und zum Schutz der Übertragung vertraulicher Inhalte eine SSL- bzw. TLS-Verschlüsselung.
                    </p>
                </div>

                <div>
                    <h2 className="text-lg font-bold text-white mb-2">2. Verantwortliche Stelle</h2>
                    <p className="font-semibold text-white">Osten Wiecen Jap</p>
                    <p>Eichbuschallee 53 Container 0231</p>
                    <p>12437 Berlin, Deutschland</p>
                    <p className="mt-1">
                        E-Mail: <a href="mailto:ojap@hackamaps.com" className="text-blue-400 hover:underline">ojap@hackamaps.com</a>
                    </p>
                </div>

                <div>
                    <h2 className="text-lg font-bold text-white mb-2">3. Datenerfassung auf unserer Website</h2>
                    
                    <h3 className="font-semibold text-white mt-4 mb-1">A. Server-Log-Dateien</h3>
                    <p className="mb-2">
                        Der Provider der Seiten erhebt und speichert automatisch Informationen in so genannten Server-Log-Dateien, die Ihr Browser automatisch an uns übermittelt (z. B. Browsertyp, Betriebssystem, Referrer URL, Uhrzeit der Serveranfrage, IP-Adresse). Eine Zusammenführung dieser Daten mit anderen Datenquellen wird nicht vorgenommen.
                    </p>
                    <p className="mb-2">
                        Die Erfassung erfolgt auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an der technisch fehlerfreien Darstellung und Optimierung der Website).
                    </p>

                    <h3 className="font-semibold text-white mt-4 mb-1">B. Lokaler Speicher (Local Storage)</h3>
                    <p className="mb-2">
                        Zur Sicherstellung der Kernfunktionen (insbesondere dem Login-Status) verwenden wir den "Local Storage" des Browsers. Dies ist technisch zwingend erforderlich (§ 25 Abs. 2 TTDSG) und basiert auf unserem berechtigten Interesse (Art. 6 Abs. 1 lit. f DSGVO).
                    </p>

                    <h3 className="font-semibold text-white mt-4 mb-1">C. Registrierung und Benutzerprofil (Supabase)</h3>
                    <p className="mb-2">
                        Wenn Sie sich registrieren, erheben wir Daten wie Ihre E-Mail-Adresse, Ihren Namen, Ihren Benutzernamen sowie Ihr Profilbild (Avatar). Die Datenverarbeitung erfolgt auf Grundlage von Art. 6 Abs. 1 lit. b DSGVO zur Durchführung des Nutzungsvertrags. 
                    </p>
                    <p className="mb-2">
                        Wir nutzen für die Datenbank und Authentifizierung den Dienst Supabase (Supabase, Inc., 970 Toa Payoh North #07-04, Singapore 318992). Die physische Speicherung der Daten erfolgt auf Servern im Vereinigten Königreich (London). Für das Vereinigte Königreich liegt ein Angemessenheitsbeschluss der EU-Kommission gem. Art. 45 DSGVO vor, der ein angemessenes Datenschutzniveau bestätigt. Die Datenübertragung in Drittländer wird auf die Standardvertragsklauseln der EU-Kommission gestützt. Wir schützen diese Profile durch strenge Row-Level-Security (RLS), sodass private Daten nur für Sie selbst zugänglich sind.
                    </p>

                    <h3 className="font-semibold text-white mt-4 mb-1">D. Zahlungsabwicklung (Stripe)</h3>
                    <p className="mb-2">
                        Wenn Sie ein Premium-Abonnement erwerben, erfolgt die Zahlungsabwicklung über den Zahlungsdienstleister Stripe (Stripe Payments Europe, Ltd., 1 Grand Canal Street Lower, Grand Canal Dock, Dublin, Irland). Stripe erfasst Zahlungs- und Transaktionsdaten gem. Art. 6 Abs. 1 lit. b DSGVO. Wir selbst speichern keine Kreditkarteninformationen.
                    </p>

                    <h3 className="font-semibold text-white mt-4 mb-1">E. Hacker Face Map (Pins)</h3>
                    <p className="mb-2">
                        Wenn Sie der Face Map beitreten, werden Ihr Profilbild, Ihr Name, Ihre geographischen Koordinaten (Breiten- und Längengrad) sowie Ihre Social-Media-Links für andere Nutzer sichtbar auf der Karte gerendert. 
                    </p>
                    <p className="mb-2">
                        Diese Freigabe erfolgt ausschließlich auf Grundlage Ihrer ausdrücklichen Einwilligung gemäß Art. 6 Abs. 1 lit. a DSGVO. Sie können Ihre Einwilligung und Ihren Pin jederzeit über Ihr Profil löschen.
                    </p>

                    <h3 className="font-semibold text-white mt-4 mb-1">F. Analyse-Dienst (PostHog)</h3>
                    <p className="mb-2">
                        Wir nutzen zur Analyse des Nutzerverhaltens und zur Verbesserung unseres Angebots den Open-Source-Analysedienst PostHog (PostHog, Inc., 2261 Market Street #4008, San Francisco, CA 94114, USA). Die von uns genutzte Instanz wird auf Servern innerhalb der Europäischen Union (Frankfurt am Main, Deutschland, eu.i.posthog.com) betrieben.
                    </p>
                    <p className="mb-2">
                        Die Nutzung erfolgt ausschließlich nach Ihrer ausdrücklichen Einwilligung gemäß Art. 6 Abs. 1 lit. a DSGVO. Wenn Sie der Erfassung zustimmen, werden pseudonymisierte Nutzungsdaten (z. B. aufgerufene Seiten, Klicks, Browsertyp) erhoben. Bei angemeldeten Nutzern können zudem Ihre Benutzer-ID sowie Profildaten (wie Name, E-Mail-Adresse und Abonnement-Status) verknüpft werden, um das Nutzungserlebnis und den Support zu optimieren.
                    </p>
                    <p>
                        Die Datenverarbeitung und Speicherung erfolgt ausschließlich in der EU (Frankfurt). Ein Datentransfer in Drittländer wird dadurch vermieden. Sie können Ihre Einwilligung jederzeit mit Wirkung für die Zukunft über die "Cookie Settings" im Footer der Website widerrufen.
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
                        Stand: Juni 2026. Diese Datenschutzerklärung entspricht den Vorgaben der EU-Datenschutz-Grundverordnung (DSGVO).
                    </p>
                </div>
            </section>
        </div>
    );
}
