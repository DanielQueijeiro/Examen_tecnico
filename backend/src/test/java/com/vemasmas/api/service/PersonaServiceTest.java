package com.vemasmas.api.service;

import com.vemasmas.api.dto.PersonaDTO;
import com.vemasmas.api.entity.Persona;
import com.vemasmas.api.exception.BusinessException;
import com.vemasmas.api.exception.ResourceNotFoundException;
import com.vemasmas.api.mapper.PersonaMapper;
import com.vemasmas.api.repository.DomicilioRepository;
import com.vemasmas.api.repository.PersonaRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PersonaServiceTest {

    @Mock
    private PersonaRepository personaRepository;

    @Mock
    private DomicilioRepository domicilioRepository;

    @Mock
    private PersonaMapper mapper;

    @InjectMocks
    private PersonaService personaService;

    private Persona persona;
    private PersonaDTO personaDTO;

    @BeforeEach
    void setUp() {
        persona = Persona.builder()
                .id(1L)
                .nombre("Juan")
                .apellidoPaterno("Pérez")
                .curp("PERJ900101HDFRRN01")
                .rfc("PERJ900101XX1")
                .email("juan.perez@ejemplo.com")
                .telefono("4421234567")
                .fechaNacimiento(LocalDate.of(1990, 1, 1))
                .build();

        personaDTO = PersonaDTO.builder()
                .id(1L)
                .nombre("Juan")
                .apellidoPaterno("Pérez")
                .curp("PERJ900101HDFRRN01")
                .rfc("PERJ900101XX1")
                .email("juan.perez@ejemplo.com")
                .telefono("4421234567")
                .fechaNacimiento(LocalDate.of(1990, 1, 1))
                .build();
    }

    @Test
    @DisplayName("Debe consultar una persona por ID exitosamente")
    void testObtenerPorIdExitoso() {
        when(personaRepository.findById(1L)).thenReturn(Optional.of(persona));
        when(mapper.toPersonaDTO(persona)).thenReturn(personaDTO);

        PersonaDTO resultado = personaService.obtenerPorId(1L);

        assertNotNull(resultado);
        assertEquals("Juan", resultado.getNombre());
        assertEquals("PERJ900101HDFRRN01", resultado.getCurp());
        verify(personaRepository, times(1)).findById(1L);
    }

    @Test
    @DisplayName("Debe lanzar excepción si la persona no existe")
    void testObtenerPorIdNoExiste() {
        when(personaRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> personaService.obtenerPorId(99L));
    }

    @Test
    @DisplayName("Debe lanzar BusinessException si la CURP ya existe")
    void testCrearPersonaCurpDuplicada() {
        when(personaRepository.existsByCurpIgnoreCase("PERJ900101HDFRRN01")).thenReturn(true);

        assertThrows(BusinessException.class, () -> personaService.crearPersona(personaDTO));
        verify(personaRepository, never()).save(any(Persona.class));
    }

    @Test
    @DisplayName("Debe crear una persona exitosamente")
    void testCrearPersonaExitoso() {
        when(personaRepository.existsByCurpIgnoreCase(anyString())).thenReturn(false);
        when(personaRepository.existsByRfcIgnoreCase(anyString())).thenReturn(false);
        when(personaRepository.existsByEmailIgnoreCase(anyString())).thenReturn(false);
        when(personaRepository.save(any(Persona.class))).thenReturn(persona);
        when(mapper.toPersonaDTO(any(Persona.class))).thenReturn(personaDTO);

        PersonaDTO resultado = personaService.crearPersona(personaDTO);

        assertNotNull(resultado);
        assertEquals("Juan", resultado.getNombre());
        verify(personaRepository, times(1)).save(any(Persona.class));
    }
}