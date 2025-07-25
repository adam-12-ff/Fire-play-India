// This file finds the 'root' div and renders the <App /> component inside it.
const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);
root.render(<App />);
