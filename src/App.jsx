import React, { useEffect, useRef } from 'react'

const COLORS = {
  1: '#FF6B6B', 2: '#4ECDC4', 3: '#FFE66D', 4: '#A8E6CF', 5: '#FF8B94',
  6: '#B8B8FF', 7: '#FFDAC1', 8: '#E2F0CB', 9: '#C7CEEA', 10: '#FF9AA2', 11: '#2E8B57'
}

const RADIUS = {
  1: 12, 2: 14, 3: 16, 4: 18, 5: 20, 6: 22, 7: 24, 8: 26, 9: 28, 10: 30, 11: 35
}

class Fruit {
  constructor(x, y, level) {
    this.x = x
    this.y = y
    this.level = level
    this.vx = 0
    this.vy = 0
    this.radius = RADIUS[level]
    this.isActive = true
    this.createdAt = Date.now()
  }
}

export default function App() {
  const canvasRef = useRef(null)
  const keysRef = useRef({})

  useEffect(() => {
    const handleKeyDown = (e) => {
      keysRef.current[e.key] = true
    }
    const handleKeyUp = (e) => {
      keysRef.current[e.key] = false
    }

    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('keyup', handleKeyUp)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('keyup', handleKeyUp)
    }
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    const gameState = {
      fruits: [],
      score: 0,
      gameOver: false,
      nextLevel: Math.floor(Math.random() * 5) + 1,
      spawnX: 200,
      canSpawn: true
    }

    let animationId

    const gameLoop = () => {
      // Input
      if (keysRef.current['ArrowLeft']) gameState.spawnX = Math.max(20, gameState.spawnX - 5)
      if (keysRef.current['ArrowRight']) gameState.spawnX = Math.min(380, gameState.spawnX + 5)
      if (keysRef.current[' ']) {
        if (gameState.gameOver) {
          gameState.fruits = []
          gameState.score = 0
          gameState.gameOver = false
          gameState.nextLevel = Math.floor(Math.random() * 5) + 1
          gameState.spawnX = 200
          gameState.canSpawn = true
        } else if (gameState.canSpawn) {
          gameState.fruits.push(new Fruit(gameState.spawnX, 50, gameState.nextLevel))
          gameState.nextLevel = Math.floor(Math.random() * 5) + 1
          gameState.canSpawn = false
          setTimeout(() => { gameState.canSpawn = true }, 500)
        }
      }

      // Physics
      for (let f of gameState.fruits) {
        if (!f.isActive) continue
        f.vy += 0.5
        f.vx *= 0.75
        f.y += f.vy
        f.x += f.vx

        if (f.x - f.radius < 20) { f.x = 20 + f.radius; f.vx *= -0.75 }
        if (f.x + f.radius > 380) { f.x = 380 - f.radius; f.vx *= -0.75 }
        if (f.y + f.radius > 600) { f.y = 600 - f.radius; f.vy *= -0.75 }
      }

      // Collisions & Merges
      for (let i = 0; i < gameState.fruits.length; i++) {
        for (let j = i + 1; j < gameState.fruits.length; j++) {
          const f1 = gameState.fruits[i]
          const f2 = gameState.fruits[j]
          if (!f1.isActive || !f2.isActive) continue

          const dx = f2.x - f1.x
          const dy = f2.y - f1.y
          const dist = Math.sqrt(dx * dx + dy * dy)

          if (dist < f1.radius + f2.radius) {
            if (f1.level === f2.level && f1.level < 11) {
              const newLevel = f1.level + 1
              const newFruit = new Fruit((f1.x + f2.x) / 2, (f1.y + f2.y) / 2, newLevel)
              newFruit.vx = (f1.vx + f2.vx) / 2
              newFruit.vy = (f1.vy + f2.vy) / 2
              gameState.fruits.push(newFruit)
              f1.isActive = false
              f2.isActive = false
              gameState.score += Math.pow(2, newLevel) * 10
            } else {
              const angle = Math.atan2(dy, dx)
              const cos = Math.cos(angle)
              f1.vx -= 2 * cos
              f2.vx += 2 * cos
            }
          }
        }
      }

      // Game Over Check
      for (let f of gameState.fruits) {
        if (f.y - f.radius < 50 && Math.abs(f.vy) < 1 && Date.now() - f.createdAt > 2000) {
          gameState.gameOver = true
          break
        }
      }

      gameState.fruits = gameState.fruits.filter(f => f.isActive)

      // Render
      ctx.fillStyle = '#f5f5f5'
      ctx.fillRect(0, 0, 400, 600)

      ctx.strokeStyle = 'rgba(255,0,0,0.3)'
      ctx.setLineDash([5, 5])
      ctx.beginPath()
      ctx.moveTo(0, 50)
      ctx.lineTo(400, 50)
      ctx.stroke()
      ctx.setLineDash([])

      // Draw next fruit preview
      if (!gameState.gameOver) {
        ctx.globalAlpha = 0.5
        ctx.fillStyle = COLORS[gameState.nextLevel]
        ctx.beginPath()
        ctx.arc(gameState.spawnX, 50, RADIUS[gameState.nextLevel], 0, Math.PI * 2)
        ctx.fill()
        ctx.globalAlpha = 1
      }

      // Draw all fruits
      for (let fruit of gameState.fruits) {
        ctx.fillStyle = COLORS[fruit.level]
        ctx.beginPath()
        ctx.arc(fruit.x, fruit.y, fruit.radius, 0, Math.PI * 2)
        ctx.fill()
        ctx.strokeStyle = 'rgba(0,0,0,0.2)'
        ctx.lineWidth = 1
        ctx.stroke()
      }

      // Draw game over overlay
      if (gameState.gameOver) {
        ctx.fillStyle = 'rgba(0,0,0,0.6)'
        ctx.fillRect(0, 0, 400, 600)

        ctx.fillStyle = '#FFFFFF'
        ctx.font = 'bold 36px Arial'
        ctx.textAlign = 'center'
        ctx.fillText('게임 오버', 200, 250)

        ctx.font = '24px Arial'
        ctx.fillText(`점수: ${gameState.score}`, 200, 300)

        ctx.font = '16px Arial'
        ctx.fillText('Space 키로 재시작', 200, 340)
      }

      animationId = requestAnimationFrame(gameLoop)
    }

    animationId = requestAnimationFrame(gameLoop)
    return () => cancelAnimationFrame(animationId)
  }, [])

  return (
    <div className="container">
      <h1>🍎 과일 게임</h1>
      <canvas
        ref={canvasRef}
        width={400}
        height={600}
        style={{
          border: '2px solid #333',
          display: 'block',
          margin: '0 auto',
          background: '#fff',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          cursor: 'pointer'
        }}
      />
      <div className="info">점수: <span className="score" id="score">0</span></div>
      <div className="controls">⬅️ ➡️ 이동 | Space 떨어뜨리기</div>
    </div>
  )
}
