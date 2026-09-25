import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { X, Loader2 } from 'lucide-react';

export default function UserProfileModal({ isOpen, onClose, userId }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [currentEmail, setCurrentEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (isOpen && userId) {
      loadProfile();
    }
  }, [isOpen, userId]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setEmail(user.email || '');
        setCurrentEmail(user.email || '');
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('name')
        .eq('id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setName(data.name || '');
      }
    } catch (error) {
      console.error('Erro ao carregar perfil:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      // Update Auth (Email/Password)
      const updates = {};
      if (password) updates.password = password;
      if (email && email !== currentEmail) updates.email = email;
      
      if (Object.keys(updates).length > 0) {
        const { error: authError } = await supabase.auth.updateUser(updates);
        if (authError) throw authError;
      }

      // Update Profile (Name)
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({ id: userId, name: name });

      if (profileError) throw profileError;

      setMessage('Perfil atualizado com sucesso!');
      setPassword(''); // Clear password field
      setTimeout(() => onClose(), 2000);
    } catch (error) {
      setMessage(`Erro: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ width: '400px', height: 'auto', padding: '2rem' }} onClick={e => e.stopPropagation()}>
        <div className="modal-header" style={{ marginBottom: '1.5rem' }}>
          <h3>Editar Perfil</h3>
          <button className="btn-icon" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleUpdate} className="login-form">
          {message && (
            <div className={`login-error ${message.includes('Erro') ? '' : 'success'}`} style={{ backgroundColor: message.includes('Erro') ? '#fee2e2' : '#dcfce7', color: message.includes('Erro') ? '#ef4444' : '#22c55e' }}>
              {message}
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Nome</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="Seu nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email</label>
            <input 
              type="email" 
              className="form-input" 
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="off"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Nova Senha (opcional)</label>
            <input 
              type="password" 
              className="form-input" 
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
            />
          </div>

          <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
            <button type="button" className="btn-cancel" onClick={onClose} disabled={loading} style={{ border: 'none', background: 'transparent', padding: '0.75rem', cursor: 'pointer' }}>
              Cancelar
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? <Loader2 size={16} className="spin" /> : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
