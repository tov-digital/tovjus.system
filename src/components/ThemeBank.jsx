import React, { useState } from 'react';
import { Search, TrendingUp, Clock, ExternalLink, Newspaper, X, Check, CalendarDays, Pencil, Trash2 } from 'lucide-react';
import { supabase } from '../supabase';
import DateRangeCalendar from './DateRangeCalendar';
import RecurrenceArea from './RecurrenceArea';

const ThemeBank = () => {
  const [query, setQuery] = useState('');
  const [quantity, setQuantity] = useState('');
  const [searchType, setSearchType] = useState(''); 
  const [dateRange, setDateRange] = useState({ start: null, end: null });
  const [recurrence, setRecurrence] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState([]);
  const [filterStatus, setFilterStatus] = useState('pendente');
  const [showAgendamentos, setShowAgendamentos] = useState(false);
  const [deleteCandidateId, setDeleteCandidateId] = useState(null);
  const [resultSearchQuery, setResultSearchQuery] = useState('');
  
  const [agendamentos, setAgendamentos] = useState([]);
  const [editAgendamento, setEditAgendamento] = useState(null);
  const [deleteAgendamentoId, setDeleteAgendamentoId] = useState(null);

  React.useEffect(() => {
    fetchThemes();
  }, [filterStatus]);

  React.useEffect(() => {
    if (showAgendamentos) {
      fetchAgendamentos();
    }
  }, [showAgendamentos]);

  const fetchAgendamentos = async () => {
    try {
      const { data, error } = await supabase
        .from('pesquisador_agendamentos')
        .select('*');
      if (error) throw error;
      setAgendamentos(data || []);
    } catch (error) {
      console.error('Erro ao buscar agendamentos:', error);
    }
  };

  const fetchThemes = async () => {
    try {
      const { data, error } = await supabase
        .from('pesquisador')
        .select('*')
        .eq('status', filterStatus)
        .order('id', { ascending: false });

      if (error) throw error;
      setResults(data || []);
    } catch (error) {
      console.error('Erro ao buscar temas:', error);
    }
  };

  const handleApprove = async (id) => {
    try {
      const { error } = await supabase
        .from('pesquisador')
        .update({ status: 'aprovado' })
        .eq('id', id);
        
      if (error) throw error;
      fetchThemes();
    } catch (error) {
      console.error('Erro ao aprovar:', error);
    }
  };

  const handleReject = (id) => {
    setDeleteCandidateId(id);
  };

  const confirmDelete = async () => {
    if (!deleteCandidateId) return;
    try {
      const { error } = await supabase
        .from('pesquisador')
        .delete()
        .eq('id', deleteCandidateId);
        
      if (error) throw error;
      setDeleteCandidateId(null);
      fetchThemes();
    } catch (error) {
      console.error('Erro ao excluir:', error);
    }
  };

  const confirmDeleteAgendamento = async () => {
    if (!deleteAgendamentoId) return;
    try {
      const { error } = await supabase
        .from('pesquisador_agendamentos')
        .delete()
        .eq('id', deleteAgendamentoId);
        
      if (error) throw error;
      setDeleteAgendamentoId(null);
      fetchAgendamentos();
    } catch (error) {
      console.error('Erro ao excluir agendamento:', error);
    }
  };

  const handleSaveAgendamento = async () => {
    try {
      const payload = {
        tema: editAgendamento.tema,
        dias: editAgendamento.dias,
      };
      
      if ('repetir a cada' in editAgendamento) payload['repetir a cada'] = editAgendamento['repetir a cada'];
      else if ('repetir_a_cada' in editAgendamento) payload['repetir_a_cada'] = editAgendamento['repetir_a_cada'];
      
      if ('termina em' in editAgendamento) payload['termina em'] = editAgendamento['termina em'];
      else if ('termina_em' in editAgendamento) payload['termina_em'] = editAgendamento['termina_em'];

      const { error } = await supabase
        .from('pesquisador_agendamentos')
        .update(payload)
        .eq('id', editAgendamento.id);
        
      if (error) throw error;
      setEditAgendamento(null);
      fetchAgendamentos();
    } catch (error) {
      console.error('Erro ao salvar agendamento:', error);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsSearching(true);

    try {
      let payload = { 
        tema: query,
        quantidade: quantity || 1 
      };
      
      if (searchType === 'assuntos-em-alta') {
        payload.tipo_busca = 'pontual';
        if (dateRange.start) payload.data_inicio = dateRange.start;
        if (dateRange.end) payload.data_fim = dateRange.end;
      } else if (searchType === 'agendada') {
        payload.tipo_busca = 'agendada';
        payload.recorrencia = recurrence;
      }

      await fetch('https://n8n.srv1077266.hstgr.cloud/webhook/pesquisador', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      
      // Atualiza a lista com os novos resultados
      await fetchThemes();
    } catch (error) {
      console.error('Erro ao acionar webhook:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const filteredResults = results.filter(r => 
    r.tema?.toLowerCase().includes(resultSearchQuery.toLowerCase()) || 
    r.resultado?.toLowerCase().includes(resultSearchQuery.toLowerCase())
  );

  const filteredAgendamentos = agendamentos.filter(a => 
    a.tema?.toLowerCase().includes(resultSearchQuery.toLowerCase())
  );

  return (
    <div className="main-layout-grid" style={{ gridTemplateColumns: '1fr 3fr' }}>
      <div className="form-col-left">
        <div style={{ display: 'flex', alignItems: 'center', height: '38px' }}>
          <h2 className="section-title" style={{ margin: 0 }}>Pesquisa de Temas</h2>
        </div>

        <form onSubmit={handleSearch} className="form-container" style={{ marginTop: '1rem' }}>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <div className="form-group" style={{ flex: 1 }}>
              <input
                type="text"
                className="form-input"
                placeholder="Ex: Inteligência Artificial, Direito Tributário, Marketing..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                required
              />
            </div>
            <div className="form-group" style={{ width: '80px' }}>
              <input
                type="number"
                className="form-input"
                placeholder="Qtd."
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
            </div>
          </div>

          <div className="form-row" style={{ marginTop: '1rem' }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Tipo de Busca</label>
              <div className="card-grid">
                <div 
                  className={`selection-card ${searchType === 'assuntos-em-alta' ? 'selected' : ''}`}
                  onClick={() => setSearchType('assuntos-em-alta')}
                >
                  <TrendingUp size={16} />
                  <span>Pontual</span>
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

          {searchType === 'assuntos-em-alta' && (
            <div className="form-group" style={{ marginTop: '1rem' }}>
              <label className="form-label">Período</label>
              <DateRangeCalendar onRangeChange={setDateRange} />
            </div>
          )}

          {searchType === 'agendada' && (
            <div className="form-group" style={{ marginTop: '1rem' }}>
              <label className="form-label">Recorrência</label>
              <RecurrenceArea onChange={setRecurrence} />
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
            <div style={{ position: 'relative', width: '200px' }}>
              <Search size={14} style={{ position: 'absolute', left: '0.5rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
              <input 
                type="text" 
                className="form-input" 
                placeholder="Buscar temas..." 
                value={resultSearchQuery}
                onChange={(e) => setResultSearchQuery(e.target.value)}
                style={{ paddingLeft: '2rem', padding: '0.25rem 0.5rem 0.25rem 2rem', fontSize: '0.85rem', height: '30px' }}
              />
            </div>

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
                className={`filter-btn ${filterStatus === 'pendente' ? 'active' : ''}`}
                onClick={() => setFilterStatus('pendente')}
              >
                Pendentes
              </button>
              <button 
                className={`filter-btn ${filterStatus === 'aprovado' ? 'active' : ''}`}
                onClick={() => setFilterStatus('aprovado')}
              >
                Aprovados
              </button>
            </div>
          </div>
        </div>
        
        <div className="results-container" style={{ marginTop: '1rem' }}>
          {showAgendamentos && (
            <div className="agendamentos-grid">
              {filteredAgendamentos.map(agendamento => (
                <div key={agendamento.id} className="agendamento-card">
                  <div className="agendamento-header">
                    <h3 className="agendamento-title">{agendamento.tema || 'Sem Tema'}</h3>
                    <div className="theme-card-actions">
                      <button className="theme-action-btn edit" title="Editar" onClick={() => setEditAgendamento(agendamento)}><Pencil size={16} /></button>
                      <button className="theme-action-btn reject" title="Deletar" onClick={() => setDeleteAgendamentoId(agendamento.id)}><Trash2 size={16} /></button>
                    </div>
                  </div>
                  <div className="agendamento-body">
                    <div className="agendamento-detail"><span className="detail-label">Repetir a cada:</span> {agendamento['repetir a cada'] || agendamento.repetir_a_cada}</div>
                    <div className="agendamento-detail"><span className="detail-label">Dias:</span> {agendamento.dias}</div>
                    <div className="agendamento-detail"><span className="detail-label">Termina em:</span> {agendamento['termina em'] || agendamento.termina_em}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!showAgendamentos && filteredResults.length === 0 && !isSearching && (
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

          {!showAgendamentos && !isSearching && filteredResults.length > 0 && (
            <div className="theme-cards">
              {filteredResults.map((result) => (
                <div key={result.id} className="theme-card">
                  <div className="theme-card-header">
                    <h3 className="theme-card-title">{result.tema}</h3>
                    <div className="theme-card-actions">
                      <button className="theme-action-btn reject" title="Deletar" onClick={() => handleReject(result.id)}>
                        <X size={16} />
                      </button>
                      {filterStatus !== 'aprovado' && (
                        <button className="theme-action-btn approve" title="Aprovar" onClick={() => handleApprove(result.id)}>
                          <Check size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                  <p className="theme-card-preview">{result.resultado}</p>
                  <div className="theme-card-meta">
                    {result.created_at && (
                      <span className="theme-date" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <Clock size={12} /> Criado em: {new Date(result.created_at).toLocaleDateString('pt-BR')}
                      </span>
                    )}
                    {result.fonte && !result.fonte.startsWith('http') && (
                      <span className="theme-source">{result.fonte}</span>
                    )}
                    {result.fonte && result.fonte.startsWith('http') && (
                      <a href={result.fonte} className="theme-link" target="_blank" rel="noopener noreferrer">
                        Ver fonte <ExternalLink size={12} />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Pop-up de Confirmação de Exclusão */}
      {deleteCandidateId && (
        <div className="modal-overlay" onClick={() => setDeleteCandidateId(null)}>
          <div className="modal-content" style={{ width: '400px', height: 'auto', backgroundColor: '#ffffff', padding: '2rem', textAlign: 'center' }} onClick={e => e.stopPropagation()}>
            <div style={{ marginBottom: '1.5rem', color: '#ef4444' }}>
              <Trash2 size={48} />
            </div>
            <h3 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>Excluir Tema</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', lineHeight: '1.5' }}>
              Tem certeza que deseja excluir este tema?<br />
              Essa ação não pode ser desfeita.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button 
                className="btn-cancel" 
                onClick={() => setDeleteCandidateId(null)}
                style={{ flex: 1, padding: '0.75rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', background: 'transparent', cursor: 'pointer', fontWeight: 500, color: 'var(--text-primary)' }}
              >
                Cancelar
              </button>
              <button 
                className="btn-primary" 
                onClick={confirmDelete}
                style={{ flex: 1, backgroundColor: '#ef4444', border: 'none', borderRadius: 'var(--radius-md)', cursor: 'pointer', color: 'white', fontWeight: 500 }}
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Pop-up de Confirmação de Exclusão de Agendamento */}
      {deleteAgendamentoId && (
        <div className="modal-overlay" onClick={() => setDeleteAgendamentoId(null)}>
          <div className="modal-content" style={{ width: '400px', height: 'auto', backgroundColor: '#ffffff', padding: '2rem', textAlign: 'center' }} onClick={e => e.stopPropagation()}>
            <div style={{ marginBottom: '1.5rem', color: '#ef4444' }}>
              <Trash2 size={48} />
            </div>
            <h3 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>Excluir Agendamento</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', lineHeight: '1.5' }}>
              Tem certeza que deseja excluir este agendamento?<br />
              Essa ação não pode ser desfeita.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button 
                className="btn-cancel" 
                onClick={() => setDeleteAgendamentoId(null)}
                style={{ flex: 1, padding: '0.75rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', background: 'transparent', cursor: 'pointer', fontWeight: 500, color: 'var(--text-primary)' }}
              >
                Cancelar
              </button>
              <button 
                className="btn-primary" 
                onClick={confirmDeleteAgendamento}
                style={{ flex: 1, backgroundColor: '#ef4444', border: 'none', borderRadius: 'var(--radius-md)', cursor: 'pointer', color: 'white', fontWeight: 500 }}
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Edição de Agendamento */}
      {editAgendamento && (
        <div className="modal-overlay" onClick={() => setEditAgendamento(null)}>
          <div className="modal-content" style={{ width: '450px', height: 'auto', backgroundColor: '#ffffff', padding: '2rem' }} onClick={e => e.stopPropagation()}>
            <h3 style={{ marginBottom: '1.5rem', color: 'var(--text-primary)', textAlign: 'center' }}>Editar Agendamento</h3>
            
            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label className="form-label">Tema</label>
              <input type="text" className="form-input" value={editAgendamento.tema || ''} onChange={(e) => setEditAgendamento({...editAgendamento, tema: e.target.value})} />
            </div>

            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label className="form-label">Repetir a cada</label>
              <input type="text" className="form-input" value={editAgendamento['repetir a cada'] || editAgendamento.repetir_a_cada || ''} onChange={(e) => {
                if ('repetir a cada' in editAgendamento) {
                  setEditAgendamento({...editAgendamento, 'repetir a cada': e.target.value});
                } else {
                  setEditAgendamento({...editAgendamento, repetir_a_cada: e.target.value});
                }
              }} />
            </div>

            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label className="form-label">Dias</label>
              <input type="text" className="form-input" value={editAgendamento.dias || ''} onChange={(e) => setEditAgendamento({...editAgendamento, dias: e.target.value})} />
            </div>

            <div className="form-group" style={{ marginBottom: '2rem' }}>
              <label className="form-label">Termina em</label>
              <input type="text" className="form-input" value={editAgendamento['termina em'] || editAgendamento.termina_em || ''} onChange={(e) => {
                if ('termina em' in editAgendamento) {
                  setEditAgendamento({...editAgendamento, 'termina em': e.target.value});
                } else {
                  setEditAgendamento({...editAgendamento, termina_em: e.target.value});
                }
              }} />
            </div>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button className="btn-cancel" onClick={() => setEditAgendamento(null)} style={{ padding: '0.75rem 1.5rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', background: 'transparent', cursor: 'pointer', fontWeight: 500, color: 'var(--text-primary)' }}>
                Cancelar
              </button>
              <button className="btn-primary" onClick={handleSaveAgendamento}>
                Salvar Alterações
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ThemeBank;
