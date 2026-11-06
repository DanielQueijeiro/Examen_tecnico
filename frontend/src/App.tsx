import React, { useState, useEffect, useCallback } from 'react';
import { Persona, Stats } from './types';
import { api } from './services/api';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LoginView } from './components/LoginView';
import { NavBar } from './components/Navbar';
import { StatsCards } from './components/StatsCards';
import { PersonaModal } from './components/PersonaModal';
import { PersonaDetailModal } from './components/PersonaDetailModal';
import { DomiciliosModal } from './components/DomiciliosModal';
import { ConfirmModal } from './components/ConfirmModal';

const DashboardContent: React.FC = () => {
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(false);

  // Modales
  const [isPersonaModalOpen, setIsPersonaModalOpen] = useState(false);
  const [editingPersona, setEditingPersona] = useState<Persona | null>(null);

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [detailPersona, setDetailPersona] = useState<Persona | null>(null);

  const [isDomiciliosModalOpen, setIsDomiciliosModalOpen] = useState(false);
  const [domiciliosPersona, setDomiciliosPersona] = useState<Persona | null>(null);

  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [deletingPersona, setDeletingPersona] = useState<Persona | null>(null);

  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const loadStats = async () => {
    try {
      const data = await api.getStats();
      setStats(data);
    } catch {
      // Ignorar fallo de stats
    }
  };

  const loadPersonas = useCallback(async () => {
    try {
      setLoading(true);
      const data = await api.getPersonas(search, currentPage, 6);
      setPersonas(data.content);
      setTotalPages(data.totalPages);
      setTotalElements(data.totalElements);
    } catch (err: any) {
      showToast(err.message || 'Error al conectar con la API', 'error');
    } finally {
      setLoading(false);
    }
  }, [search, currentPage]);

  useEffect(() => {
    loadStats();
    loadPersonas();
  }, [loadPersonas]);

  // Exportar a Excel (CSV con formato UTF-8)
  const handleExportCSV = () => {
    if (personas.length === 0) {
      showToast('No hay registros para exportar', 'error');
      return;
    }
    const headers = ['ID', 'Nombre', 'Apellido Paterno', 'Apellido Materno', 'CURP', 'RFC', 'Fecha Nacimiento', 'Email', 'Telefono'];
    const rows = personas.map(p => [
      p.id,
      `"${p.nombre}"`,
      `"${p.apellidoPaterno}"`,
      `"${p.apellidoMaterno || ''}"`,
      `"${p.curp}"`,
      `"${p.rfc}"`,
      `"${p.fechaNacimiento}"`,
      `"${p.email}"`,
      `"${p.telefono}"`
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `personas_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Archivo CSV descargado con éxito', 'success');
  };

  const handleSavePersona = async (formData: Persona) => {
    try {
      if (editingPersona?.id) {
        await api.updatePersona(editingPersona.id, formData);
        showToast('Persona actualizada exitosamente', 'success');
      } else {
        await api.createPersona(formData);
        showToast('Persona registrada exitosamente', 'success');
      }
      loadPersonas();
      loadStats();
    } catch (err: any) {
      showToast(err.message || 'No se pudo guardar la persona', 'error');
      throw err;
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingPersona?.id) return;
    try {
      await api.deletePersona(deletingPersona.id);
      showToast('Persona eliminada correctamente', 'success');
      setIsConfirmDeleteOpen(false);
      setDeletingPersona(null);
      loadPersonas();
      loadStats();
    } catch (err: any) {
      showToast(err.message || 'Error al eliminar', 'error');
    }
  };

  const formatearFecha = (fechaStr: string) => {
    if (!fechaStr) return '';
    const partes = fechaStr.split('-');
    return partes.length === 3 ? `${partes[2]}/${partes[1]}/${partes[0]}` : fechaStr;
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors">
      <NavBar />

      {toast && (
        <div
          className={`fixed top-20 right-6 z-50 px-4 py-2.5 rounded-lg shadow-lg text-xs font-semibold text-white animate-in fade-in duration-200 ${
            toast.type === 'success' ? 'bg-emerald-600' : 'bg-rose-600'
          }`}
        >
          {toast.message}
        </div>
      )}

      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex-1">
        <StatsCards stats={stats} />

        {/* Panel de Tabla */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs overflow-hidden transition-colors">
          <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row gap-3 items-center justify-between">
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(0);
              }}
              placeholder="Buscar por nombre, CURP, RFC o email..."
              className="w-full sm:w-80 px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-900 dark:text-white"
            />

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <button
                onClick={handleExportCSV}
                className="px-3 py-2 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg text-xs font-semibold transition"
                title="Descargar en formato Excel / CSV"
              >
                Exportar CSV
              </button>

              <button
                onClick={() => {
                  setEditingPersona(null);
                  setIsPersonaModalOpen(true);
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition active:scale-[0.98]"
              >
                + Nueva Persona
              </button>
            </div>
          </div>

          {/* Loader durante llamadas HTTP */}
          {loading && (
            <div className="h-1 w-full bg-blue-100 dark:bg-blue-950 overflow-hidden">
              <div className="h-full bg-blue-600 w-1/3 animate-pulse"></div>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 text-[11px] uppercase font-semibold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-5 py-3">Nombre</th>
                  <th className="px-5 py-3">CURP / RFC</th>
                  <th className="px-5 py-3">Contacto</th>
                  <th className="px-5 py-3">Nacimiento</th>
                  <th className="px-5 py-3 text-center">Domicilios</th>
                  <th className="px-5 py-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {personas.length === 0 && !loading ? (
                  <tr>
                    <td colSpan={6} className="text-center py-10 text-slate-400 text-xs">
                      No se encontraron registros de personas.
                    </td>
                  </tr>
                ) : (
                  personas.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="font-semibold text-slate-900 dark:text-white">
                          {p.nombre} {p.apellidoPaterno} {p.apellidoMaterno || ''}
                        </div>
                      </td>

                      <td className="px-5 py-3.5 font-mono text-[11px]">
                        <p className="text-slate-800 dark:text-slate-200 font-medium">{p.curp}</p>
                        <p className="text-slate-400 text-[10px]">{p.rfc}</p>
                      </td>

                      <td className="px-5 py-3.5 text-[11px]">
                        <p className="text-slate-800 dark:text-slate-200">{p.email}</p>
                        <p className="text-slate-400 font-mono text-[10px]">{p.telefono}</p>
                      </td>

                      <td className="px-5 py-3.5 font-mono text-[11px] whitespace-nowrap">
                        {formatearFecha(p.fechaNacimiento)}
                      </td>

                      <td className="px-5 py-3.5 text-center">
                        <button
                          onClick={() => {
                            setDomiciliosPersona(p);
                            setIsDomiciliosModalOpen(true);
                          }}
                          className="px-2.5 py-1 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900 text-indigo-700 dark:text-indigo-300 rounded text-[11px] font-semibold transition"
                        >
                          Gestionar ({p.domicilios ? p.domicilios.length : 0})
                        </button>
                      </td>

                      <td className="px-5 py-3.5 text-right">
                        <div className="inline-flex items-center gap-1">
                          <button
                            onClick={() => {
                              setDetailPersona(p);
                              setIsDetailModalOpen(true);
                            }}
                            className="px-2 py-0.5 text-[11px] font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded transition"
                          >
                            Ver
                          </button>
                          <button
                            onClick={() => {
                              setEditingPersona(p);
                              setIsPersonaModalOpen(true);
                            }}
                            className="px-2 py-0.5 text-[11px] font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 border border-blue-200 dark:border-blue-800 rounded transition"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => {
                              setDeletingPersona(p);
                              setIsConfirmDeleteOpen(true);
                            }}
                            className="px-2 py-0.5 text-[11px] font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded transition"
                          >
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Paginación */}
          <div className="p-3.5 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>
              Página {currentPage + 1} de {totalPages || 1} ({totalElements} registros)
            </span>
            <div className="flex gap-1.5">
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 0}
                className="px-2.5 py-1 border border-slate-300 dark:border-slate-700 rounded hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 transition font-medium"
              >
                Anterior
              </button>
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage >= totalPages - 1}
                className="px-2.5 py-1 border border-slate-300 dark:border-slate-700 rounded hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 transition font-medium"
              >
                Siguiente
              </button>
            </div>
          </div>
        </div>
      </main>

      <PersonaModal
        isOpen={isPersonaModalOpen}
        persona={editingPersona}
        onClose={() => setIsPersonaModalOpen(false)}
        onSave={handleSavePersona}
      />

      <PersonaDetailModal
        isOpen={isDetailModalOpen}
        persona={detailPersona}
        onClose={() => {
          setIsDetailModalOpen(false);
          setDetailPersona(null);
        }}
      />

      <DomiciliosModal
        isOpen={isDomiciliosModalOpen}
        persona={domiciliosPersona}
        onClose={() => {
          setIsDomiciliosModalOpen(false);
          setDomiciliosPersona(null);
        }}
        onDomicilioChanged={() => {
          loadPersonas();
          loadStats();
        }}
      />

      <ConfirmModal
        isOpen={isConfirmDeleteOpen}
        title="Confirmar eliminación"
        message={`¿Estás seguro de que deseas eliminar a ${deletingPersona?.nombre} ${deletingPersona?.apellidoPaterno}? Esta acción eliminará permanentemente todos sus domicilios asociados.`}
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setIsConfirmDeleteOpen(false);
          setDeletingPersona(null);
        }}
      />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <MainRouter />
    </AuthProvider>
  );
};

const MainRouter: React.FC = () => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <DashboardContent /> : <LoginView />;
};

export default App;