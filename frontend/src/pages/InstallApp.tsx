import { useState, useEffect } from 'react';
import './InstallApp.css';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function InstallApp() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    // Detect platform
    const userAgent = window.navigator.userAgent.toLowerCase();
    const ios = /iphone|ipad|ipod/.test(userAgent);
    const android = /android/.test(userAgent);
    
    setIsIOS(ios);
    setIsAndroid(android);

    // Listen for install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      return;
    }

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      console.log('✅ User accepted PWA install');
      setIsInstalled(true);
    }

    setDeferredPrompt(null);
  };

  return (
    <div className="install-app-page">
      <div className="container">
        <div className="install-hero">
          <h1>📱 Instalează Aplicația</h1>
          <p className="install-subtitle">
            Accesează Vocea Pacientului mai rapid cu aplicația noastră web progresivă
          </p>
        </div>

        {isInstalled ? (
          <div className="install-card success-card">
            <div className="success-icon">✅</div>
            <h2>Aplicația este deja instalată!</h2>
            <p>Poți accesa aplicația direct de pe ecranul tău principal.</p>
          </div>
        ) : (
          <>
            {/* Android Chrome - Buton automat */}
            {deferredPrompt && isAndroid && (
              <div className="install-card primary-card">
                <h2>🎉 Instalează acum!</h2>
                <p>Aplicația poate fi instalată pe dispozitivul tău Android.</p>
                <button onClick={handleInstallClick} className="btn btn-primary btn-lg install-button">
                  📥 Instalează Aplicația
                </button>
              </div>
            )}

            {/* iOS Safari - Instrucțiuni */}
            {isIOS && (
              <div className="install-card ios-card">
                <h2>📱 Instalare pe iPhone/iPad</h2>
                <div className="install-steps">
                  <div className="install-step">
                    <div className="step-number">1</div>
                    <div className="step-content">
                      <h3>Deschide în Safari</h3>
                      <p>Asigură-te că folosești Safari (nu Chrome sau alt browser)</p>
                    </div>
                  </div>
                  <div className="install-step">
                    <div className="step-number">2</div>
                    <div className="step-content">
                      <h3>Apasă butonul Share</h3>
                      <p>Apasă pe <strong>📤 Share</strong> (butonul din mijlocul de jos)</p>
                    </div>
                  </div>
                  <div className="install-step">
                    <div className="step-number">3</div>
                    <div className="step-content">
                      <h3>Add to Home Screen</h3>
                      <p>Scroll și selectează <strong>"Add to Home Screen"</strong></p>
                    </div>
                  </div>
                  <div className="install-step">
                    <div className="step-number">4</div>
                    <div className="step-content">
                      <h3>Confirmă</h3>
                      <p>Apasă <strong>"Add"</strong> și aplicația va apărea pe ecranul principal</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Android - Instrucțiuni generale */}
            {isAndroid && !deferredPrompt && (
              <div className="install-card android-card">
                <h2>📱 Instalare pe Android</h2>
                <div className="install-steps">
                  <div className="install-step">
                    <div className="step-number">1</div>
                    <div className="step-content">
                      <h3>Deschide în Chrome</h3>
                      <p>Asigură-te că folosești Google Chrome</p>
                    </div>
                  </div>
                  <div className="install-step">
                    <div className="step-number">2</div>
                    <div className="step-content">
                      <h3>Apasă meniul</h3>
                      <p>Apasă pe <strong>⋮</strong> (cele 3 puncte din dreapta sus)</p>
                    </div>
                  </div>
                  <div className="install-step">
                    <div className="step-number">3</div>
                    <div className="step-content">
                      <h3>Install app</h3>
                      <p>Selectează <strong>"Install app"</strong> sau <strong>"Add to Home screen"</strong></p>
                    </div>
                  </div>
                  <div className="install-step">
                    <div className="step-number">4</div>
                    <div className="step-content">
                      <h3>Confirmă</h3>
                      <p>Apasă <strong>"Install"</strong> și aplicația se va instala</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Desktop - Instrucțiuni */}
            {!isIOS && !isAndroid && (
              <div className="install-card desktop-card">
                <h2>💻 Instalare pe Desktop</h2>
                <div className="install-steps">
                  <div className="install-step">
                    <div className="step-number">1</div>
                    <div className="step-content">
                      <h3>Caută iconița</h3>
                      <p>În bara de adrese (dreapta), caută iconița <strong>⊕</strong> sau <strong>💻</strong></p>
                    </div>
                  </div>
                  <div className="install-step">
                    <div className="step-number">2</div>
                    <div className="step-content">
                      <h3>Click pe iconița</h3>
                      <p>Sau mergi la <strong>Menu → Install Vocea Pacientului</strong></p>
                    </div>
                  </div>
                  <div className="install-step">
                    <div className="step-number">3</div>
                    <div className="step-content">
                      <h3>Confirmă</h3>
                      <p>Apasă <strong>"Install"</strong> pentru a adăuga aplicația</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Beneficii */}
            <div className="benefits-section">
              <h2>✨ Beneficii Aplicație</h2>
              <div className="benefits-grid">
                <div className="benefit-card">
                  <div className="benefit-icon">⚡</div>
                  <h3>Acces Rapid</h3>
                  <p>Deschide aplicația direct de pe ecranul principal</p>
                </div>
                <div className="benefit-card">
                  <div className="benefit-icon">📴</div>
                  <h3>Funcționează Offline</h3>
                  <p>Vezi conținut chiar și fără internet</p>
                </div>
                <div className="benefit-card">
                  <div className="benefit-icon">🎨</div>
                  <h3>Experiență Nativă</h3>
                  <p>Arată și funcționează ca o aplicație reală</p>
                </div>
                <div className="benefit-card">
                  <div className="benefit-icon">🔔</div>
                  <h3>Notificări</h3>
                  <p>Primește actualizări importante</p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
