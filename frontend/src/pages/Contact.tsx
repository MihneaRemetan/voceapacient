import React from 'react';
import './Contact.css';

const Contact: React.FC = () => {
    return (
        <div className="contact-page">
            <div className="container">

                <h1 className="contact-page-title">Contact</h1>
                <p className="contact-page-subtitle">
                    Datele de identificare și contact ale firmei:
                </p>

                <div className="contact-card">

                    <div className="contact-row">
                        <span className="contact-label">Denumire:</span>
                        <span>Remețan Mihnea-Florin PFA</span>
                    </div>

                    <div className="contact-row">
                        <span className="contact-label">CUI:</span>
                        <span>49248980</span>
                    </div>

                    <div className="contact-row">
                        <span className="contact-label">Email:</span>
                        <a href="mailto:mihnearemetan@gmail.com">
                            mihnearemetan@gmail.com
                        </a>
                    </div>

                    <div className="contact-row">
                        <span className="contact-label">Telefon:</span>
                        <a href="tel:+40728146170">
                            +40 728 146 170
                        </a>
                    </div>

                    <div className="contact-row">
                        <span className="contact-label">Adresă:</span>
                        <span>
                            Piața Bibici Margareta, nr. 5, ap. 3<br />
                            Arad, jud. Arad, România
                        </span>
                    </div>

                </div>

            </div>
        </div>
    );
};

export default Contact;