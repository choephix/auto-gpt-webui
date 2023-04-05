import { h, render } from 'preact';
import { Router } from 'preact-router';
import App from './components/app';

const Main = () => (
  <Router>
    <App path='/' />
  </Router>
);

render(<Main />, document.getElementById('root'));
