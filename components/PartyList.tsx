
import React, { useState } from 'react';
import { PartyDetails } from '../types';
import { Search, ReceiptText, Users } from 'lucide-react';

interface PartyListProps {
  parties: PartyDetails[];
  onSelectParty: (party: PartyDetails) => void;
}

const PartyList: React.FC<PartyListProps> = ({ parties, onSelectParty }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredParties = parties.filter(party => 
    party.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    party.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    party.president.toLowerCase().includes(searchTerm.toLowerCase()) ||
    party.cnpj.includes(searchTerm)
  );

  return (
    <div className="max-w-[1200px] mx-auto pb-24">
      
      {/* Main Container Card */}
      <div className="bg-white rounded shadow-sm border border-gray-200 overflow-hidden mb-4">
        
        {/* Header Strip */}
        <div className="border-b border-gray-200 p-3 bg-white flex items-center gap-3">
          <div className="text-gray-500">
             <span className="material-icons text-xl align-middle">groups</span>
          </div>
          <h1 className="text-gray-700 font-bold text-sm uppercase tracking-tight">
            Partidos em formação ativos
          </h1>
        </div>

        {/* Search and Count Section */}
        <div className="p-4 bg-white">
          <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4 mb-2">
            <div className="w-full md:w-1/3 relative">
               <label className="text-gray-500 text-xs mb-1 block">Pesquisar partido</label>
               <input 
                  type="text" 
                  className="w-full border-b border-gray-300 py-1 text-gray-700 focus:border-[var(--cor-padrao-aplicacao)] focus:outline-none transition-colors"
                  placeholder=""
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
               />
            </div>
            <div className="text-gray-500 text-sm">
              Total de <span className="font-bold">{filteredParties.length}</span> Partido(s) em Formação
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="p-3 text-xs font-normal text-gray-400 uppercase tracking-wider w-1/4">Partido</th>
                <th className="p-3 text-xs font-normal text-gray-400 uppercase tracking-wider">CNPJ</th>
                <th className="p-3 text-xs font-normal text-gray-400 uppercase tracking-wider">Data registro cartório</th>
                <th className="p-3 text-xs font-normal text-gray-400 uppercase tracking-wider">Nome do presidente</th>
                <th className="p-3 text-xs font-normal text-gray-400 uppercase tracking-wider">Contato</th>
                <th className="p-3 text-xs font-normal text-gray-400 uppercase tracking-wider text-center">Situação</th>
                <th className="p-3 text-xs font-normal text-gray-400 uppercase tracking-wider text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-600">
              {filteredParties.map((party, index) => (
                <tr 
                  key={party.id} 
                  className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}
                >
                  <td className="p-3 align-top">
                    <div className="font-bold text-gray-700">{party.name}</div>
                    <div className="text-xs text-gray-500 uppercase">{party.fullName}</div>
                  </td>
                  <td className="p-3 align-top whitespace-nowrap">
                    {party.cnpj}
                  </td>
                  <td className="p-3 align-top whitespace-nowrap">
                    {party.registrationDate}
                  </td>
                  <td className="p-3 align-top uppercase">
                    {party.president}
                  </td>
                  <td className="p-3 align-top text-xs whitespace-pre-line">
                    {party.contact}
                  </td>
                  <td className="p-3 align-top text-center">
                    <span className={`font-bold ${party.status === 'Ativo' ? 'text-[var(--cor-ativo)]' : 'text-gray-500'}`}>
                      {party.status}
                    </span>
                  </td>
                  <td className="p-3 align-top text-center">
                    <button 
                      onClick={() => onSelectParty(party)}
                      className="text-gray-600 hover:text-[var(--cor-padrao-aplicacao)] transition-colors p-2 rounded-full hover:bg-gray-100"
                      title="Detalhes"
                    >
                      <span className="material-icons">receipt_long</span>
                    </button>
                  </td>
                </tr>
              ))}
              
              {filteredParties.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-gray-500 bg-[var(--cor-tabelaVazia-bg)]">
                    Nenhum partido encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Footer (Static for demo) */}
        <div className="p-3 border-t border-gray-200 bg-white flex justify-end gap-2">
           <span className="text-xs text-gray-500 self-center mr-4">Itens por página: 10</span>
           <span className="text-xs text-gray-500 self-center mr-4">1 - {filteredParties.length} de {filteredParties.length}</span>
           <div className="flex gap-1">
              <button disabled className="p-1 text-gray-300"><span className="material-icons text-lg">first_page</span></button>
              <button disabled className="p-1 text-gray-300"><span className="material-icons text-lg">chevron_left</span></button>
              <button disabled className="p-1 text-gray-300"><span className="material-icons text-lg">chevron_right</span></button>
              <button disabled className="p-1 text-gray-300"><span className="material-icons text-lg">last_page</span></button>
           </div>
        </div>

      </div>
    </div>
  );
};

export default PartyList;
