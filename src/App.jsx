import { useState } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import CopywriterForm from './components/CopywriterForm';
import TranscriberForm from './components/TranscriberForm';
import ThemeBank from './components/ThemeBank';
import ScriptwriterForm from './components/ScriptwriterForm';

function App() {
  const [activeTab, setActiveTab] = useState('transcritor');
  
  const [output, setOutput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  
  const [transcriberOutput, setTranscriberOutput] = useState('');
  const [isTranscribing, setIsTranscribing] = useState(false);

  const [scriptOutput, setScriptOutput] = useState('');
  const [isGeneratingScript, setIsGeneratingScript] = useState(false);

  const [sharedInput, setSharedInput] = useState('');

  const handleCopyToInput = (text) => {
    setSharedInput(text);
    setActiveTab('roteirista');
  };

  const handleSubmitContent = async (formData) => {
    setIsGenerating(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      const mockResult = `Aqui está o conteúdo gerado com base nas suas preferências:\n\nGênero: ${formData.genero}\nTom: ${formData.tom}\n\n[Início do Texto]\n\nEste é um parágrafo gerado automaticamente simulando o retorno do webhook. O conteúdo foi adaptado para o formato de ${formData.formato} usando uma estrutura do tipo ${formData.estrutura}.\n\nAo final, temos a seguinte chamada de ação: ${formData.cta}.\n\n[Fim do Texto]`;
      setOutput(mockResult);
    } catch (error) {
      console.error("Error generating content:", error);
      setOutput("Ocorreu um erro ao gerar o conteúdo. Tente novamente.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmitTranscription = async (formData) => {
    setIsTranscribing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      const mockResult = `[Transcrição Iniciada]\n\nFonte: ${formData.videoSource || formData.title}\n\n"Olá! Bem-vindos a mais um vídeo. Hoje vamos falar sobre como utilizar a inteligência artificial para automatizar tarefas repetitivas e gerar mais conteúdo com qualidade e agilidade. Fiquem ligados e não esqueçam de curtir o vídeo..."\n\n[Fim da Transcrição]`;
      setTranscriberOutput(mockResult);
    } catch (error) {
      console.error("Error transcribing:", error);
      setTranscriberOutput("Ocorreu um erro na transcrição. Tente novamente.");
    } finally {
      setIsTranscribing(false);
    }
  };

  const handleSubmitScript = async (formData) => {
    setIsGeneratingScript(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      const mockResult = `[Roteiro Gerado]\n\nTema: ${formData.theme}\n${formData.prompt ? `Prompt da Imagem: ${formData.prompt}\n` : ''}${formData.useTextAsBase ? 'Usando o texto como base para a imagem.\n' : ''}\n(Cena 1)\n\nNarrador: Olá, hoje vamos explorar o tema ${formData.theme}.\n\n(Cena 2)\n\nNarrador: Acompanhe este roteiro detalhado.`;
      setScriptOutput(mockResult);
    } catch (error) {
      console.error("Error generating script:", error);
      setScriptOutput("Ocorreu um erro ao gerar o roteiro. Tente novamente.");
    } finally {
      setIsGeneratingScript(false);
    }
  };

  return (
    <div className="app-container">
      <Header />
      <div className="app-body">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <main className="main-content">
          {activeTab === 'roteirista' && (
            <CopywriterForm 
              onSubmit={handleSubmitContent} 
              isGenerating={isGenerating} 
              output={output}
              setOutput={setOutput}
              sharedInput={sharedInput}
            />
          )}
          {activeTab === 'transcritor' && (
            <TranscriberForm 
              onSubmit={handleSubmitTranscription} 
              isGenerating={isTranscribing} 
              output={transcriberOutput}
              setOutput={setTranscriberOutput}
              onCopyToInput={handleCopyToInput}
            />
          )}
          {activeTab === 'pesquisador' && (
            <ThemeBank />
          )}
          {activeTab === 'redator' && (
            <ScriptwriterForm 
              onSubmit={handleSubmitScript} 
              isGenerating={isGeneratingScript} 
              output={scriptOutput}
              setOutput={setScriptOutput}
            />
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
