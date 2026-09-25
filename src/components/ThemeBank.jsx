import React, { useState } from 'react';
import { Search, TrendingUp, Clock, ExternalLink, Newspaper, X, Check, CalendarDays, Pencil, Trash2 } from 'lucide-react';
import DateRangeCalendar from './DateRangeCalendar';
import RecurrenceArea from './RecurrenceArea';

const ThemeBank = () => {
  const [query, setQuery] = useState('');
  const [searchType, setSearchType] = useState(''); 
  const [dateRange, setDateRange] = useState({ start: null, end: null });
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState([]);
  const [filterStatus, setFilterStatus] = useState('pendentes');
  const [showAgendamentos, setShowAgendamentos] = useState(false);

  const mockAgendamentos = [
    { id: 1, title: 'Agendamento - Inteligência Artificial', frequencia: '1 semana', dias: ['S', 'T', 'Q'], termino: 'Nunca' },
    { id: 2, title: 'Agendamento - Direito Tributário', frequencia: '2 semanas', dias: ['D'], termino: '13 ocorrências' }
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsSearching(true);
    
    // Dados de exemplo simulando o retorno de uma IA/API
    setTimeout(() => {
      const mockResults = [
        {
          id: 1,
          title: `Novidades em ${query} impactam o mercado`,
          preview: `Especialistas apontam que as recentes mudanças na área de ${query} vão trazer novos desafios e oportunidades para os profissionais do setor. Acompanhe a análise detalhada.`,
          source: 'Portal de Notícias',
          date: 'Há 2 horas',
          url: '#'
        },
        {
          id: 2,
          title: `O futuro de ${query} nos próximos anos`,
          preview: `Um estudo detalhado mostra as tendências e o que esperar quando o assunto é ${query}. Veja as principais inovações tecnológicas e regulatórias.`,
          source: 'Tech & Inovação',
          date: 'Ontem',
          url: '#'
        },
        {
          id: 3,
          title: `Como ${query} está mudando o comportamento do consumidor`,
          preview: `Entenda como as novas ferramentas e discussões relacionadas a ${query} estão revolucionando a forma como interagimos com os clientes diariamente.`,
          source: 'Business Weekly',
          date: 'Há 3 dias',
          url: '#'
        }
      ];
      setResults(mockResults);
      setIsSearching(false);
    }, 1500);
  };

  return (
    <div className="main-layout-grid" style={{ gridTemplateColumns: '1fr 3fr' }}>
      <div className="form-col-left">
        <div style={{ display: 'flex', alignItems: 'center', height: '38px' }}>
          <h2 className="section-title" style={{ margin: 0 }}>Pesquisa de Temas</h2>
        </div>

        <form onSubmit={handleSearch} className="form-container" style={{ marginTop: '1rem' }}>
          <div className="form-group">
            <input
              type="text"
              className="form-input"
              placeholder="Ex: Inteligência Artificial, Direito Tributário, Marketing..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              required
            />
          </div>

          <div className="form-row" style={{ marginTop: '1rem' }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Tipo de Busca</label>
              <div className="card-grid-3">
                <div 
                  className={`selection-card ${searchType === 'assuntos-em-alta' ? 'selected' : ''}`}
                  onClick={() => setSearchType('assuntos-em-alta')}
                >
                  <TrendingUp size={16} />
                  <span>Em Alta</span>
                </div>
                <div 
                  className={`selection-card ${searchType === 'noticias' ? 'selected' : ''}`}
                  onClick={() => setSearchType('noticias')}
                >
                  <Newspaper size={16} />
                  <span>Notícias</span>
                </div>
                <div 
                  className={`selection-card ${searchType === 'agendada' ? 'selected' : ''}`}
                  onClick={() => setSearchType('agendada')}
                >
                  <CalendarDays size={16} />
                  <span>Agendada</span>
                </div>
              </div>
            </div>
          </div>

          {searchType === 'noticias' && (
            <div className="form-group" style={{ marginTop: '1rem' }}>
              <label className="form-label">Período</label>
              <DateRangeCalendar onRangeChange={setDateRange} />
            </div>
          )}

          {searchType === 'agendada' && (
            <div className="form-group" style={{ marginTop: '1rem' }}>
              <label className="form-label">Recorrência</label>
              <RecurrenceArea />
            </div>
          )}

          <button 
            type="submit" 
            className="btn-primary" 
            style={{ width: '100%', marginTop: '1rem' }}
            disabled={isSearching || !searchType}
          >
            {isSearching ? (searchType === 'agendada' ? 'Criando...' : 'Pesquisando...') : (
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}>
                {searchType === 'agendada' ? <CalendarDays size={16} /> : <Search size={16} />} 
                {searchType === 'agendada' ? 'Criar Agendamento' : 'Pesquisar Temas'}
              </span>
            )}
          </button>
        </form>
      </div>

      <div className="form-col-right">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', minHeight: '38px' }}>
          <h2 className="section-title" style={{ margin: 0 }}>Resultados da Pesquisa</h2>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div className="switch-container">
              <label className="switch-label" htmlFor="agendamentos-switch">Agendamentos</label>
              <label className="switch">
                <input 
                  type="checkbox" 
                  id="agendamentos-switch" 
                  checked={showAgendamentos}
                  onChange={(e) => setShowAgendamentos(e.target.checked)}
                />
                <span className="slider round"></span>
              </label>
            </div>

            <div className="status-filter" style={{ opacity: showAgendamentos ? 0.5 : 1, pointerEvents: showAgendamentos ? 'none' : 'auto' }}>
              <button 
                className={`filter-btn ${filterStatus === 'pendentes' ? 'active' : ''}`}
                onClick={() => setFilterStatus('pendentes')}
              >
                Pendentes
              </button>
              <button 
                className={`filter-btn ${filterStatus === 'aprovados' ? 'active' : ''}`}
                onClick={() => setFilterStatus('aprovados')}
              >
                Aprovados
              </button>
            </div>
          </div>
        </div>
        
        <div className="results-container" style={{ marginTop: '1rem' }}>
          {showAgendamentos && (
            <div className="agendamentos-grid">
              {mockAgendamentos.map(agendamento => (
                <div key={agendamento.id} className="agendamento-card">
                  <div className="agendamento-header">
                    <h3 className="agendamento-title">{agendamento.title}</h3>
                    <div className="theme-card-actions">
                      <button className="theme-action-btn edit" title="Editar"><Pencil size={16} /></button>
                      <button className="theme-action-btn reject" title="Deletar"><Trash2 size={16} /></button>
                    </div>
                  </div>
                  <div className="agendamento-body">
                    <div className="agendamento-detail"><span className="detail-label">Repetir a cada:</span> {agendamento.frequencia}</div>
                    <div className="agendamento-detail"><span className="detail-label">Dias:</span> {agendamento.dias.join(', ')}</div>
                    <div className="agendamento-detail"><span className="detail-label">Termina em:</span> {agendamento.termino}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!showAgendamentos && results.length === 0 && !isSearching && (
            <div className="empty-state">
              <TrendingUp size={32} style={{ color: 'var(--primary-color)', marginBottom: '1rem', opacity: 0.5 }} />
              <p style={{ color: 'var(--text-secondary)' }}>Faça uma pesquisa para ver os resultados aqui.</p>
            </div>
          )}
          
          {!showAgendamentos && isSearching && (
            <div className="loading-state" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '3rem 0', color: 'var(--text-secondary)' }}>
              <div className="spinner" style={{ width: '24px', height: '24px', border: '3px solid rgba(0,0,0,0.1)', borderTopColor: 'var(--primary-color)', borderRadius: '50%', animation: 'spin 1s infinite linear' }}></div>
              <span style={{ marginLeft: '1rem' }}>Buscando...</span>
            </div>
          )}

          {!showAgendamentos && !isSearching && results.length > 0 && (
            <div className="theme-cards">
              {results.map((result) => (
                <div key={result.id} className="theme-card">
                  <div className="theme-card-header">
                    <h3 className="theme-card-title">{result.title}</h3>
                    <div className="theme-card-actions">
                      <button className="theme-action-btn reject" title="Reprovar"><X size={16} /></button>
                      <button className="theme-action-btn approve" title="Aprovar"><Check size={16} /></button>
                    </div>
                  </div>
                  <p className="theme-card-preview">{result.preview}</p>
                  <div className="theme-card-meta">
                    <span className="theme-source">{result.source}</span>
                    <span className="theme-date"><Clock size={12} /> {result.date}</span>
                    <a href={result.url} className="theme-link" target="_blank" rel="noopener noreferrer">
                      Ver fonte <ExternalLink size={12} />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ThemeBank;
