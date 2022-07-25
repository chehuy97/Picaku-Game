import logo from './logo.svg';
import './App.css';
import './Game.css'
import Time from './components/time'
import Table from './components/table';

const App = () => {
  return <div className='root-page'>
      <Time/>
      <Table/>
  </div>
}

export default App;
