export default function Privacy() {
  return (
    <main className="section">
      <h1>Privacy Policy</h1>
      <p className="muted">Last updated: October 2026</p>
      <br/>
      <h2>1. Information We Collect</h2>
      <p>We only collect the information necessary to fulfill your order. This includes your name, shipping address, email address, and payment information. We do not collect unnecessary personal data.</p>
      <h2>2. How We Use Your Data</h2>
      <p>Your data is used strictly to process your order, ship your jerseys, and provide customer support. We do not sell your data to third parties.</p>
      <h2>3. Third-Party Services</h2>
      <p>We use third-party providers for payment processing (Stripe/Moneris) and shipping. These providers only receive the data necessary to complete your transaction.</p>
      <h2>4. Data Deletion</h2>
      <p>You have the right to request the deletion of your personal data at any time. Please visit our <a href="/data-deletion" style={{color: 'var(--accent)'}}>Data Deletion page</a>.</p>
    </main>
  );
}
