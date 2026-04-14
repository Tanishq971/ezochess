import { Route, Routes } from 'react-router-dom'
import Game from './Game'
import GameRoom from './GameRoom'
import { useEffect } from 'react'

function App() {

  useEffect(()=>{
    document.title = 'PackingChess'
  } , [])

  return (
    <div className='bg-green-100'>
      <Routes >
        <Route path="" element={<Game />} />
        <Route path="game">
          <Route path=":id" element={<GameRoom />} />
        </Route>
      </Routes>
    </div>
  )
}

export default App
