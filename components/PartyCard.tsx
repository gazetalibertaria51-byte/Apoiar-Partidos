
import React, { useState } from 'react';
import { PartyDetails, StateSupport, SearchResult } from '../types';
import { Loader2, LinkIcon, Globe, MapPin } from 'lucide-react';

interface PartyCardProps {
  details: PartyDetails;
  states: StateSupport[];
  onSupportClick: () => void;
  hasSupported: boolean;
  newsData: SearchResult | null;
  loadingNews: boolean;
  onRefreshNews: () => void;
  onBack: () => void;
}

const PartyCard: React.FC<PartyCardProps> = ({ 
  details, 
  states, 
  onSupportClick, 
  hasSupported,
  newsData,
  loadingNews,
  onRefreshNews,
  onBack
}) => {
  // State to track which images failed to load
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({});

  const handleImgError = (code: string) => {
    setImgErrors(prev => ({ ...prev, [code]: true }));
  };

  return (
    <div className="max-w-[900px] mx-auto pb-24">
      
      {/* Main Container Card */}
      <div className="bg-white rounded shadow-sm border border-gray-200 overflow-hidden mb-4">
        
        {/* Header Strip - "Detalhes do partido..." */}
        <div className="border-b border-gray-200 p-3 bg-white flex items-center gap-3">
          <div className="text-gray-500">
            <span className="material-icons text-xl align-middle">assignment</span>
          </div>
          <h1 className="text-gray-700 font-bold text-sm uppercase tracking-tight">
            Detalhes do partido {details.name} com apoiamentos Aptos e Válidos
          </h1>
        </div>

        {/* Top Section: Info + Count */}
        <div className="p-4 bg-gray-50/50">
          <div className="flex flex-col md:flex-row gap-4">
            
            {/* Left: Party Info */}
            <div className="flex-1 bg-white p-3 rounded border border-l-[5px] border-l-[var(--cor-azul)] border-gray-200 shadow-sm relative">
              <div className="space-y-3 text-sm">
                
                <div className="flex justify-between items-start">
                   <div>
                      <span className="text-gray-500 font-normal">Partido: </span>
                      <span className="text-gray-800 font-bold uppercase">{details.name} - {details.fullName || 'PARTIDO EM FORMAÇÃO'}</span>
                   </div>
                   <div className="text-right whitespace-nowrap ml-2">
                      <span className="text-gray-500">Situação: </span>
                      <span className="text-[var(--cor-ativo)] font-bold">{details.status}</span>
                   </div>
                </div>
                
                <div className="flex flex-col md:flex-row gap-4 md:items-center">
                  <div>
                    <span className="text-gray-500">CNPJ: </span>
                    <span className="text-gray-800 font-bold">{details.cnpj}</span>
                  </div>
                </div>

                <div>
                   <span className="text-gray-500">Presidente: </span>
                   <span className="text-gray-800 font-bold uppercase">{details.president}</span>
                </div>

                 <div>
                   <span className="text-gray-500">Contato: </span>
                   <span className="text-gray-800 font-bold">{details.contact?.split('/')[0] || '(11) 996393564'}</span>
                </div>

              </div>
            </div>

            {/* Right: Support Count Box */}
            <div className="md:w-[280px] bg-white rounded border border-gray-200 shadow-sm p-4 relative overflow-hidden flex flex-col justify-center">
               <div className="flex items-center gap-4 z-10">
                  <img src="https://flagcdn.com/w80/br.png" alt="Bandeira do Brasil" className="w-14 h-auto shadow-sm" />
                  <div className="flex flex-col">
                    <span className="text-4xl font-bold text-gray-700 leading-none">{details.totalSupport}</span>
                    <span className="text-gray-600 font-medium text-sm">apoiamento(s)</span>
                  </div>
               </div>
               {/* Background Watermark */}
               <div className="absolute -right-4 -bottom-4 opacity-5 pointer-events-none">
                 <img src="https://flagcdn.com/w160/br.png" alt="Brazil Watermark" className="w-32 h-auto" />
               </div>
            </div>

          </div>
        </div>

        {/* State List Section */}
        <div className="bg-white">
          {states.map((state, index) => (
            <div 
              key={state.code} 
              className={`p-3 flex items-center justify-between hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}
            >
              <div className="flex items-center gap-4">
                {/* Flag with Fallback */}
                {imgErrors[state.code] ? (
                  <div className="w-9 h-6 bg-gray-200 rounded-[2px] flex items-center justify-center shadow-sm">
                    <MapPin size={14} className="text-gray-400" />
                  </div>
                ) : (
                  <img 
                    src={`https://flagcdn.com/w80/br-${state.code.toLowerCase()}.png`} 
                    alt={`Bandeira de ${state.name}`}
                    title={state.name}
                    onError={() => handleImgError(state.code)}
                    className="w-9 h-auto shadow-sm rounded-[2px] object-cover border border-gray-100"
                  />
                )}
                
                <span className="text-gray-700 font-bold text-sm">{state.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-bold text-gray-700 text-sm">{state.count} apoiamento(s)</span>
                <div className="text-[var(--cor-check)]">
                   <span className="material-icons text-xl">check_circle</span>
                </div>
              </div>
            </div>
          ))}
          {states.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              Selecione um partido para ver os detalhes por estado.
            </div>
          )}
        </div>

      </div>

      {/* Action Buttons Container */}
      <div className="flex flex-col gap-4 mb-6">
          {/* Gemini AI Context */}
          <div className="bg-white rounded border border-gray-200 p-4 shadow-sm">
             <div className="flex justify-between items-center mb-3 pb-2 border-b border-gray-100">
               <div className="flex items-center gap-2 text-[var(--cor-padrao-aplicacao)]">
                  <Globe size={16} />
                  <h3 className="font-bold text-sm uppercase">Contexto Inteligente (Gemini)</h3>
               </div>
               <button 
                  onClick={onRefreshNews}
                  disabled={loadingNews}
                  className="text-xs text-[var(--cor-padrao-azul)] hover:underline flex items-center gap-1"
                >
                  <span className="material-icons text-sm">refresh</span> Atualizar
               </button>
             </div>
             
             {loadingNews ? (
               <div className="flex items-center justify-center py-4 text-gray-400 gap-2">
                 <Loader2 className="animate-spin" size={16} />
                 <span className="text-xs">Carregando informações...</span>
               </div>
             ) : newsData ? (
               <div className="text-sm text-gray-600">
                  <p className="mb-2 line-clamp-3">{newsData.text}</p>
                  {newsData.sources.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {newsData.sources.slice(0, 2).map((source, idx) => (
                        <a 
                          key={idx} 
                          href={source.uri} 
                          target="_blank" 
                          rel="noreferrer"
                          className="text-xs bg-gray-100 text-[var(--cor-padrao-azul)] px-2 py-1 rounded flex items-center gap-1 hover:bg-gray-200 transition-colors"
                        >
                          <LinkIcon size={10} />
                          {source.title || 'Fonte'}
                        </a>
                      ))}
                    </div>
                  )}
               </div>
             ) : null}
          </div>

          {/* Gov.br Button */}
          {hasSupported ? (
            <div className="bg-[var(--cor-verde-bg)] border border-[var(--cor-verde)] text-[var(--cor-verde)] p-3 rounded font-bold text-center flex items-center justify-center gap-2">
               <span className="material-icons">check_circle</span>
               Apoiamento registrado com sucesso
            </div>
          ) : (
            <button 
              onClick={onSupportClick}
              className="bg-[#1351B4] hover:bg-[#0c3c8c] text-white py-3 px-4 rounded shadow-sm font-semibold transition-colors flex items-center justify-center gap-3"
            >
              <span className="font-serif italic font-black text-xl">gov.br</span>
              <span>Apoiar este Partido</span>
            </button>
          )}
      </div>
      
      {/* Footer Back Button */}
      <div className="flex justify-end">
        <button 
          onClick={onBack}
          className="bg-white border border-gray-300 text-gray-600 hover:bg-gray-50 px-4 py-2 rounded shadow-sm flex items-center gap-1 text-sm font-medium transition-colors"
        >
          <span className="material-icons text-sm">arrow_left</span>
          Voltar
        </button>
      </div>

    </div>
  );
};

export default PartyCard;
