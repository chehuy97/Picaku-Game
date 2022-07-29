import logo from './logo.svg';
import './App.css';
import './Game.css'
import Time from './components/Time'
import Table from './components/Table';
import Control from './components/Control';
import { useState } from 'react';

const App = () => {
  const [eventStatus, setEventStatus] = useState('NONE')
  const triggerEvent = (event) => {
    setEventStatus(event)
    setTimeout(() => {
      setEventStatus('NONE')
    }, 200)
  }

  return <div className='root-page'>
      <Time/>
      <Table event={eventStatus}/>
      <Control triggerEvent={triggerEvent}/>
  </div>
}

export default App;
