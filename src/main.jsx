import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter as Router } from 'react-router-dom';
import TabUiContext from './hooks/TabUiContext.jsx';
import ShowUiProvider from './hooks/ShowUiContext.jsx';
ReactDOM.createRoot(document.getElementById('root')).render(
        <ShowUiProvider>
                <TabUiContext>
                        <Router>
                                <App />
                        </Router>
                </TabUiContext>
        </ShowUiProvider>
)
