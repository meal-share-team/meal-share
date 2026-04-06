// Login.tsx
import { useState } from 'react';

export default function Login() {
  // These variables hold the data the user types
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault(); // Prevents the page from refreshing
    
    
    console.log("Trying to log in with:", email, password);
  };

  return (
    <form onSubmit={handleLogin}>
      <h2>Welcome Back to Meal Share</h2>
      
      <input 
        type="email" 
        placeholder="Email" 
        value={email}
        onChange={(e) => setEmail(e.target.value)} 
      />
      
      <input 
        type="password" 
        placeholder="Password" 
        value={password}
        onChange={(e) => setPassword(e.target.value)} 
      />
      
      <button type="submit">Log In</button>
    </form>
  );
}