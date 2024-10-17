import { BrowserRouter } from 'react-router-dom';
import Entry from './Entry';

function App() {
  return (
    <div>
      <BrowserRouter>
        <Entry />
      </BrowserRouter>
    </div>
  );
}

export default App;

