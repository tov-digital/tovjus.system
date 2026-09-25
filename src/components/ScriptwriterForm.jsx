import React, { useState } from 'react';
import { Send, Loader2, Image as ImageIcon, Download, Maximize2, X, Sparkles, Plus, Trash2 } from 'lucide-react';
import OutputEditor from './OutputEditor';

const mockApprovedThemes = [
  "A nova regulamentação de I.A. na União Europeia",
  "O impacto da Reforma Tributária para pequenos empreendedores",
  "Tendências de Marketing Digital para 2024"
];

const ScriptwriterForm = ({ onSubmit, isGenerating, output, setOutput }) => {
  const [selectedTheme, setSelectedTheme] = useState('');
  const [customTheme, setCustomTheme] = useState('');
  
  const [prompt, setPrompt] = useState('');
  const [useTextAsBase, setUseTextAsBase] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState(null);

  const [activeModalField, setActiveModalField] = useState(null);

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

  const handleGenerateImage = (e) => {
    e.preventDefault();
    setIsGeneratingImage(true);
    setTimeout(() => {
      setGeneratedImageUrl('https://via.placeholder.com/600x400/0f172a/ffffff?text=Imagem+Gerada');
      setIsGeneratingImage(false);
    }, 2000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalTheme = selectedTheme !== '' ? selectedTheme : customTheme;
    if (!finalTheme.trim()) return;
    onSubmit({ theme: finalTheme, formatoTexto, prompt, useTextAsBase });
  };

  const openModal = (field, e) => {
    if (e) e.preventDefault();
    setActiveModalField(field);
  };

  const closeModal = (e) => {
    if (e) e.preventDefault();
    setActiveModalField(null);
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="main-layout-grid" style={{ gridTemplateColumns: '1fr 2fr' }}>
        <div className="form-col-left" style={{ height: '100%' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <div className="form-group form-group-fill" style={{ marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <label className="form-label" style={{ margin: 0 }}>Tema do roteiro</label>
                  </div>
                  <div className="textarea-wrapper">
                    <textarea 
                      className="form-textarea" 
                      style={{ minHeight: '90px' }}
                      placeholder="Digite o tema do seu roteiro..." 
                      value={customTheme}
                      onChange={(e) => setCustomTheme(e.target.value)}
                      disabled={selectedTheme !== ''}
                    />
                    <button 
                      className="btn-expand" 
                      onClick={(e) => { if(selectedTheme === '') openModal('customTheme', e); }} 
                      title="Expandir área de texto" 
                      type="button"
                      disabled={selectedTheme !== ''}
                    >
                      <Maximize2 size={16} />
                    </button>
                  </div>
                </div>

                <div style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem', marginTop: '-0.25rem', fontWeight: '500' }}>
                  ou
                </div>

                <div className="form-group">
                  <select 
                    className="form-select" 
                    value={selectedTheme} 
                    onChange={(e) => setSelectedTheme(e.target.value)}
                    disabled={customTheme.trim().length > 0}
                  >
                    <option value="">Selecione...</option>
                    {mockApprovedThemes.map(theme => (
                      <option key={theme} value={theme}>{theme}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="panel" style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
              <h3 className="panel-header" style={{ marginBottom: '0.25rem', textAlign: 'center', fontSize: '1.25rem' }}>Geração de Imagem</h3>
              <p style={{ textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1rem', marginTop: 0 }}>Gere uma imagem para acompanhar seu roteiro</p>
              
              <div className="image-preview-area" style={{ 
                flex: 1, 
                backgroundColor: '#f5f5f5', 
                border: '1px dashed var(--border-color)',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem',
                position: 'relative',
                overflow: 'hidden',
                minHeight: '80px'
              }}>
                {generatedImageUrl ? (
                  <>
                    <img src={generatedImageUrl} alt="Imagem gerada" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                    <a 
                      href={generatedImageUrl} 
                      download="imagem_gerada.jpg" 
                      className="btn-primary" 
                      style={{ position: 'absolute', bottom: '0.5rem', right: '0.5rem', padding: '0.5rem', borderRadius: '50%', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }}
                      title="Baixar imagem"
                    >
                      <Download size={16} />
                    </a>
                  </>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: 'var(--text-secondary)', opacity: 0.5 }}>
                    <ImageIcon size={32} style={{ marginBottom: '0.5rem' }} />
                    <span>Espaço da Imagem</span>
                  </div>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Prompt da Imagem</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Escreva o prompt da imagem..." 
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  disabled={useTextAsBase}
                />
              </div>

              <div className="form-group" style={{ flexDirection: 'row', alignItems: 'center', gap: '0.5rem', marginTop: '-0.25rem', marginBottom: '1rem' }}>
                <input 
                  type="checkbox" 
                  id="useTextAsBase" 
                  checked={useTextAsBase}
                  onChange={(e) => setUseTextAsBase(e.target.checked)}
                  style={{ accentColor: 'var(--primary-color)', cursor: 'pointer', width: '14px', height: '14px' }}
                />
                <label htmlFor="useTextAsBase" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                  Usar tema como base
                </label>
              </div>

              <button 
                type="button" 
                className="btn-outline-primary" 
                onClick={handleGenerateImage}
                disabled={isGeneratingImage || (!prompt.trim() && !useTextAsBase)}
                style={{ width: '100%' }}
              >
                {isGeneratingImage ? (
                  <><Loader2 size={16} className="animate-spin" /> Gerando...</>
                ) : (
                  <><Sparkles size={16} /> Gerar Imagem</>
                )}
              </button>
            </div>
          </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', height: '100%' }}>
          <div className="form-group">
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

          <OutputEditor content={output} setContent={setOutput} onExpand={(e) => openModal('output', e)}>
            <button type="submit" className="btn-primary" disabled={isGenerating || (selectedTheme === '' && !customTheme.trim())} style={{ width: '100%', padding: '0.75rem' }}>
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

      {activeModalField && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <span>{activeModalField === 'output' ? 'Output do Roteiro' : 'Tema do Roteiro'}</span>
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
