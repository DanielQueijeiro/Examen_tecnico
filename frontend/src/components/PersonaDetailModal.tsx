import React, { useState, useEffect } from 'react';
import { Persona, Domicilio } from '../types';
import { api } from '../services/api';

interface Props {
  isOpen: boolean;
  persona: Persona | null;
  onClose: () => void;
}

export const PersonaDetailModal: React.FC<Props> = ({ isOpen, persona, onClose }) => {
  const [domicilios, setDomicilios] = useState<Domicilio[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && persona?.id) {
      setLoading(true);
      api.getDomiciliosByPersona(persona.id)
        .then(setDomicilios)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [isOpen, persona]);

  if (!isOpen || !persona) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl max-w-2xl w-full border border-slate-200 dark:border-slate-800 my-8">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <span className="text-[10px] font-mono uppercase bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded font-semibold">
              ID #{persona.id}
            </span>
            <h2 className="text-base font-bold text-slate-900 dark:text-white mt-1">
              {persona.nombre} {persona.apellidoPaterno} {persona.apellidoMaterno || ''}
            </h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 font-bold text-lg">
            ✕
          </button>
        </div>

        <div className="p-6 space-y-6 text-sm">
          {/* Ficha Personal */}
          <div>
            <h3 className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 tracking-wider mb-3">
              Información de Registro
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-slate-50 dark:bg-slate-800/60 p-4 rounded-lg border border-slate-200 dark:border-slate-700 text-xs">
              <div>
                <span className="text-slate-500 block">CURP</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">{persona.curp}</span>
              </div>
              <div>
                <span className="text-slate-500 block">RFC</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">{persona.rfc}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Nacimiento</span>
                <span className="text-slate-900 dark:text-white font-medium">{persona.fechaNacimiento}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Correo</span>
                <span className="text-slate-900 dark:text-white font-medium">{persona.email}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Teléfono</span>
                <span className="font-mono text-slate-900 dark:text-white font-medium">{persona.telefono}</span>
              </div>
            </div>
          </div>

          {/* Domicilios Asociados */}
          <div>
            <h3 className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 tracking-wider mb-3">
              Domicilios Asociados ({domicilios.length})
            </h3>
            {loading ? (
              <p className="text-xs text-slate-400 py-2">Consultando domicilios...</p>
            ) : domicilios.length === 0 ? (
              <p className="text-xs text-slate-400 italic py-2">Sin domicilios registrados.</p>
            ) : (
              <div className="space-y-2">
                {domicilios.map((d) => (
                  <div
                    key={d.id}
                    className="p-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
                  >
                    <div className="flex justify-between">
                      <strong className="text-slate-900 dark:text-white">
                        {d.calle} #{d.numeroExterior} {d.numeroInterior ? `Int. ${d.numeroInterior}` : ''}
                      </strong>
                      <span className="text-[10px] bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-1.5 py-0.5 rounded font-semibold">
                        {d.tipo || 'CASA'}
                      </span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 mt-1">
                      Col. {d.colonia}, C.P. {d.codigoPostal} • {d.municipio}, {d.estado}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="px-6 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-semibold transition"
          >
            Cerrar Ficha
          </button>
        </div>
      </div>
    </div>
  );
};