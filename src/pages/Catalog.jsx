import { useState, useEffect } from 'react'
import GUNS from '../data/guns.js'
import GunCard from '../components/GunCard.jsx'

function Catalog() {
  // State untuk menyimpan event instalasi dari browser
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [isInstallable, setIsInstallable] = useState(false)

  useEffect(() => {
    // Fungsi untuk menangkap event 'beforeinstallprompt'
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault() // Mencegah browser memunculkan prompt otomatis bawaannya
      setDeferredPrompt(e) // Menyimpan event untuk dipicu nanti lewat tombol
      setIsInstallable(true) // Memunculkan tombol Install di UI
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [])

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt() // Memunculkan popup instalasi PWA
      const { outcome } = await deferredPrompt.userChoice
      
      if (outcome === 'accepted') {
        console.log('User menerima instalasi PWA')
      } else {
        console.log('User menolak instalasi')
      }
      
      // Reset state setelah prompt digunakan
      setDeferredPrompt(null)
      setIsInstallable(false)
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
        
        {/* Tombol Install App yang hanya muncul jika PWA siap diinstal */}
        {isInstallable && (
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
        )}
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