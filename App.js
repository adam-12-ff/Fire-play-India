function App() {
  const appStyle = {
    textAlign: 'center',
    padding: '2rem',
    backgroundColor: '#2d2d2d',
    borderRadius: '12px',
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.3)',
    border: '1px solid #444',
  };

  const headingStyle = {
    fontSize: '2.5rem',
    color: '#A020F0',
    marginBottom: '1rem',
  };
  
  const descriptionStyle = {
    fontSize: '1.2rem',
    color: '#CCCCCC',
  };

  return (
    <div style={appStyle}>
      <h1 style={headingStyle}>🔥 FirePlay</h1>
      <p style={descriptionStyle}>
        A minimal, standalone React app for demos and sharing.
      </p>
    </div>
  );
}
