import React from 'react';
import { Link } from 'react-router-dom';
import './ImplicaTe.css';

const ImplicaTe: React.FC = () => {
    return (
        <div className="implica-page">
            <h1>Implică-te</h1>

            <p>
                Susține misiunea <strong>Vocea Pacientului</strong> și ajută-ne
                să facem sistemul de sănătate mai transparent și mai corect.
            </p>

            <div className="implica-grid">
                <Link to="/doneaza" className="implica-card">
                    <h3>Donează</h3>
                    <p>Sprijină activitatea asociației prin donații directe.</p>
                </Link>

                <Link to="/api-35" className="implica-card">
                    <h3>3,5% din impozit</h3>
                    <p>Redirecționează 3,5% fără niciun cost pentru tine.</p>
                </Link>

                <Link to="/devino-membru" className="implica-card">
                    <h3>Devino membru</h3>
                    <p>Alătură-te comunității noastre.</p>
                </Link>

                <Link to="/promoveaza" className="implica-card">
                    <h3>Promovează</h3>
                    <p>Ajută-ne să facem mesajul nostru cunoscut.</p>
                </Link>
            </div>
        </div>
    );
};

export default ImplicaTe;