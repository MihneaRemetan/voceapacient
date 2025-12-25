import React from 'react';
import './About.css';

const About: React.FC = () => {
    return (
        <div className="about-page">
            {/* Hero Section */}
            <section className="about-hero">
                <div className="container">
                    <h1 className="about-title">DESPRE NOI</h1>
                </div>
            </section>

            {/* Mission Section */}
            <section className="about-section">
                <div className="container">
                    <h2 className="section-title">Misiunea Noastră</h2>
                    <p className="section-content">
                        Platforma "Vocea Pacientului" a luat naștere din nevoia urgentă de a oferi cetățenilor
                        un canal sigur și independent pentru a semnala neregulile din sistemul de sănătate.
                    </p>
                    <p className="section-content">
                        Credem că transparența este primul pas spre vindecare.
                    </p>
                </div>
            </section>

            {/* Objectives Section */}
            <section className="objectives-section">
                <div className="container">
                    <h2 className="section-title">Obiectivele Noastre</h2>
                    <div className="objectives-grid">
                        <div className="objective-card">
                            <div className="objective-icon">📊</div>
                            <h3>Monitorizare Civică</h3>
                            <p>
                                Colectăm și centralizăm mărturiile pacienților pentru a crea o imagine reală
                                a stării spitalelor.
                            </p>
                        </div>

                        <div className="objective-card">
                            <div className="objective-icon">🔒</div>
                            <h3>Protecția Identității</h3>
                            <p>
                                Oferim posibilitatea de a raporta anonim, protejând sursele vulnerabile.
                            </p>
                        </div>

                        <div className="objective-card">
                            <div className="objective-icon">✊</div>
                            <h3>Presiune Publică Constructivă</h3>
                            <p>
                                Folosim datele colectate pentru a sesiza autoritățile și a cere schimbări concrete.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default About;
