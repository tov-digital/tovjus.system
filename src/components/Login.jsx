import { useState } from 'react';
import { supabase } from '../supabase';
import { Mail, Lock, Loader2 } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSignUp, setIsSignUp] = useState(false);

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        alert('Verifique seu email para o link de confirmação!');
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <img src="https://images.squarespace-cdn.com/content/v1/66bf66e5f848147d10e0513e/dcc0da02-db0b-4cc9-b3a6-b51f08f0a058/3.png?format=1500w" alt="Logo" className="login-logo" />
          <h2 className="login-title">Bem-vindo</h2>
          <p className="login-subtitle">Faça login para acessar o sistema</p>
        </div>

        <form onSubmit={handleAuth} className="login-form">
          {error && <div className="login-error">{error}</div>}
          
          <div className="form-group">
            <label className="form-label">Email</label>
            <div className="input-with-icon">
              <Mail className="input-icon" size={18} />
              <input 
                type="email" 
                className="form-input with-icon" 
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Senha</label>
            <div className="input-with-icon">
              <Lock className="input-icon" size={18} />
              <input 
                type="password" 
                className="form-input with-icon" 
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="btn-primary login-btn"
            disabled={loading}
          >
            {loading ? <Loader2 size={18} className="spin" /> : (isSignUp ? 'Criar Conta' : 'Entrar')}
          </button>
        </form>

        <div className="login-footer">
          <button 
            type="button" 
            className="text-btn"
            onClick={() => setIsSignUp(!isSignUp)}
          >
            {isSignUp ? 'Já tem uma conta? Entre' : 'Não tem conta? Cadastre-se'}
          </button>
        </div>
      </div>
    </div>
  );
}
