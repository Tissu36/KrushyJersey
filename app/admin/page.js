export default function Admin() {
  return (
    <main className="section">
      <h1>ADMIN DASHBOARD</h1>
      <p>Welcome to the KrushyJersey admin panel.</p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '40px' }}>
        <div style={{ background: 'var(--card)', padding: '30px', borderRadius: '8px' }}>
          <h3>Inventory</h3>
          <p style={{ color: 'var(--muted)' }}>Manage your 16,000+ products.</p>
          <button className="buy" style={{ marginTop: '20px' }}>Coming Soon</button>
        </div>
        <div style={{ background: 'var(--card)', padding: '30px', borderRadius: '8px' }}>
          <h3>Orders</h3>
          <p style={{ color: 'var(--muted)' }}>View and fulfill customer orders.</p>
          <button className="buy" style={{ marginTop: '20px' }}>Coming Soon</button>
        </div>
      </div>
    </main>
  );
}
