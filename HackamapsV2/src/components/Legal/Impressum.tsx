import React from 'react';

export function Impressum() {
    return (
        <div className="max-w-3xl mx-auto px-6 py-12 text-neutral-300 animate-in fade-in duration-500">
            <h1 className="text-3xl font-extrabold text-white mb-8 tracking-tight font-mono">
                Impressum <span className="text-blue-500 font-sans text-sm block font-medium mt-1">German Legal Notice</span>
            </h1>

            <section className="space-y-6 text-sm leading-relaxed">
                <div>
                    <h2 className="text-lg font-bold text-white mb-2">Angaben gemäß § 5 TMG</h2>
                    <p className="font-semibold text-white">Hackamaps UG (haftungsbeschränkt)</p>
                    <p>Musterstraße 42</p>
                    <p>10115 Berlin</p>
                    <p>Deutschland</p>
                </div>

                <div>
                    <h2 className="text-lg font-bold text-white mb-2">Vertreten durch</h2>
                    <p>O Ostenjap (Geschäftsführer)</p>
                </div>

                <div>
                    <h2 className="text-lg font-bold text-white mb-2">Kontakt</h2>
                    <p>E-Mail: <a href="mailto:support@hackamaps.com" className="text-blue-400 hover:underline">support@hackamaps.com</a></p>
                    <p>Website: <a href="https://hackamaps.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">https://hackamaps.com</a></p>
                </div>

                <div>
                    <h2 className="text-lg font-bold text-white mb-2">Registereintrag</h2>
                    <p>Eintragung im Handelsregister.</p>
                    <p>Registergericht: Amtsgericht Charlottenburg (Berlin)</p>
                    <p>Registernummer: HRB 99999 B</p>
                </div>

                <div>
                    <h2 className="text-lg font-bold text-white mb-2">Umsatzsteuer-ID</h2>
                    <p>Umsatzsteuer-Identifikationsnummer gemäß § 27 a Umsatzsteuergesetz:</p>
                    <p className="font-mono text-neutral-400">DE 999999999</p>
                </div>

                <div className="border-t border-white/10 pt-6 mt-8">
                    <h2 className="text-lg font-bold text-white mb-2">EU-Streitschlichtung</h2>
                    <p className="mb-4">
                        Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit: 
                        <a href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline ml-1">
                            https://ec.europa.eu/consumers/odr/
                        </a>.
                    </p>
                    <p>Unsere E-Mail-Adresse finden Sie oben im Impressum.</p>
                </div>

                <div>
                    <h2 className="text-lg font-bold text-white mb-2">Verbraucherstreitbeilegung/Universalschlichtungsstelle</h2>
                    <p>
                        Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.
                    </p>
                </div>
            </section>
        </div>
    );
}
