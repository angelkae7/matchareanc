import { useEffect, useState } from "react"
import { ItemCard } from "./components/ItemCard"
import { useCommunes } from "./hooks/useCommunes"
import { DropZone } from "./components/DropZone"
import { DotLottieReact } from "@lottiefiles/dotlottie-react"
import Stars from "./components/Stars"
import Footer from "./components/Footer"
import LoadingScreen from "./components/LoadingScreen"
import { soundClick, soundDragStart, soundDropCorrect, soundDropWrong, soundWin, soundLose } from "./utils/sounds"

const provinceTotals = {
  "province Sud": 14,
  "province Nord": 17,
  "province des îles Loyauté": 3,
}

export default function App() {
  const [screen, setScreen] = useState("loading") // loading, home, game, win, lose
  const [lives, setLives] = useState(3)
  const [dragging, setDragging] = useState(null)
  const communes = useCommunes()
  const [provinces, setProvinces] = useState({
    "province Sud": [],
    "province Nord": [],
    "province des îles Loyauté": [],
  })

  const [starsOrigin, setStarsOrigin] = useState(null)
  const [remaining, setRemaining] = useState([])
  const [remainingVisible, setRemainingVisible] = useState([])
  const [chrono, setChrono] = useState(60)
  const [showStars, setShowStars] = useState(false)
  const [errorZone, setErrorZone] = useState(null)

  // Mettre à jour remaining quand communes change
  useEffect(() => {
    setRemaining(communes)
  }, [communes])

  // Timer du jeu
  useEffect(() => {
    if (screen !== "game") return
    if (chrono <= 0) {
      setScreen("lose")
      return
    }
    const interval = setInterval(() => {
      setChrono((prev) => prev - 1)
    }, 1000)
    return () => clearInterval(interval)
  }, [screen, chrono])

  // Afficher 7 communes visibles
  useEffect(() => {
    setRemainingVisible(remaining.slice(0, 5))
  }, [remaining])

  // Vérifier la victoire
  useEffect(() => {
    if (
      screen === "game" &&
      communes.length > 0 &&
      remaining.length === 0
    ) {
      setScreen("win")
    }
  }, [remaining, screen, communes])

  // Jouer les sons quand on gagne ou perd
  useEffect(() => {
    if (screen === "win") {
      setTimeout(() => {
        try {
          soundWin()
        } catch (e) {
          console.warn('Sound error:', e)
        }
      }, 100)
    } else if (screen === "lose") {
      setTimeout(() => {
        try {
          soundLose()
        } catch (e) {
          console.warn('Sound error:', e)
        }
      }, 100)
    }
  }, [screen])

  function goHome() {
    soundClick()
    setScreen("home")
    setDragging(null)
  }

  function startGame() {
    soundClick()
    setScreen("game")
    setChrono(60)
    setLives(3)
    setRemaining(communes)
    setProvinces({
      "province Sud": [],
      "province Nord": [],
      "province des îles Loyauté": [],
    })
  }

  function handleItemDragStart(item, event) {
    soundDragStart()
    if (event && event.dataTransfer) {
      event.dataTransfer.effectAllowed = "move"
      event.dataTransfer.setData("text/plain", item.nom_commune)
    }
    setDragging(item)
  }

  function handleDrop(province, event) {
    if (event) {
      event.preventDefault()
    }
    if (!dragging) return

    // Vérifier si la commune appartient à cette province
    const isCorrect = dragging.province && dragging.province[0] === province

    if (isCorrect) {
      soundDropCorrect()
      const rect = event?.currentTarget?.getBoundingClientRect()
      setStarsOrigin(rect ? { x: rect.left + rect.width / 2, y: rect.bottom } : null)

      setProvinces((prev) => ({
        ...prev,
        [province]: [dragging, ...prev[province]],
      }))
      setRemaining((prev) => prev.filter((item) => item.nom_commune !== dragging.nom_commune))
      setShowStars(true)
      setTimeout(() => { setShowStars(false); setStarsOrigin(null) }, 1200)
    } else {
      // Mauvaise province
      soundDropWrong()
      setErrorZone(province)
      setTimeout(() => setErrorZone(null), 600)
      const newLives = lives - 1
      setLives(newLives)
      if (newLives === 0) {
        setTimeout(() => {
          setScreen("lose")
        }, 300)
      }
    }

    setDragging(null)
  }

  const totalCount = communes.length
  const placedCount = totalCount - remaining.length
  const progressPct = totalCount > 0 ? Math.round((placedCount / totalCount) * 100) : 0
  const timeUsed = Math.max(0, 60 - chrono)
  const timeLabel = `${Math.floor(timeUsed / 60)}:${String(timeUsed % 60).padStart(2, "0")}`
  const errors = 3 - lives
  const remainingList = remaining.slice(0, 4).map((c) => c.nom_commune).join(", ") + (remaining.length > 4 ? "..." : "")

  // ÉCRAN DE CHARGEMENT
  if (screen === "loading") {
    return <LoadingScreen onLoadingComplete={() => setScreen("home")} />
  }

  // ÉCRAN D'ACCUEIL
  if (screen === "home") {
    return (
      <div className="screen screen-home fade-in">
        <div className="home-top">
          <div className="home-logo">
            <span className="black">Match</span><span className="orange">AreaNC</span>
          </div>
          <p className="home-tagline">classe les communes !</p>
        </div>

        <div className="home-middle">
          <div className="bubble">
            "Bozu ! Je suis P'tit Kagu.<br />
            Aide-moi à classer les 33 communes de<br />
            Nouvelle-Calédonie dans chaque province"
          </div>
          <div className="kagu-wrapper">
            <DotLottieReact
              src="/kagu-hi.lottie"
              loop
              autoplay
              width={200}
            />
          </div>
        </div>

        <div className="home-bottom">
          <button className="btn btn-solo" onClick={startGame}>
            JOUER SOLO
          </button>
          <button className="btn btn-learn" onClick={() => soundClick()}>
            MODE <span className="highlight">APRENTISSAGE</span>
          </button>
        </div>
        <Footer />
      </div>
    )
  }

  // ÉCRAN DE JEU
  if (screen === "game") {
    return (
      <div className="screen screen-game fade-in">
        <header className="game-header">
          <div className="header-left">
            <button className="back-button" onClick={goHome}>←</button>
          </div>
          <div className="brand">MatchArea<span>NC</span></div>
          <div className="header-right">
            <button className="restart-button" onClick={startGame}>↻</button>
            <div className="hearts">{Array(lives).fill("♥").join("")}</div>
            <div className="timer">{chrono}s</div>
          </div>
        </header>
        <div className="game-container">
        <div className="progress-section">
          <div className="progress-label">PROGRESSION</div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progressPct}%` }} />
          </div>
          <div className="progress-info">{placedCount}/{totalCount}</div>
        </div>

        <div className="mascotte-hint">
          <DotLottieReact
            src="/kagu-hi.lottie"
            loop
            autoplay
            width={50}
          />
          <div className="hint-text">
            {dragging
              ? `Commune sélectionnée : ${dragging.nom_commune}. Touchez une province.`
              : 'Touchez une commune, puis une province pour la déposer.'}
          </div>
        </div>

        <div className="provinces-grid">
          {["province des îles Loyauté", "province Nord", "province Sud"].map((province) => (
            <DropZone
              key={province}
              province={province}
              communes={provinces[province]}
              targetCount={provinceTotals[province]}
              onDrop={handleDrop}
              isError={errorZone === province}
            />
          ))}
        </div>

        {showStars && <Stars origin={starsOrigin} />}   

        <div className="commune-bank">
          <div className="bank-title">GLISSER VERS LE HAUT</div>
          <div className="bank-list">
            {remainingVisible.map((item) => (
              <ItemCard
                key={item.nom_commune}
                item={item}
                onDragStart={handleItemDragStart}
                isSelected={dragging?.nom_commune === item.nom_commune}
              />
            ))}
          </div>
        </div>
        </div>
        <Footer />
      </div>
    )
  }

  // ÉCRAN DE VICTOIRE
  if (screen === "win") {
    return (
      <div className="screen screen-win fade-in">
        <div className="result-card">
          <div className="result-handle" />
          <div className="result-body">
            <div className="mascotte-big result-mascotte">
              <DotLottieReact
                src="/kagu-victoire.lottie"
                loop
                autoplay
                width={160}
              />
            </div>
            <h1 className="result-title">BRAVO !</h1>
            <p className="result-subtitle">tu connais ta NC 🇳🇨</p>
          </div>
          <div className="result-stats">
            <div className="stat-row">
              <span>temps</span>
              <strong>{timeLabel}</strong>
            </div>
            <div className="stat-row">
              <span>erreurs</span>
              <strong>{errors}</strong>
            </div>
            <div className="stat-row">
              <span>étoiles</span>
              <strong>★ ★ ★</strong>
            </div>
          </div>
          <div className="result-actions">
            <button className="btn result-btn result-btn-primary" onClick={startGame}>
              ↻ REJOUER
            </button>
            <button className="btn result-btn result-btn-secondary" onClick={goHome}>
              partager · accueil
            </button>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  // ÉCRAN DE DÉFAITE
  if (screen === "lose") {
    return (
      <div className="screen screen-lose fade-in">
        <div className="result-card">
          <div className="result-handle" />
          <div className="result-body">
            <div className="mascotte-big result-mascotte">
                            <DotLottieReact
                src="/kagu-defaite.lottie"
                loop
                autoplay
                width={160}
              />
            </div>
            <h1 className="result-title">
              {lives === 0 ? "VIES ÉPUISÉES" : "TEMPS ÉCOULÉ"}
            </h1>
            <p className="result-subtitle">
              {lives === 0 ? "reste concentré !" : "presque… réessaie !"}
            </p>
          </div>
          <div className="result-stats">
            <div className="stat-row">
              <span>placées</span>
              <strong>{placedCount} / {totalCount}</strong>
            </div>
            <div className="progress-row">
              <div className="result-progress">
                <div className="result-progress-fill" style={{ width: `${progressPct}%` }} />
              </div>
            </div>
            <div className="remaining-copy">
              il te restait : {remainingList || "Aucune commune restante"}
            </div>
          </div>
          <div className="result-actions">
            <button className="btn result-btn result-btn-primary" onClick={startGame}>
              ↻ RÉESSAYER
            </button>
            <button className="btn result-btn result-btn-secondary" onClick={goHome}>
              ← retour accueil
            </button>
          </div>
        </div>
        <Footer />
      </div>
    )
  }
}
