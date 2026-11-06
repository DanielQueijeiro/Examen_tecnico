package com.vemasmas.api.controller;

import com.vemasmas.api.dto.DomicilioDTO;
import com.vemasmas.api.dto.PersonaDTO;
import com.vemasmas.api.service.PersonaService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/personas")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
@Tag(name = "Personas y Domicilios", description = "Operaciones CRUD para Personas y sus Domicilios")
public class PersonaController {

    private final PersonaService personaService;

    @GetMapping("/stats")
    @Operation(summary = "Obtener métricas para las tarjetas del Dashboard")
    public ResponseEntity<Map<String, Long>> obtenerEstadisticas() {
        return ResponseEntity.ok(personaService.obtenerEstadisticas());
    }

    @GetMapping("/export")
    @Operation(summary = "Obtener listado completo para exportar")
    public ResponseEntity<List<PersonaDTO>> exportarPersonas() {
        return ResponseEntity.ok(personaService.listarTodasParaExportar());
    }

    @GetMapping
    @Operation(summary = "Listar personas con búsqueda, filtro de estatus y paginación")
    public ResponseEntity<Page<PersonaDTO>> listar(
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(personaService.listarPersonas(
                search, PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "id"))
        ));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener detalle de una persona y sus domicilios")
    public ResponseEntity<PersonaDTO> obtenerPorId(@PathVariable Long id) {
        return ResponseEntity.ok(personaService.obtenerPorId(id));
    }

    @PostMapping
    @Operation(summary = "Crear nueva persona")
    public ResponseEntity<PersonaDTO> crear(@Valid @RequestBody PersonaDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(personaService.crearPersona(dto));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Actualizar datos de una persona")
    public ResponseEntity<PersonaDTO> actualizar(@PathVariable Long id, @Valid @RequestBody PersonaDTO dto) {
        return ResponseEntity.ok(personaService.actualizarPersona(id, dto));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar persona y sus domicilios asociados")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        personaService.eliminarPersona(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/domicilios")
    @Operation(summary = "Consultar todos los domicilios de una persona")
    public ResponseEntity<List<DomicilioDTO>> listarDomiciliosPorPersona(@PathVariable Long id) {
        return ResponseEntity.ok(personaService.listarDomiciliosPorPersona(id));
    }

    @PostMapping("/{id}/domicilios")
    @Operation(summary = "Agregar un domicilio a una persona")
    public ResponseEntity<DomicilioDTO> agregarDomicilio(
            @PathVariable Long id,
            @Valid @RequestBody DomicilioDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(personaService.agregarDomicilio(id, dto));
    }
}