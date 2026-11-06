package com.vemasmas.api.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.vemasmas.api.dto.PersonaDTO;
import com.vemasmas.api.exception.ResourceNotFoundException;
import com.vemasmas.api.service.PersonaService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(PersonaController.class)
class PersonaControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private PersonaService personaService;

    @Test
    @DisplayName("GET /api/personas/{id} - Debe retornar 200 OK cuando existe")
    void testObtenerPorIdExitoso() throws Exception {
        PersonaDTO persona = PersonaDTO.builder()
                .id(1L)
                .nombre("Carlos")
                .apellidoPaterno("Mendoza")
                .curp("MERC900512HQTMRN01")
                .rfc("MERC900512AB1")
                .email("carlos@ejemplo.com")
                .telefono("4421234567")
                .fechaNacimiento(LocalDate.of(1990, 5, 12))
                .build();

        when(personaService.obtenerPorId(1L)).thenReturn(persona);

        mockMvc.perform(get("/api/personas/1")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.nombre").value("Carlos"))
                .andExpect(jsonPath("$.curp").value("MERC900512HQTMRN01"));
    }

    @Test
    @DisplayName("GET /api/personas/{id} - Debe retornar 404 NOT FOUND cuando no existe")
    void testObtenerPorIdNoEncontrado() throws Exception {
        when(personaService.obtenerPorId(99L))
                .thenThrow(new ResourceNotFoundException("Persona no encontrada con ID: 99"));

        mockMvc.perform(get("/api/personas/99")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404));
    }

    @Test
    @DisplayName("POST /api/personas - Debe retornar 201 CREATED al registrar persona válida")
    void testCrearPersonaExitoso() throws Exception {
        PersonaDTO personaDTO = PersonaDTO.builder()
                .nombre("Sofía")
                .apellidoPaterno("Hernández")
                .curp("HELS940823MQTNLR02")
                .rfc("HELS940823XY9")
                .email("sofia@ejemplo.com")
                .telefono("4429876543")
                .fechaNacimiento(LocalDate.of(1994, 8, 23))
                .build();

        PersonaDTO personaCreada = PersonaDTO.builder()
                .id(2L)
                .nombre("Sofía")
                .apellidoPaterno("Hernández")
                .curp("HELS940823MQTNLR02")
                .rfc("HELS940823XY9")
                .email("sofia@ejemplo.com")
                .telefono("4429876543")
                .fechaNacimiento(LocalDate.of(1994, 8, 23))
                .build();

        when(personaService.crearPersona(any(PersonaDTO.class))).thenReturn(personaCreada);

        mockMvc.perform(post("/api/personas")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(personaDTO)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(2))
                .andExpect(jsonPath("$.nombre").value("Sofía"));
    }

    @Test
    @DisplayName("POST /api/personas - Debe retornar 400 BAD REQUEST con datos inválidos")
    void testCrearPersonaDatosInvalidos() throws Exception {
        // Objeto sin nombre, con teléfono incorrecto y sin CURP
        PersonaDTO personaInvalida = PersonaDTO.builder()
                .nombre("")
                .apellidoPaterno("")
                .telefono("123") // no cumple 10 dígitos
                .build();

        mockMvc.perform(post("/api/personas")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(personaInvalida)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400));
    }

    @Test
    @DisplayName("DELETE /api/personas/{id} - Debe retornar 204 NO CONTENT al eliminar")
    void testEliminarPersona() throws Exception {
        mockMvc.perform(delete("/api/personas/1"))
                .andExpect(status().isNoContent());
    }
}