import React, { useState, useEffect } from 'react';
import { Persona } from '../types';

interface Props {
  isOpen: boolean;
  persona: Persona | null;
  onClose: () => void;
  onSave: (persona: Persona) => Promise<void>;
}

export const PersonaModal: React.FC<Props> = ({ isOpen, persona, onClose, onSave }) => {
  const [formData, setFormData] = useState<Persona>({
    nombre: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    curp: '',
    rfc: '',
    fechaNacimiento: '',
    email: '',
    telefono: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (persona) {
      setFormData({
        ...persona,
        apellidoMaterno: persona.apellidoMaterno || '',
      });
    } else {
      setFormData({
        nombre: '',
        apellidoPaterno: '',
        apellidoMaterno: '',
        curp: '',
        rfc: '',
        fechaNacimiento: '',
        email: '',
        telefono: '',
      });
    }
    setErrors({});
  }, [persona, isOpen]);

  if (!isOpen) return null;

  const validate = (): boolean => {
    const errs: Record<string, string> = {};

    if (!formData.nombre.trim()) errs.nombre = 'El nombre es requerido';
    if (!formData.apellidoPaterno.trim()) errs.apellidoPaterno = 'El apellido paterno es requerido';

    const curpRegex = /^[A-Z]{4}\d{6}[HM][A-Z]{5}[A-Z0-9]\d$/i;
    if (!formData.curp.trim()) {
      errs.curp = 'La CURP es requerida';
    } else if (!curpRegex.test(formData.curp.trim())) {
      errs.curp = 'Formato inválido (18 caracteres)';
    }

    const rfcRegex = /^[A-ZÑ&]{3,4}\d{6}[A-Z0-9]{3}$/i;
    if (!formData.rfc.trim()) {
      errs.rfc = 'El RFC es requerido';
    } else if (!rfcRegex.test(formData.rfc.trim())) {
      errs.rfc = 'Formato inválido (12-13 caracteres)';
    }

    if (!formData.fechaNacimiento) errs.fechaNacimiento = 'Fecha requerida';

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      errs.email = 'El correo es requerido';
    } else if (!emailRegex.test(formData.email.trim())) {
      errs.email = 'Formato de correo no válido';
    }

    const telRegex = /^\d{10}$/;
    if (!formData.telefono.trim()) {
      errs.telefono = 'Teléfono requerido';
    } else if (!telRegex.test(formData.telefono.trim())) {
      errs.telefono = 'Debe contener 10 dígitos';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setLoading(true);
      await onSave({
        ...formData,
        curp: formData.curp.trim().toUpperCase(),
        rfc: formData.rfc.trim().toUpperCase(),
        email: formData.email.trim().toLowerCase(),
      });
      onClose();
    } catch {
      // Manejado en el toast global
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl max-w-2xl w-full border border-slate-200 dark:border-slate-800 my-8 transition-colors">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
              {persona ? 'Modificar Registro' : 'Nueva Persona'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Datos personales y fiscales</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
                Nombre(s) *
              </label>
              <input
                type="text"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                placeholder="Juan Carlos"
              />
              {errors.nombre && <p className="text-[11px] text-rose-600 dark:text-rose-400 mt-1">{errors.nombre}</p>}
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
                Apellido Paterno *
              </label>
              <input
                type="text"
                value={formData.apellidoPaterno}
                onChange={(e) => setFormData({ ...formData, apellidoPaterno: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                placeholder="González"
              />
              {errors.apellidoPaterno && <p className="text-[11px] text-rose-600 dark:text-rose-400 mt-1">{errors.apellidoPaterno}</p>}
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
                Apellido Materno
              </label>
              <input
                type="text"
                value={formData.apellidoMaterno}
                onChange={(e) => setFormData({ ...formData, apellidoMaterno: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                placeholder="López"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
                Fecha de Nacimiento *
              </label>
              <input
                type="date"
                value={formData.fechaNacimiento}
                onChange={(e) => setFormData({ ...formData, fechaNacimiento: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
              {errors.fechaNacimiento && <p className="text-[11px] text-rose-600 dark:text-rose-400 mt-1">{errors.fechaNacimiento}</p>}
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
                CURP *
              </label>
              <input
                type="text"
                maxLength={18}
                value={formData.curp}
                onChange={(e) => setFormData({ ...formData, curp: e.target.value.toUpperCase() })}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-lg text-sm font-mono uppercase text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                placeholder="ABCD900101HDFRRN01"
              />
              {errors.curp && <p className="text-[11px] text-rose-600 dark:text-rose-400 mt-1">{errors.curp}</p>}
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
                RFC *
              </label>
              <input
                type="text"
                maxLength={13}
                value={formData.rfc}
                onChange={(e) => setFormData({ ...formData, rfc: e.target.value.toUpperCase() })}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-lg text-sm font-mono uppercase text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                placeholder="ABCD900101XX1"
              />
              {errors.rfc && <p className="text-[11px] text-rose-600 dark:text-rose-400 mt-1">{errors.rfc}</p>}
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
                Correo Electrónico *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                placeholder="usuario@ejemplo.com"
              />
              {errors.email && <p className="text-[11px] text-rose-600 dark:text-rose-400 mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
                Teléfono (10 dígitos) *
              </label>
              <input
                type="text"
                maxLength={10}
                value={formData.telefono}
                onChange={(e) => setFormData({ ...formData, telefono: e.target.value.replace(/\D/g, '') })}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-lg text-sm font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                placeholder="4421234567"
              />
              {errors.telefono && <p className="text-[11px] text-rose-600 dark:text-rose-400 mt-1">{errors.telefono}</p>}
            </div>
          </div>

          <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? 'Guardando...' : persona ? 'Actualizar Registro' : 'Registrar Persona'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};