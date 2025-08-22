import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/index.css';
import reportWebVitals from './reportWebVitals';

import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();

// --- barrel exports ---
export { default as App } from './App';
export { default as Post } from './components/Post';
export { default as GroupTab } from './components/GroupTab';
export { default as PollBox } from './components/PollBox';
export { default as Login } from './pages/Login';
export { default as HomeScreen } from './pages/Home';
export { default as SuggestedBox } from './components/SuggestedBox';
export { default as NavBar } from './components/NavBar';
export { default as UserInfo } from './components/UserInfo';
export { default as ScreenTab } from './components/ScreenTab';
export { default as ScreenTabGroup } from './components/ScreenTabGroup';
export { default as GroupSearch } from './components/GroupSearch';
export { default as CreateAccount } from './pages/CreateAccount';
export { default as Group } from './pages/Group';
export {default as CreatePost} from './components/CreatePost';
export { default as JoinGroup } from './components/JoinGroup';
