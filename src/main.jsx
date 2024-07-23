import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter as Router } from 'react-router-dom';
import TabUiContext from './hooks/TabUiContext.jsx';
import ShowUiProvider from './hooks/ShowUiContext.jsx';
import UserContext from './hooks/UserContext.jsx';
import CartProvider from './hooks/CartContext.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
 <CartProvider>
     <UserContext>
        <ShowUiProvider>
                <TabUiContext>
                        <Router>
                            <App />
                        </Router>
                </TabUiContext>
        </ShowUiProvider>
      </UserContext>
 </CartProvider>
)
