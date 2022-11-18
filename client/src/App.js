import Login from './components/login/Login';
import Dashboard from './components/dashboard/Dashboard'
import With_nav from './components/With_nav/With_nav'
import Without_nav from './components/Without_nav'
import Auth from './components/Auth/Auth'
import Categories from './components/categories/Categories';
import Items from './components/items/Items'
import {
	BrowserRouter as Router,
	Route,
	Routes,
  } from "react-router-dom";

function App() {
  return (
    <div>
        <Router>
          <Routes>
            <Route element={<Auth/>}>
                <Route element={<Without_nav/>}>
                  <Route path="/" element={<Login/>} />
                </Route>

                <Route element={<With_nav/>}>
                  <Route path="/dashboard" element={<Dashboard/>} />
                  <Route path="/categories" element={<Categories/>} />
                  <Route path="/categories/:item" element={<Items/>} />
                </Route>
            </Route>
          </Routes>
        </Router>
          
        
        
      
    </div>
  );
}

export default App;
