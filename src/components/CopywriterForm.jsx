import React, { useState } from 'react';
import { Send, Loader2, Maximize2, X, Film, Image as ImageIcon, Layers, Smartphone, Plus, Trash2 } from 'lucide-react';
import OutputEditor from './OutputEditor';

const CopywriterForm = ({ onSubmit, isGenerating, output, setOutput, sharedInput }) => {
  const [activeModalField, setActiveModalField] = useState(null);
  const [fieldOptions, setFieldOptions] = useState({
    genero: ['Artigo', 'Post Redes Sociais', 'Email Marketing', 'Roteiro', 'Anúncio'],
    formato: ['Blog Post', 'Carrossel', 'Reels/TikTok', 'Texto Longo', 'Texto Curto'],
    tom: ['Profissional', 'Descontraído', 'Autoridade', 'Empático', 'Inspirador'],
    cta: ['Assinar Newsletter', 'Comprar Agora', 'Saiba Mais', 'Comentar/Compartilhar', 'Entrar em Contato']
  });
  const [manageOptionsModal, setManageOptionsModal] = useState(null);
  const [newOptionText, setNewOptionText] = useState('');

  const fieldLabels = {
    genero: 'Gênero',
    formato: 'Formato',
    tom: 'Tom de Voz',
    cta: 'Call to Action'
  };

  const [formData, setFormData] = useState({
    inputContent: '',
    genero: 'Artigo',
    tipo: '',
    formato: 'Blog Post',
    tom: 'Profissional',
    estrutura: 'AIDA',
    cta: 'Assinar Newsletter',
    descricao: ''
  });

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
    
    if (formData[manageOptionsModal] === optionToDelete) {
      const remainingOptions = fieldOptions[manageOptionsModal].filter(opt => opt !== optionToDelete);
      setFormData(prev => ({
        ...prev,
        [manageOptionsModal]: remainingOptions.length > 0 ? remainingOptions[0] : ''
      }));
    }
  };

  React.useEffect(() => {
    if (sharedInput) {
      setFormData(prev => ({ ...prev, inputContent: sharedInput }));
    }
  }, [sharedInput]);

  const handleCardSelect = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.inputContent.trim() === '') return;
    onSubmit(formData);
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
      <form onSubmit={handleSubmit} className="main-layout-grid">
        <div className="form-layout">
          {/* Coluna Esquerda: Input e Instruções */}
        <div className="form-col-left">
          {/* Panel 1: Input */}
          <div className="panel panel-input">
            <div className="form-group form-group-fill">
              <div style={{ display: 'flex', alignItems: 'center', height: '32px', marginBottom: '0.35rem' }}>
                <label className="form-label" htmlFor="inputContent" style={{ margin: 0 }}>Input</label>
              </div>
              <div className="textarea-wrapper">
                <textarea
                  id="inputContent"
                  name="inputContent"
                  className="form-textarea"
                  placeholder="Cole o texto, transcrição ou informações base aqui..."
                  value={formData.inputContent}
                  onChange={handleChange}
                  required
                />
                <button className="btn-expand" onClick={(e) => openModal('inputContent', e)} title="Expandir área de texto" type="button">
                  <Maximize2 size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Coluna Direita: Tipo, Parâmetros e Botão */}
        <div className="form-col-right panel">
          {/* Panel 2: Tipo */}
          <div className="form-group">
            <label className="form-label">Tipo</label>
            <div className="card-grid">
              {[
                { id: 'Reel', icon: Film, label: 'Reel' },
                { id: 'Estático', icon: ImageIcon, label: 'Estático' },
                { id: 'Carrossel', icon: Layers, label: 'Carrossel' },
                { id: 'Storie', icon: Smartphone, label: 'Storie' }
              ].map(item => {
                const Icon = item.icon;
                return (
                  <div 
                    key={item.id} 
                    className={`selection-card ${formData.tipo === item.id ? 'selected' : ''}`}
                    onClick={() => handleCardSelect('tipo', item.id)}
                  >
                    <Icon size={16} />
                    <span>{item.label}</span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Panel 3: Parâmetros / Dropdowns */}
          <div className="select-grid" style={{ marginBottom: '1.5rem' }}>
            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label className="form-label" htmlFor="genero">Gênero</label>
                <button type="button" className="btn-icon" style={{ padding: '2px', opacity: 0.5 }} onClick={() => setManageOptionsModal('genero')} title="Gerenciar opções">
                  <Plus size={14} />
                </button>
              </div>
              <select id="genero" name="genero" className="form-select" value={formData.genero} onChange={handleChange}>
                {fieldOptions.genero.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            </div>

            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label className="form-label" htmlFor="formato">Formato</label>
                <button type="button" className="btn-icon" style={{ padding: '2px', opacity: 0.5 }} onClick={() => setManageOptionsModal('formato')} title="Gerenciar opções">
                  <Plus size={14} />
                </button>
              </div>
              <select id="formato" name="formato" className="form-select" value={formData.formato} onChange={handleChange}>
                {fieldOptions.formato.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            </div>

            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label className="form-label" htmlFor="tom">Tom de Voz</label>
                <button type="button" className="btn-icon" style={{ padding: '2px', opacity: 0.5 }} onClick={() => setManageOptionsModal('tom')} title="Gerenciar opções">
                  <Plus size={14} />
                </button>
              </div>
              <select id="tom" name="tom" className="form-select" value={formData.tom} onChange={handleChange}>
                {fieldOptions.tom.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            </div>

            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label className="form-label" htmlFor="cta">Call to Action</label>
                <button type="button" className="btn-icon" style={{ padding: '2px', opacity: 0.5 }} onClick={() => setManageOptionsModal('cta')} title="Gerenciar opções">
                  <Plus size={14} />
                </button>
              </div>
              <select id="cta" name="cta" className="form-select" value={formData.cta} onChange={handleChange}>
                {fieldOptions.cta.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            </div>
          </div>

          {/* Panel 4: Instruções Adicionais */}
          <div className="panel-instructions" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <div className="form-group form-group-fill" style={{ flex: 1, marginBottom: '1rem' }}>
              <label className="form-label" htmlFor="descricao">Instruções Adicionais</label>
              <div className="textarea-wrapper" style={{ flex: 1 }}>
                <textarea
                  id="descricao"
                  name="descricao"
                  className="form-textarea"
                  style={{ flex: 1, resize: 'none', height: '100%' }}
                  placeholder="Ex: Focar em palavras-chave específicas, incluir emojis, etc."
                  value={formData.descricao}
                  onChange={handleChange}
                />
                <button className="btn-expand" onClick={(e) => openModal('descricao', e)} title="Expandir área de texto" type="button">
                  <Maximize2 size={16} />
                </button>
              </div>
            </div>

            <button type="submit" className="btn-primary" disabled={isGenerating || formData.inputContent.trim() === ''} style={{ width: '100%' }}>
              {isGenerating ? (
                <>
                  <Loader2 className="animate-spin" size={16} />
                  Gerando Conteúdo...
                </>
              ) : (
                <>
                  <Send size={16} />
                  Gerar Conteúdo
                </>
              )}
            </button>
          </div>

        </div>
        </div>
        <OutputEditor content={output} setContent={setOutput} onExpand={(e) => openModal('output', e)} />
      </form>

    {activeModalField && (
      <div className="modal-overlay" onClick={closeModal}>
        <div className="modal-content" onClick={e => e.stopPropagation()}>
          <div className="modal-header">
            <span>{activeModalField === 'output' ? 'Output' : (activeModalField === 'inputContent' ? 'Input' : 'Instruções Adicionais')}</span>
            <button className="btn-icon" onClick={closeModal} type="button">
              <X size={16} />
            </button>
          </div>
          <textarea
            className="modal-textarea"
            name={activeModalField}
            placeholder={activeModalField === 'output' ? 'Edite o conteúdo gerado aqui...' : (activeModalField === 'inputContent' ? "Edite seu texto aqui com mais espaço..." : "Ex: Focar em palavras-chave específicas, incluir emojis, etc.")}
            value={activeModalField === 'output' ? output : formData[activeModalField]}
            onChange={activeModalField === 'output' ? (e) => setOutput(e.target.value) : handleChange}
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

export default CopywriterForm;
