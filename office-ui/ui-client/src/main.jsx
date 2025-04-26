import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import TicketRequestForm from './TicketRequestForm.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <TicketRequestForm />
  </StrictMode>,
)
