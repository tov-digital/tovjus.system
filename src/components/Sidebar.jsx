import React, { useState, useEffect } from 'react';
import { PanelLeftClose, PanelLeft, FileAudio, Search, FileText, Clapperboard, LogOut, ChevronLeft, Target, Home } from 'lucide-react';
import { supabase } from '../supabase';
import UserProfileModal from './UserProfileModal';

const Sidebar = ({ activeTab, setActiveTab }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [currentMenu, setCurrentMenu] = useState('marketing');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [user, setUser] = useState({ id: null, email: '', name: '' });

  useEffect(() => {
    fetchUser();
    
    // Subscribe to auth state changes just in case
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      fetchUser();
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      const email = session.user.email;
      const id = session.user.id;
      
      // Try to fetch name from profiles
      const { data } = await supabase.from('profiles').select('name').eq('id', id).single();
      const name = data?.name || '';
      
      setUser({ id, email, name });
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div 
        className="sidebar-header" 
        style={{ display: 'flex', alignItems: 'center', justifyContent: isCollapsed ? 'center' : 'space-between', paddingLeft: isCollapsed ? '0' : '0.25rem', position: 'relative', zIndex: 50 }}
      >
        {!isCollapsed && (
          <div style={{ padding: '0.25rem', display: 'flex', alignItems: 'center', color: 'var(--text-secondary)' }}>
            {currentMenu === 'home' ? (
              <Home size={18} />
            ) : (
              <button 
                className="btn-icon" 
                onClick={() => setCurrentMenu('home')}
                style={{ padding: '0' }}
              >
                <ChevronLeft size={18} />
              </button>
            )}
          </div>
        )}
        
        {!isCollapsed && (
          <span style={{ 
            fontWeight: 600, 
            fontSize: '0.85rem', 
            color: 'var(--text-secondary)', 
            textTransform: 'uppercase', 
            letterSpacing: '0.05em',
            flex: 1,
            textAlign: 'center',
            pointerEvents: 'none',
            marginLeft: currentMenu === 'home' ? '0' : '-18px' /* Adjust center offset for back button */
          }}>
            {currentMenu === 'home' ? 'Home' : 'Marketing'}
          </span>
        )}
        
        <button 
          className="btn-icon sidebar-toggle"
          type="button"
          onClick={() => setIsCollapsed(prev => !prev)}
          title={isCollapsed ? 'Expandir Menu' : 'Recolher Menu'}
        >
          <PanelLeft size={16} />
        </button>
      </div>

      <nav className="sidebar-nav">
        {currentMenu === 'home' ? (
          <a 
            href="#" 
            className="sidebar-link" 
            onClick={(e) => { e.preventDefault(); setCurrentMenu('marketing'); }}
          >
            <Target size={16} />
            {!isCollapsed && <span>Marketing</span>}
          </a>
        ) : (
          <>
            <a 
              href="#" 
              className={`sidebar-link ${activeTab === 'pesquisador' ? 'active' : ''}`} 
              title="Pesquisador"
              onClick={(e) => { e.preventDefault(); setActiveTab('pesquisador'); }}
            >
              <Search size={16} />
              {!isCollapsed && <span>Pesquisador</span>}
            </a>
            <a 
              href="#" 
              className={`sidebar-link ${activeTab === 'redator' ? 'active' : ''}`} 
              title="Redator"
              onClick={(e) => { e.preventDefault(); setActiveTab('redator'); }}
            >
              <FileText size={16} />
              {!isCollapsed && <span>Redator</span>}
            </a>
            <a 
              href="#" 
              className={`sidebar-link ${activeTab === 'transcritor' ? 'active' : ''}`} 
              title="Transcritor"
              onClick={(e) => { e.preventDefault(); setActiveTab('transcritor'); }}
            >
              <FileAudio size={16} />
              {!isCollapsed && <span>Transcritor</span>}
            </a>
            <a 
              href="#" 
              className={`sidebar-link ${activeTab === 'roteirista' ? 'active' : ''}`} 
              title="Roteirista"
              onClick={(e) => { e.preventDefault(); setActiveTab('roteirista'); }}
            >
              <Clapperboard size={16} />
              {!isCollapsed && <span>Roteirista</span>}
            </a>
          </>
        )}
      </nav>
      
      <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column' }}>
        
        {/* User Avatar Button */}
        <div style={{ paddingBottom: '1rem', display: 'flex', justifyContent: 'center' }}>
          <button 
            onClick={() => setIsModalOpen(true)}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.75rem', 
              padding: '0.5rem', 
              background: 'transparent', 
              border: 'none', 
              cursor: 'pointer',
              borderRadius: 'var(--radius-sm)',
              transition: 'background-color 0.2s',
              justifyContent: 'center',
              width: isCollapsed ? 'auto' : '100%'
            }}
            className="user-profile-btn"
            title="Editar Perfil"
          >
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: 'var(--surface-color)',
              border: '1px solid var(--border-color)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: '600',
              color: 'var(--primary-color)',
              fontSize: '14px',
              flexShrink: 0
            }}>
              {user.name ? user.name.charAt(0).toUpperCase() : (user.email ? user.email.charAt(0).toUpperCase() : '?')}
            </div>
            {!isCollapsed && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', overflow: 'hidden' }}>
                <span style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-primary)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden', maxWidth: '130px' }}>
                  {user.name || 'Administrador'}
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden', maxWidth: '130px' }}>
                  {user.email}
                </span>
              </div>
            )}
          </button>
        </div>

        {/* Logout Button */}
        <div style={{ paddingTop: '1rem', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'center' }}>
          <a 
            href="#" 
            className="sidebar-link" 
            title="Sair"
            onClick={(e) => { e.preventDefault(); handleLogout(); }}
            style={{ color: 'var(--primary-color)', justifyContent: 'center', width: '100%' }}
          >
            <LogOut size={16} />
            {!isCollapsed && <span style={{ fontWeight: 500 }}>Sair</span>}
          </a>
        </div>
      </div>

      <UserProfileModal 
        isOpen={isModalOpen} 
        onClose={() => {
          setIsModalOpen(false);
          fetchUser(); // Refresh user info when modal closes
        }} 
        userId={user.id} 
      />
    </aside>
  );
};

export default Sidebar;
