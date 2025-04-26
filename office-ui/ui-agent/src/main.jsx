import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Counter from './Counter.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Counter counterId={1} />
    <Counter counterId={2} />
    <Counter counterId={3} />
  </StrictMode>,
)
