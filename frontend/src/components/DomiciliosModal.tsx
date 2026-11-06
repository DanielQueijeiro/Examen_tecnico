import React, { useState, useEffect } from 'react';
import { Persona, Domicilio } from '../types';
import { api } from '../services/api';

interface Props {
  isOpen: boolean;
  persona: Persona | null;
  onClose: () => void;
  onDomicilioChanged: () => void;
}

export const DomiciliosModal: React.FC<Props> = ({
  isOpen,
  persona,
  onClose,
  onDomicilioChanged,
}) => {
  const [domicilios, setDomicilios] = useState<Domicilio[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const [form, setForm] = useState<Domicilio>({
    calle: '',
    numeroExterior: '',
    numeroInterior: '',
    colonia: '',
    codigoPostal: '',
    municipio: '',
    estado: '',
    tipo: 'CASA',
  });

  const loadDomicilios = async () => {
    if (!persona?.id) return;
    try {
      const data = await api.getDomiciliosByPersona(persona.id);
      setDomicilios(data);
    } catch (err: any) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (isOpen && persona) {
      loadDomicilios();
      resetForm();
    }
  }, [isOpen, persona]);

  const resetForm = () => {
    setIsEditing(false);
    setEditingId(null);
    setErrorMsg('');
    setForm({
      calle: '',
      numeroExterior: '',
      numeroInterior: '',
      colonia: '',
      codigoPostal: '',
      municipio: '',
      estado: '',
      tipo: 'CASA',
    });
  };

  const handleEdit = (d: Domicilio) => {
    setIsEditing(true);
    setEditingId(d.id || null);
    setErrorMsg('');
    setForm({
      calle: d.calle,
      numeroExterior: d.numeroExterior,
      numeroInterior: d.numeroInterior || '',
      colonia: d.colonia,
      codigoPostal: d.codigoPostal,
      municipio: d.municipio,
      estado: d.estado,
      tipo: d.tipo || 'CASA',
    });
  };

  const handleDelete = async (id?: number) => {
    if (!id || !confirm('¿Estás seguro de eliminar este domicilio?')) return;
    try {
      await api.deleteDomicilio(id);
      await loadDomicilios();
      onDomicilioChanged();
    } catch (err: any) {
      alert(err.message || 'Error al eliminar domicilio');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!persona?.id) return;

    if (!form.calle.trim() || !form.numeroExterior.trim() || !form.colonia.trim() ||
        !form.codigoPostal.trim() || !form.municipio.trim() || !form.estado.trim()) {
      setErrorMsg('Por favor completa todos los campos obligatorios (*)');
      return;
    }

    try {
      setErrorMsg('');
      if (editingId) {
        await api.updateDomicilio(editingId, { ...form, personaId: persona.id });
      } else {
        await api.createDomicilio({ ...form, personaId: persona.id });
      }
      resetForm();
      await loadDomicilios();
      onDomicilioChanged();
    } catch (err: any) {
      setErrorMsg(err.message || 'Error al guardar el domicilio');
    }
  };

  if (!isOpen || !persona) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl max-w-3xl w-full border border-slate-200 dark:border-slate-800 my-8 transition-colors">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
              Domicilios de {persona.nombre} {persona.apellidoPaterno}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">CURP: {persona.curp}</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            ✕
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Listado */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Direcciones Asociadas ({domicilios.length})
              </h3>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-3 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-semibold transition"
                >
                  + Agregar Domicilio
                </button>
              )}
            </div>

            {domicilios.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 italic">
                Esta persona aún no tiene domicilios asociados.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {domicilios.map((d) => (
                  <div
                    key={d.id}
                    className="p-3.5 border border-slate-200 dark:border-slate-800 rounded-lg bg-slate-50 dark:bg-slate-800/50 flex justify-between items-start"
                  >
                    <div className="text-xs space-y-1.5 flex-1 pr-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-semibold text-slate-900 dark:text-white leading-snug">
                          {d.calle} #{d.numeroExterior} {d.numeroInterior ? `Int. ${d.numeroInterior}` : ''}
                        </span>
                        <span className="shrink-0 bg-slate-200/90 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded-md text-[10px] font-semibold tracking-wide">
                          {d.tipo || 'CASA'}
                        </span>
                      </div>
                      <p className="text-slate-600 dark:text-slate-400 leading-normal">
                        Col. {d.colonia}, C.P. <span className="font-mono">{d.codigoPostal}</span>
                      </p>
                      <p className="text-slate-500 dark:text-slate-400">
                        {d.municipio}, {d.estado}
                      </p>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleEdit(d)}
                        className="px-2 py-0.5 text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition font-medium"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(d.id)}
                        className="px-2 py-0.5 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded transition font-medium"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Formulario Inline */}
          {isEditing && (
            <div className="border border-slate-200 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-800/40 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                  {editingId ? 'Editar Domicilio' : 'Nuevo Domicilio'}
                </h4>
                <button
                  type="button"
                  onClick={resetForm}
                  className="text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                >
                  Cancelar
                </button>
              </div>

              {errorMsg && (
                <p className="text-xs text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 p-2 rounded mb-3 border border-rose-200 dark:border-rose-800">
                  {errorMsg}
                </p>
              )}

              <form onSubmit={handleSave} className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="md:col-span-2">
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
                      Calle *
                    </label>
                    <input
                      type="text"
                      value={form.calle}
                      onChange={(e) => setForm({ ...form, calle: e.target.value })}
                      className="w-full px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      placeholder="Av. 5 de Mayo"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
                      Tipo
                    </label>
                    <select
                      value={form.tipo}
                      onChange={(e) => setForm({ ...form, tipo: e.target.value })}
                      className="w-full px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    >
                      <option value="CASA">Casa</option>
                      <option value="TRABAJO">Oficina / Trabajo</option>
                      <option value="FISCAL">Fiscal</option>
                      <option value="OTRO">Otro</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
                      Núm. Exterior *
                    </label>
                    <input
                      type="text"
                      value={form.numeroExterior}
                      onChange={(e) => setForm({ ...form, numeroExterior: e.target.value })}
                      className="w-full px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      placeholder="124"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
                      Núm. Interior
                    </label>
                    <input
                      type="text"
                      value={form.numeroInterior}
                      onChange={(e) => setForm({ ...form, numeroInterior: e.target.value })}
                      className="w-full px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      placeholder="B"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
                      Código Postal *
                    </label>
                    <input
                      type="text"
                      maxLength={10}
                      value={form.codigoPostal}
                      onChange={(e) => setForm({ ...form, codigoPostal: e.target.value })}
                      className="w-full px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      placeholder="76000"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
                      Colonia *
                    </label>
                    <input
                      type="text"
                      value={form.colonia}
                      onChange={(e) => setForm({ ...form, colonia: e.target.value })}
                      className="w-full px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      placeholder="Centro Histórico"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
                      Municipio *
                    </label>
                    <input
                      type="text"
                      value={form.municipio}
                      onChange={(e) => setForm({ ...form, municipio: e.target.value })}
                      className="w-full px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      placeholder="Querétaro"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
                      Estado *
                    </label>
                    <input
                      type="text"
                      value={form.estado}
                      onChange={(e) => setForm({ ...form, estado: e.target.value })}
                      className="w-full px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      placeholder="Querétaro"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-3 py-1.5 text-xs text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-3.5 py-1.5 text-xs bg-slate-900 hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-semibold rounded-lg transition active:scale-[0.98]"
                  >
                    {editingId ? 'Actualizar Domicilio' : 'Guardar Domicilio'}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        <div className="px-6 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-semibold transition"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};