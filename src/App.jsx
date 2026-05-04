import { useEffect, useState } from "react"
import { ItemCard } from "./components/ItemCard"
import { useCommunes } from "./hooks/useCommunes"
import { DropZone } from "./components/DropZone"
import { DotLottieReact } from "@lottiefiles/dotlottie-react"
import Stars from "./components/Stars"

const provinceTotals = {
  "province Sud": 14,
  "province Nord": 17,
  "province des îles Loyauté": 3,
}

export default function App() {
  const [screen, setScreen] = useState("home") // home, game, win, lose
  const [lives, setLives] = useState(3)
  const [dragging, setDragging] = useState(null)
  const communes = useCommunes()
  const [provinces, setProvinces] = useState({
    "province Sud": [],
    "province Nord": [],
    "province des îles Loyauté": [],
  })
  const [remaining, setRemaining] = useState([])
  const [remainingVisible, setRemainingVisible] = useState([])
  const [chrono, setChrono] = useState(60)
  const [showStars, setShowStars] = useState(false)

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
    setRemainingVisible(remaining.slice(0, 7))
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

  function startGame() {
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

  function handleDrop(province) {
    if (!dragging) return

    // Vérifier si la commune appartient à cette province
    const isCorrect = dragging.province && dragging.province[0] === province

    if (isCorrect) {
      // Bonne province
      setProvinces((prev) => ({
        ...prev,
        [province]: [...prev[province], dragging],
      }))
      setRemaining((prev) => prev.filter((item) => item.nom_commune !== dragging.nom_commune))
      setShowStars(true)
      setTimeout(() => setShowStars(false), 900)
    } else {
      // Mauvaise province
      const newLives = lives - 1
      setLives(newLives)
      if (newLives === 0) {
        setScreen("lose")
      }
    }

    setDragging(null)
  }

  const totalCount = communes.length
  const placedCount = totalCount - remaining.length
  const progressPct = totalCount > 0 ? Math.round((placedCount / totalCount) * 100) : 0

  // ÉCRAN D'ACCUEIL
  if (screen === "home") {
    return (
      <div className="screen screen-home">
        <div className="home-content">
          <h1 className="home-title">MatchArea<span>NC</span></h1>
          <p className="home-subtitle">classe les communes !</p>
          <div className="home-mascotte">
            <DotLottieReact
              src="src/assets/kagu-hi.lottie"
              loop
              autoplay
              width={200}
            />
          </div>
          <p className="home-text">
            "Bozu ! Je suis P'tit Kagu. Aide-moi à classer les 33 communes de Nouvelle-Calédonie dans chaque province"
          </p>
          <div className="home-buttons">
            <button className="btn btn-primary" onClick={startGame}>
              JOUER SOLO
            </button>
            <button className="btn btn-secondary">MODE APPRENTISSAGE</button>
          </div>
        </div>
      </div>
    )
  }

  // ÉCRAN DE JEU
  if (screen === "game") {
    return (
      <div className="screen screen-game">
        <header className="game-header">
          <button className="back-button">←</button>
          <div className="brand">MatchArea<span>NC</span></div>
          <div className="header-right">
            <div className="hearts">{Array(lives).fill("❤️").join("")}</div>
            <div className="timer">{chrono}s</div>
          </div>
        </header>

        <div className="progress-section">
          <div className="progress-label">PROGRESSION</div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progressPct}%` }} />
          </div>
          <div className="progress-info">{placedCount}/{totalCount}</div>
        </div>

        <div className="mascotte-hint">
          <DotLottieReact
            src="src/assets/kagu-hi.lottie"
            loop
            autoplay
            width={50}
          />
          <div className="hint-text">Déplace la commune dans la bonne province.</div>
        </div>

        <div className="provinces-grid">
          {["province des îles Loyauté", "province Nord", "province Sud"].map((province) => (
            <DropZone
              key={province}
              province={province}
              communes={provinces[province]}
              targetCount={provinceTotals[province]}
              onDrop={handleDrop}
            />
          ))}
        </div>

        <div className="commune-bank">
          <div className="bank-title">GLISSER VERS LE HAUT</div>
          <div className="bank-list">
            {remainingVisible.map((item) => (
              <ItemCard key={item.nom_commune} item={item} onDragStart={setDragging} />
            ))}
          </div>
        </div>

        {showStars && <Stars />}
      </div>
    )
  }

  // ÉCRAN DE VICTOIRE
  if (screen === "win") {
    return (
      <div className="screen screen-win">
        <div className="result-content">
          <h1 className="result-title">Bravo ! 🎉</h1>
          <p className="result-subtitle">Tu as classé toutes les communes !</p>
          <div className="mascotte-big">
            <DotLottieReact
              src="src/assets/kagu-victoire.lottie"
              loop
              autoplay
              width={300}
            />
          </div>
          <button className="btn btn-primary" onClick={() => setScreen("home")}>
            REJOUER
          </button>
        </div>
      </div>
    )
  }

  // ÉCRAN DE DÉFAITE
  if (screen === "lose") {
    return (
      <div className="screen screen-lose">
        <div className="result-content">
          <h1 className="result-title">Game Over 😢</h1>
          <p className="result-subtitle">
            {lives === 0 ? "Tu as perdu toutes tes vies !" : "Le temps est écoulé !"}
          </p>
          <div className="mascotte-big">
            <DotLottieReact
              src="src/assets/kagu-hi.lottie"
              loop
              autoplay
              width={300}
            />
          </div>
          <button className="btn btn-primary" onClick={() => setScreen("home")}>
            RÉESSAYER
          </button>
        </div>
      </div>
    )
  }
}
