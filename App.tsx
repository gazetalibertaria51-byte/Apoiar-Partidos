
import React, { useState, useEffect } from 'react';
import { Menu } from 'lucide-react';
import PartyCard from './components/PartyCard';
import PartyList from './components/PartyList';
import GovBrLogin from './components/GovBrLogin';
import { PartyDetails, StateSupport, SearchResult } from './types';
import { fetchPartyNews } from './services/geminiService';

const App: React.FC = () => {
  const [view, setView] = useState<'list' | 'details'>('list');
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [hasSupported, setHasSupported] = useState(false);
  const [newsData, setNewsData] = useState<SearchResult | null>(null);
  const [loadingNews, setLoadingNews] = useState(false);

  // --- MOCK DATA FROM OCR ---
  const allParties: PartyDetails[] = [
    {
      id: 'ambientalista',
      name: 'AMBIENTALISTA ANIMAL',
      fullName: 'PARTIDO AMBIENTALISTA ANIMAL',
      cnpj: '61.267.674/0001-41',
      registrationDate: '30/05/2025',
      president: 'WILSON GRASSI JÚNIOR',
      contact: '(11) 988496476',
      status: 'Ativo',
      totalSupport: 124
    },
    {
      id: 'br',
      name: 'BR',
      fullName: 'PARTIDO BRASILEIRO',
      cnpj: '62.636.735/0001-63',
      registrationDate: '16/06/2025',
      president: 'ROBERTO COELHO ROCHA',
      contact: '(61) 99765403 / (61) 33031508',
      status: 'Ativo',
      totalSupport: 45
    },
    {
      id: 'cd',
      name: 'CD',
      fullName: 'CONSCIÊNCIA DEMOCRÁTICA',
      cnpj: '52.087.499/0001-10',
      registrationDate: '15/08/2023',
      president: 'CRISTIANO ROSA D ABADIA',
      contact: '(61) 993970900',
      status: 'Ativo',
      totalSupport: 310
    },
    {
      id: 'conservador',
      name: 'CONSERVADOR',
      fullName: 'PARTIDO CONSERVADOR BRASILEIRO',
      cnpj: '53.626.518/0001-00',
      registrationDate: '09/01/2024',
      president: 'JOSÉ CARLOS BERNARDI',
      contact: '(11) 996393564',
      status: 'Ativo',
      totalSupport: 917
    },
    {
      id: 'esperanca',
      name: 'ESPERANÇA',
      fullName: 'PARTIDO ESPERANÇA - BRASIL',
      cnpj: '59.148.897/0001-48',
      registrationDate: '16/01/2025',
      president: 'BENEDITO CORRÊA DOS SANTOS',
      contact: '(61) 998417200 / (27) 988340056',
      status: 'Ativo',
      totalSupport: 89
    },
    {
      id: 'evolucao',
      name: 'EVOLUÇÃO',
      fullName: 'EVOLUÇÃO DEMOCRÁTICA',
      cnpj: '61.625.823/0001-05',
      registrationDate: '26/05/2025',
      president: 'GILSON DA SILVA LIMA',
      contact: '(61) 996165470',
      status: 'Ativo',
      totalSupport: 12
    },
    {
      id: 'igual',
      name: 'IGUAL',
      fullName: 'IGUAL',
      cnpj: '62.057.951/0001-54',
      registrationDate: '10/01/2025',
      president: 'Sérgio Lins da Silva',
      contact: '(21) 969242667 / (21) 26613511',
      status: 'Ativo',
      totalSupport: 76
    },
    {
      id: 'juntos',
      name: 'JUNTOS',
      fullName: 'JUNTOS PELA REPÚBLICA',
      cnpj: '58.191.994/0001-50',
      registrationDate: '18/10/2024',
      president: 'Mayara Ester Galdino Bonifacio',
      contact: '(11) 939457166',
      status: 'Ativo',
      totalSupport: 203
    },
    {
      id: 'mais',
      name: 'MAIS',
      fullName: 'MEIO AMBIENTE E INTEGRAÇÃO SOCIAL',
      cnpj: '56.078.486/0001-35',
      registrationDate: '02/07/2024',
      president: 'MARCILIO DUARTE LIMA',
      contact: '(11) 999819917',
      status: 'Ativo',
      totalSupport: 567
    },
    {
      id: 'mcb',
      name: 'MCB',
      fullName: 'MOVIMENTO CONSCIÊNCIA BRASIL',
      cnpj: '51.267.983/0001-68',
      registrationDate: '26/04/2023',
      president: 'EDMILSON GOMES DA SILVEIRA JÚNIOR',
      contact: '(62) 983418567 / (61) 21931298',
      status: 'Ativo',
      totalSupport: 1105
    },
    {
      id: 'ordem',
      name: 'ORDEM',
      fullName: 'ORDEM',
      cnpj: '41.173.027/0001-63',
      registrationDate: '04/01/2021',
      president: 'SAMUEL MESSIAS DA SILVA OLIVEIRA',
      contact: '(61) 996243962',
      status: 'Ativo',
      totalSupport: 432
    }
  ];

  const defaultStates: StateSupport[] = [
    { code: 'DF', name: 'Distrito Federal', count: 0 },
    { code: 'GO', name: 'Goiás', count: 0 },
    { code: 'SP', name: 'São Paulo', count: 0 },
    { code: 'MG', name: 'Minas Gerais', count: 0 },
  ];

  // Specific mock data for Conservador to match previous screenshot
  const conservadorStates: StateSupport[] = [
    { code: 'DF', name: 'Distrito Federal', count: 5 },
    { code: 'GO', name: 'Goiás', count: 5 },
    { code: 'MG', name: 'Minas Gerais', count: 4 },
    { code: 'PB', name: 'Paraíba', count: 53 },
    { code: 'RJ', name: 'Rio de Janeiro', count: 18 },
    { code: 'RO', name: 'Rondônia', count: 832 },
  ];

  const [selectedParty, setSelectedParty] = useState<PartyDetails>(allParties[3]); // Default to something if needed
  const [currentStates, setCurrentStates] = useState<StateSupport[]>(conservadorStates);

  // Handle Loader Logic
  useEffect(() => {
    const appRoot = document.querySelector('app-root');
    if (appRoot) {
      setTimeout(() => {
        appRoot.classList.remove('loading');
      }, 800);
    }
  }, []);

  // When selected party changes, update news
  useEffect(() => {
    if (view === 'details' && selectedParty) {
      loadNews(selectedParty.fullName || selectedParty.name);
    }
  }, [view, selectedParty]);

  const handleSelectParty = (party: PartyDetails) => {
    setSelectedParty(party);
    // Logic to switch specific state data for demo purposes
    if (party.id === 'conservador') {
      setCurrentStates(conservadorStates);
    } else {
      // Generate some random data for other parties so the UI isn't empty
      const randomStates = defaultStates.map(s => ({
         ...s, 
         count: Math.floor(Math.random() * 50) 
      }));
      setCurrentStates(randomStates);
    }
    // Reset support status when switching parties
    setHasSupported(false);
    setView('details');
  };

  const handleSupportSuccess = () => {
    setHasSupported(true);
    // Update local count
    setSelectedParty(prev => ({ ...prev, totalSupport: prev.totalSupport + 1 }));
    setCurrentStates(prev => {
        const newStates = [...prev];
        if(newStates.length > 0) {
           newStates[0] = { ...newStates[0], count: newStates[0].count + 1 };
        }
        return newStates;
    });
  };

  const loadNews = async (queryName: string) => {
    setLoadingNews(true);
    setNewsData(null);
    const result = await fetchPartyNews(queryName);
    setNewsData(result);
    setLoadingNews(false);
  };

  return (
    <div className="min-h-screen flex flex-col font-roboto bg-[#f6f6f6]">
      {/* Top Navigation Bar - Minimalist SAPF Style */}
      <header className="bg-white shadow-sm h-14 flex items-center px-4 sticky top-0 z-20">
        <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-md">
          <Menu size={24} />
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 md:p-6">
        
        {view === 'list' && (
          <PartyList 
            parties={allParties} 
            onSelectParty={handleSelectParty} 
          />
        )}

        {view === 'details' && (
          <PartyCard 
            details={selectedParty}
            states={currentStates}
            onSupportClick={() => setIsLoginOpen(true)}
            hasSupported={hasSupported}
            newsData={newsData}
            loadingNews={loadingNews}
            onRefreshNews={() => loadNews(selectedParty.fullName || selectedParty.name)}
            onBack={() => setView('list')}
          />
        )}

      </main>

      {/* Modals */}
      <GovBrLogin 
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onSuccess={handleSupportSuccess}
      />
    </div>
  );
};

export default App;
