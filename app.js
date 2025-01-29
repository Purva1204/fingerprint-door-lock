// app.js
document.getElementById('registerBtn').addEventListener('click', async () => {
  const userId = document.getElementById('userId').value;
  
  try {
      const publicKey = getPublicKeyOptions(userId); // Define options for registration
      const credential = await navigator.credentials.create({ publicKey });
      
      const response = await fetch('/register', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({ userId, credential })
      });
      
      const data = await response.json();
      alert(data.message);
  } catch (error) {
      alert('Failed to register fingerprint');
  }
});

document.getElementById('verifyBtn').addEventListener('click', async () => {
  const userId = document.getElementById('userId').value;
  
  try {
      const publicKey = getPublicKeyOptions(userId); // Define options for verification
      const credential = await navigator.credentials.get({ publicKey });
      
      const response = await fetch('/verify', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({ userId, credential })
      });
      
      const data = await response.json();
      alert(data.message);
  } catch (error) {
      alert('Failed to verify fingerprint');
  }
});

function getPublicKeyOptions(userId) {
  // Define public key options based on user ID
  return {
      challenge: new Uint8Array(32),
      rp: { name: "Your Company" },
      user: {
          id: new Uint8Array(16),
          name: userId,
          displayName: userId
      },
      pubKeyCredParams: [{ alg: -7, type: "public-key" }],
      attestation: "direct",
      authenticatorSelection: {
          authenticatorAttachment: "platform",
          requireResidentKey: false,
          userVerification: "preferred"
      }
  };
}