import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter as Router } from 'react-router-dom';
import TabUiContext from './hooks/TabUiContext.jsx';
import ShowUiProvider from './hooks/ShowUiContext.jsx';
import UserContext from './hooks/UserContext.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
            <UserContext>
        <ShowUiProvider>
                <TabUiContext>
                        <Router>
                                <App />
                        </Router>
                </TabUiContext>
        </ShowUiProvider>
            </UserContext>
)
