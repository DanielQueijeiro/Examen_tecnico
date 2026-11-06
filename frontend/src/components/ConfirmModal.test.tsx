import '@testing-library/jest-dom/vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ConfirmModal } from './ConfirmModal';

describe('ConfirmModal Component', () => {
  it('no debe renderizarse cuando isOpen es false', () => {
    render(
      <ConfirmModal
        isOpen={false}
        title="Eliminar"
        message="¿Estás seguro?"
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
      />
    );
    expect(screen.queryByText('Eliminar')).not.toBeInTheDocument();
  });

  it('debe renderizar título, mensaje y responder a clics', () => {
    const handleConfirm = vi.fn();
    const handleCancel = vi.fn();

    render(
      <ConfirmModal
        isOpen={true}
        title="Confirmar Acción"
        message="¿Deseas continuar?"
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    );

    expect(screen.getByText('Confirmar Acción')).toBeInTheDocument();
    expect(screen.getByText('¿Deseas continuar?')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Sí, eliminar'));
    expect(handleConfirm).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByText('Cancelar'));
    expect(handleCancel).toHaveBeenCalledTimes(1);
  });
});