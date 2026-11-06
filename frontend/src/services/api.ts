import { Persona, Domicilio, Stats, PageResponse } from '../types';

const API_BASE = 'http://localhost:8080/api';

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let errorMessage = 'Ocurrió un error en el servidor';
    try {
      const errData = await res.json();
      if (errData.errors) {
        errorMessage = Object.values(errData.errors).join(' | ');
      } else if (errData.message) {
        errorMessage = errData.message;
      }
    } catch {
      // Ignorar fallo de parseo JSON
    }
    throw new Error(errorMessage);
  }
  if (res.status === 204) {
    return {} as T;
  }
  return res.json();
}

export const api = {
  getStats: async (): Promise<Stats> => {
    const res = await fetch(`${API_BASE}/personas/stats`);
    return handleResponse<Stats>(res);
  },

  getPersonas: async (search = '', page = 0, size = 6): Promise<PageResponse<Persona>> => {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    params.append('page', page.toString());
    params.append('size', size.toString());

    const res = await fetch(`${API_BASE}/personas?${params.toString()}`);
    return handleResponse<PageResponse<Persona>>(res);
  },

  createPersona: async (persona: Persona): Promise<Persona> => {
    const res = await fetch(`${API_BASE}/personas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(persona),
    });
    return handleResponse<Persona>(res);
  },

  updatePersona: async (id: number, persona: Persona): Promise<Persona> => {
    const res = await fetch(`${API_BASE}/personas/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(persona),
    });
    return handleResponse<Persona>(res);
  },

  deletePersona: async (id: number): Promise<void> => {
    const res = await fetch(`${API_BASE}/personas/${id}`, {
      method: 'DELETE',
    });
    return handleResponse<void>(res);
  },

  getDomiciliosByPersona: async (personaId: number): Promise<Domicilio[]> => {
    const res = await fetch(`${API_BASE}/domicilios/persona/${personaId}`);
    return handleResponse<Domicilio[]>(res);
  },

  createDomicilio: async (domicilio: Domicilio): Promise<Domicilio> => {
    const res = await fetch(`${API_BASE}/domicilios`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(domicilio),
    });
    return handleResponse<Domicilio>(res);
  },

  updateDomicilio: async (id: number, domicilio: Domicilio): Promise<Domicilio> => {
    const res = await fetch(`${API_BASE}/domicilios/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(domicilio),
    });
    return handleResponse<Domicilio>(res);
  },

  deleteDomicilio: async (id: number): Promise<void> => {
    const res = await fetch(`${API_BASE}/domicilios/${id}`, {
      method: 'DELETE',
    });
    return handleResponse<void>(res);
  },
};