package com.vemasmas.api.controller;

import com.vemasmas.api.dto.DomicilioDTO;
import com.vemasmas.api.service.PersonaService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/domicilios")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
@Tag(name = "Domicilios", description = "Operaciones CRUD para Domicilios")
public class DomicilioController {

    private final PersonaService personaService;

    @PostMapping
    @Operation(summary = "Crear domicilio (requiere personaId)")
    public ResponseEntity<DomicilioDTO> crearDomicilio(@Valid @RequestBody DomicilioDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(personaService.crearDomicilio(dto));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Consultar domicilio por ID")
    public ResponseEntity<DomicilioDTO> obtenerPorId(@PathVariable Long id) {
        return ResponseEntity.ok(personaService.obtenerDomicilioPorId(id));
    }

    @GetMapping("/persona/{personaId}")
    @Operation(summary = "Consultar domicilios por persona")
    public ResponseEntity<List<DomicilioDTO>> listarPorPersona(@PathVariable Long personaId) {
        return ResponseEntity.ok(personaService.listarDomiciliosPorPersona(personaId));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Actualizar domicilio")
    public ResponseEntity<DomicilioDTO> actualizar(
            @PathVariable Long id,
            @Valid @RequestBody DomicilioDTO dto) {
        return ResponseEntity.ok(personaService.actualizarDomicilio(id, dto));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar domicilio")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        personaService.eliminarDomicilio(id);
        return ResponseEntity.noContent().build();
    }
}