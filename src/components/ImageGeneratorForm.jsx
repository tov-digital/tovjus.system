import React, { useState } from 'react';
import { Loader2, Image as ImageIcon, Download, Sparkles } from 'lucide-react';

const ImageGeneratorForm = () => {
  const [prompt, setPrompt] = useState('');
  const [useTextAsBase, setUseTextAsBase] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState(null);

  const handleGenerateImage = (e) => {
    e.preventDefault();
    setIsGeneratingImage(true);
    setTimeout(() => {
      setGeneratedImageUrl('https://via.placeholder.com/600x400/0f172a/ffffff?text=Imagem+Gerada');
      setIsGeneratingImage(false);
    }, 2000);
  };

  return (
    <div className="main-layout-grid" style={{ gridTemplateColumns: '1fr', maxWidth: '800px', margin: '0 auto' }}>
      <div className="panel" style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
        <h3 className="panel-header" style={{ marginBottom: '0.25rem', textAlign: 'center', fontSize: '1.25rem', color: 'var(--primary-color)' }}>Geração de Imagem</h3>
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
          minHeight: '400px'
        }}>
          {generatedImageUrl ? (
            <>
              <img src={generatedImageUrl} alt="Imagem gerada" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              <a 
                href={generatedImageUrl} 
                download="imagem_gerada.jpg" 
                className="btn-primary" 
                style={{ position: 'absolute', bottom: '1rem', right: '1rem', padding: '0.75rem', borderRadius: '50%', boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }}
                title="Baixar imagem"
              >
                <Download size={20} />
              </a>
            </>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: 'var(--text-secondary)', opacity: 0.5 }}>
              <ImageIcon size={48} style={{ marginBottom: '1rem' }} />
              <span style={{ fontSize: '1.2rem' }}>Espaço da Imagem</span>
            </div>
          )}
        </div>

        <div className="form-group" style={{ marginBottom: '1rem' }}>
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

        <div className="form-group" style={{ flexDirection: 'row', alignItems: 'center', gap: '0.5rem', marginTop: '-0.25rem', marginBottom: '1.5rem' }}>
          <input 
            type="checkbox" 
            id="useTextAsBase" 
            checked={useTextAsBase}
            onChange={(e) => setUseTextAsBase(e.target.checked)}
            style={{ accentColor: 'var(--primary-color)', cursor: 'pointer', width: '16px', height: '16px' }}
          />
          <label htmlFor="useTextAsBase" style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', cursor: 'pointer', margin: 0 }}>
            Usar tema como base
          </label>
        </div>

        <button 
          type="button" 
          className="btn-outline-primary" 
          onClick={handleGenerateImage}
          disabled={isGeneratingImage || (!prompt.trim() && !useTextAsBase)}
          style={{ width: '100%', padding: '1rem', fontSize: '1rem' }}
        >
          {isGeneratingImage ? (
            <><Loader2 size={20} className="animate-spin" style={{ marginRight: '0.5rem' }} /> Gerando...</>
          ) : (
            <><Sparkles size={20} style={{ marginRight: '0.5rem' }} /> Gerar Imagem</>
          )}
        </button>
      </div>
    </div>
  );
};

export default ImageGeneratorForm;
