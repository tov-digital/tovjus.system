import React, { useState } from 'react';
import { Send, Loader2, Image as ImageIcon, Download, Maximize2, X, Sparkles, Plus, Trash2, Search } from 'lucide-react';
import OutputEditor from './OutputEditor';
import { supabase } from '../supabase';


const ScriptwriterForm = ({ onSubmit, isGenerating, output, setOutput }) => {
  const [customTheme, setCustomTheme] = useState('');
  
  const [prompt, setPrompt] = useState('');
  const [useTextAsBase, setUseTextAsBase] = useState(false);

  const [activeModalField, setActiveModalField] = useState(null);
  const [approvedThemes, setApprovedThemes] = useState([]);
  const [isLoadingThemes, setIsLoadingThemes] = useState(false);
  const [themeSearchQuery, setThemeSearchQuery] = useState('');

  const [formatoTexto, setFormatoTexto] = useState('Texto Longo');
  const [fieldOptions, setFieldOptions] = useState({
    formatoTexto: ['Texto Longo', 'Texto Curto', 'Reels', 'Carrossel']
  });
  const [manageOptionsModal, setManageOptionsModal] = useState(null);
  const [newOptionText, setNewOptionText] = useState('');
  
  const fieldLabels = {
    formatoTexto: 'Formato de Texto'
  };

  const handleAddOption = (e) => {
    e.preventDefault();
    if (!newOptionText.trim() || !manageOptionsModal) return;
    setFieldOptions(prev => ({
      ...prev,
      [manageOptionsModal]: [...prev[manageOptionsModal], newOptionText.trim()]
    }));
    setNewOptionText('');
  };

  const handleDeleteOption = (optionToDelete) => {
    if (!manageOptionsModal) return;
    setFieldOptions(prev => ({
      ...prev,
      [manageOptionsModal]: prev[manageOptionsModal].filter(opt => opt !== optionToDelete)
    }));
    
    if (manageOptionsModal === 'formatoTexto' && formatoTexto === optionToDelete) {
      const remainingOptions = fieldOptions[manageOptionsModal].filter(opt => opt !== optionToDelete);
      setFormatoTexto(remainingOptions.length > 0 ? remainingOptions[0] : '');
    }
  };



  const handleSubmit = (e) => {
    e.preventDefault();
    if (!customTheme.trim()) return;
    onSubmit({ theme: customTheme, formatoTexto, prompt, useTextAsBase });
  };

  const openModal = (field, e) => {
    if (e) e.preventDefault();
    setActiveModalField(field);
  };

  const openThemeSelector = async (e) => {
    if (e) e.preventDefault();
    setActiveModalField('themeSelector');
    setIsLoadingThemes(true);
    try {
      const { data, error } = await supabase
        .from('pesquisador')
        .select('*')
        .eq('status', 'aprovado')
        .order('id', { ascending: false });
      
      if (error) throw error;
      setApprovedThemes(data || []);
    } catch (error) {
      console.error('Erro ao buscar temas:', error);
    } finally {
      setIsLoadingThemes(false);
    }
  };

  const closeModal = (e) => {
    if (e) e.preventDefault();
    setActiveModalField(null);
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="main-layout-grid" style={{ gridTemplateColumns: '1fr 2fr' }}>
        <div className="form-col-left" style={{ height: '100%' }}>
            <div className="panel" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <label className="form-label" htmlFor="formatoTexto" style={{ margin: 0 }}>Formato de Texto</label>
                  <button type="button" className="btn-icon" style={{ padding: '2px', opacity: 0.5 }} onClick={() => setManageOptionsModal('formatoTexto')} title="Gerenciar opções">
                    <Plus size={14} />
                  </button>
                </div>
                <select 
                  id="formatoTexto" 
                  className="form-select" 
                  value={formatoTexto} 
                  onChange={(e) => setFormatoTexto(e.target.value)}
                >
                  {fieldOptions.formatoTexto.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>

              <div>
                <div className="form-group form-group-fill" style={{ marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <label className="form-label" style={{ margin: 0 }}>Tema</label>
                    <button type="button" onClick={openThemeSelector} style={{ background: 'none', border: 'none', color: 'var(--primary-color)', fontSize: '0.85rem', cursor: 'pointer', padding: 0, fontWeight: '500', textDecoration: 'underline' }}>Escolher...</button>
                  </div>
                  <div className="textarea-wrapper">
                    <textarea 
                      className="form-textarea" 
                      style={{ minHeight: '90px' }}
                      placeholder="Digite o tema do seu roteiro..." 
                      value={customTheme}
                      onChange={(e) => setCustomTheme(e.target.value)}
                    />
                    <button 
                      className="btn-expand" 
                      onClick={(e) => openModal('customTheme', e)} 
                      title="Expandir área de texto" 
                      type="button"
                      style={{ bottom: '6px', right: '6px' }}
                    >
                      <Maximize2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>


          </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', height: '100%' }}>
          <OutputEditor content={output} setContent={setOutput} onExpand={(e) => openModal('output', e)}>
            <button type="submit" className="btn-primary" disabled={isGenerating || !customTheme.trim()} style={{ width: '100%', padding: '0.75rem' }}>
              {isGenerating ? (
                <>
                  <Loader2 className="animate-spin" size={16} />
                  Gerando Roteiro...
                </>
              ) : (
                <>
                  <Send size={16} />
                  Gerar Roteiro
                </>
              )}
            </button>
          </OutputEditor>
        </div>
      </form>

      {(activeModalField === 'output' || activeModalField === 'customTheme') && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <span>{activeModalField === 'output' ? 'Output do Roteiro' : 'Tema'}</span>
              <button className="btn-icon" onClick={closeModal} type="button">
                <X size={16} />
              </button>
            </div>
            <textarea
              className="modal-textarea"
              placeholder={activeModalField === 'output' ? 'Edite o roteiro...' : 'Digite o tema do seu roteiro...'}
              value={activeModalField === 'output' ? output : customTheme}
              onChange={(e) => activeModalField === 'output' ? setOutput(e.target.value) : setCustomTheme(e.target.value)}
              autoFocus
            />
          </div>
        </div>
      )}

      {activeModalField === 'themeSelector' && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" style={{ maxWidth: '600px', height: '80vh', display: 'flex', flexDirection: 'column', backgroundColor: '#ffffff' }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <span>Escolher Tema Aprovado</span>
              <button className="btn-icon" onClick={closeModal} type="button">
                <X size={16} />
              </button>
            </div>
            
            <div style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)' }}>
              <div style={{ position: 'relative' }}>
                <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Buscar tema aprovado..." 
                  value={themeSearchQuery}
                  onChange={(e) => setThemeSearchQuery(e.target.value)}
                  style={{ paddingLeft: '2.5rem' }}
                />
              </div>
            </div>
            
            <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', backgroundColor: '#f8fafc' }}>
              {isLoadingThemes ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
                  <Loader2 className="animate-spin" size={24} />
                </div>
              ) : (
                approvedThemes
                  .filter(t => t.tema.toLowerCase().includes(themeSearchQuery.toLowerCase()) || (t.resultado && t.resultado.toLowerCase().includes(themeSearchQuery.toLowerCase())))
                  .map(theme => (
                  <div 
                    key={theme.id} 
                    className="theme-card" 
                    style={{ cursor: 'pointer', padding: '1rem', backgroundColor: '#ffffff' }}
                    onClick={() => {
                      setCustomTheme(`Tema: ${theme.tema}\n\nDescrição: ${theme.resultado || ''}`);
                      closeModal();
                    }}
                  >
                    <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--primary-color)' }}>{theme.tema}</h4>
                    {theme.resultado && <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{theme.resultado}</p>}
                  </div>
                ))
              )}
              
              {!isLoadingThemes && approvedThemes.length === 0 && (
                <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
                  Nenhum tema aprovado encontrado.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {manageOptionsModal && (
        <div className="modal-overlay" onClick={() => setManageOptionsModal(null)}>
          <div className="modal-content" style={{ maxWidth: '400px', height: 'auto', maxHeight: '80vh' }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <span>Gerenciar Opções: {fieldLabels[manageOptionsModal]}</span>
              <button className="btn-icon" onClick={() => setManageOptionsModal(null)} type="button">
                <X size={16} />
              </button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', overflowY: 'auto', flex: 1, padding: '0.25rem' }}>
              {fieldOptions[manageOptionsModal].map(opt => (
                <div key={opt} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem', backgroundColor: 'var(--background-color)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                  <span style={{ fontSize: '0.9rem' }}>{opt}</span>
                  <button type="button" className="btn-icon" style={{ padding: '4px', opacity: 0.7 }} onClick={() => handleDeleteOption(opt)} title="Excluir">
                    <Trash2 size={14} color="#ef4444" />
                  </button>
                </div>
              ))}
            </div>

            <form onSubmit={handleAddOption} style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
              <input 
                type="text" 
                className="form-input" 
                placeholder="Nova opção..." 
                value={newOptionText}
                onChange={(e) => setNewOptionText(e.target.value)}
                style={{ flex: 1 }}
              />
              <button type="submit" className="btn-primary" style={{ padding: '0.5rem', height: 'auto' }} disabled={!newOptionText.trim()}>
                <Plus size={16} />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default ScriptwriterForm;
