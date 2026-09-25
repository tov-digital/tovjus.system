import React, { useState } from 'react';
import { PanelLeftClose, PanelLeft, FileAudio, Search, FileText, Clapperboard } from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab }) => {
  const [isCollapsed, setIsCollapsed] = useState(true);

  return (
    <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div 
        className="sidebar-header" 
        style={{ display: 'flex', alignItems: 'center' }}
      >
        {!isCollapsed && <span style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-secondary)', marginRight: 'auto', paddingLeft: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Ferramentas</span>}
        <button 
          className="btn-icon sidebar-toggle"
          type="button"
          onClick={() => setIsCollapsed(prev => !prev)}
          title={isCollapsed ? 'Expandir Menu' : 'Recolher Menu'}
        >
          {isCollapsed ? <PanelLeft size={16} /> : <PanelLeftClose size={16} />}
        </button>
      </div>
      <nav className="sidebar-nav">
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
      </nav>
    </aside>
  );
};

export default Sidebar;
