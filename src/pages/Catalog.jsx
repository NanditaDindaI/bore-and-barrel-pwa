import { useState, useEffect } from 'react'
import GUNS from '../data/guns.js'
import GunCard from '../components/GunCard.jsx'

function Catalog() {
  const [deferredPrompt, setDeferredPrompt] = useState(null)

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault() 
      setDeferredPrompt(e) 
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [])

  const handleInstallClick = async () => {
    // Jika event PWA siap (biasanya di Vercel/Production)
    if (deferredPrompt) {
      deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      
      if (outcome === 'accepted') {
        console.log('User menerima instalasi PWA')
      } else {
        console.log('User menolak instalasi')
      }
      
      setDeferredPrompt(null)
    } 
    // Jika diklik di localhost / event belum siap
    else {
      alert("Tombol install PWA aktif. (Catatan: Proses instalasi asli hanya akan muncul ketika diakses melalui Vercel/HTTPS).")
    }
  }

  return (
    <>
      <section className="masthead">
        <h1 className="display">Hardware, by the spec sheet.</h1>
        <p className="lede">
          A small armory of pistols, rifles, and shotguns. Every piece listed with its
          type, caliber, and price — nothing else.
        </p>
        
        {/* Tombol dimunculkan secara permanen tanpa syarat isInstallable */}
        <button 
          onClick={handleInstallClick} 
          style={{
            marginTop: '15px',
            padding: '10px 20px',
            backgroundColor: '#333',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          ⬇️ Install App
        </button>
      </section>

      <section>
        <div className="list-head">
          <h2>Current stock</h2>
          <span className="count">{GUNS.length} pieces</span>
        </div>
        <ul className="stock">
          {GUNS.map((gun) => <GunCard key={gun.name} gun={gun} />)}
        </ul>
      </section>
    </>
  )
}

export default Catalog