package com.vemasmas.api.service;

import com.vemasmas.api.dto.DomicilioDTO;
import com.vemasmas.api.dto.PersonaDTO;
import com.vemasmas.api.entity.Domicilio;
import com.vemasmas.api.entity.Persona;
import com.vemasmas.api.exception.BusinessException;
import com.vemasmas.api.exception.ResourceNotFoundException;
import com.vemasmas.api.mapper.PersonaMapper;
import com.vemasmas.api.repository.DomicilioRepository;
import com.vemasmas.api.repository.PersonaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PersonaService {

    private final PersonaRepository personaRepository;
    private final DomicilioRepository domicilioRepository;
    private final PersonaMapper mapper;

    @Transactional(readOnly = true)
    public Page<PersonaDTO> listarPersonas(String search, Pageable pageable) {
        return personaRepository.searchPersonas(search, pageable).map(mapper::toPersonaDTO);
    }

    @Transactional(readOnly = true)
    public List<PersonaDTO> listarTodasParaExportar() {
        return personaRepository.findAll().stream()
                .map(mapper::toPersonaDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public PersonaDTO obtenerPorId(Long id) {
        Persona persona = personaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Persona no encontrada con ID: " + id));
        return mapper.toPersonaDTO(persona);
    }

    @Transactional
    public PersonaDTO crearPersona(PersonaDTO dto) {
        if (personaRepository.existsByCurpIgnoreCase(dto.getCurp())) {
            throw new BusinessException("La CURP ingresada ya se encuentra registrada");
        }
        if (personaRepository.existsByRfcIgnoreCase(dto.getRfc())) {
            throw new BusinessException("El RFC ingresado ya se encuentra registrado");
        }
        if (personaRepository.existsByEmailIgnoreCase(dto.getEmail())) {
            throw new BusinessException("El correo electrónico ya se encuentra registrado");
        }

        Persona persona = Persona.builder()
                .nombre(dto.getNombre().trim())
                .apellidoPaterno(dto.getApellidoPaterno().trim())
                .apellidoMaterno(dto.getApellidoMaterno() != null ? dto.getApellidoMaterno().trim() : null)
                .curp(dto.getCurp().trim().toUpperCase())
                .rfc(dto.getRfc().trim().toUpperCase())
                .fechaNacimiento(dto.getFechaNacimiento())
                .email(dto.getEmail().trim().toLowerCase())
                .telefono(dto.getTelefono().trim())
                .fechaRegistro(LocalDateTime.now())
                .build();

        if (dto.getDomicilios() != null && !dto.getDomicilios().isEmpty()) {
            List<Domicilio> domicilios = dto.getDomicilios().stream()
                    .map(d -> mapper.toDomicilioEntity(d, persona))
                    .collect(Collectors.toList());
            persona.setDomicilios(domicilios);
        }

        return mapper.toPersonaDTO(personaRepository.save(persona));
    }

    @Transactional
    public PersonaDTO actualizarPersona(Long id, PersonaDTO dto) {
        Persona persona = personaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Persona no encontrada con ID: " + id));

        if (personaRepository.existsByCurpIgnoreCaseAndIdNot(dto.getCurp(), id)) {
            throw new BusinessException("La CURP ya pertenece a otro registro");
        }
        if (personaRepository.existsByRfcIgnoreCaseAndIdNot(dto.getRfc(), id)) {
            throw new BusinessException("El RFC ya pertenece a otro registro");
        }
        if (personaRepository.existsByEmailIgnoreCaseAndIdNot(dto.getEmail(), id)) {
            throw new BusinessException("El correo electrónico ya pertenece a otro registro");
        }

        persona.setNombre(dto.getNombre().trim());
        persona.setApellidoPaterno(dto.getApellidoPaterno().trim());
        persona.setApellidoMaterno(dto.getApellidoMaterno() != null ? dto.getApellidoMaterno().trim() : null);
        persona.setCurp(dto.getCurp().trim().toUpperCase());
        persona.setRfc(dto.getRfc().trim().toUpperCase());
        persona.setFechaNacimiento(dto.getFechaNacimiento());
        persona.setEmail(dto.getEmail().trim().toLowerCase());
        persona.setTelefono(dto.getTelefono().trim());

        if (dto.getDomicilios() != null) {
            persona.getDomicilios().clear();
            dto.getDomicilios().forEach(d -> persona.getDomicilios().add(mapper.toDomicilioEntity(d, persona)));
        }

        return mapper.toPersonaDTO(personaRepository.save(persona));
    }

    @Transactional
    public void eliminarPersona(Long id) {
        if (!personaRepository.existsById(id)) {
            throw new ResourceNotFoundException("Persona no encontrada con ID: " + id);
        }
        personaRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public List<DomicilioDTO> listarDomiciliosPorPersona(Long personaId) {
        if (!personaRepository.existsById(personaId)) {
            throw new ResourceNotFoundException("Persona no encontrada con ID: " + personaId);
        }
        return domicilioRepository.findByPersonaIdOrderByIdAsc(personaId).stream()
                .map(mapper::toDomicilioDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public DomicilioDTO obtenerDomicilioPorId(Long domicilioId) {
        Domicilio d = domicilioRepository.findById(domicilioId)
                .orElseThrow(() -> new ResourceNotFoundException("Domicilio no encontrado con ID: " + domicilioId));
        return mapper.toDomicilioDTO(d);
    }

    @Transactional
    public DomicilioDTO agregarDomicilio(Long personaId, DomicilioDTO dto) {
        Persona persona = personaRepository.findById(personaId)
                .orElseThrow(() -> new ResourceNotFoundException("Persona no encontrada con ID: " + personaId));
        Domicilio d = mapper.toDomicilioEntity(dto, persona);
        return mapper.toDomicilioDTO(domicilioRepository.save(d));
    }

    @Transactional
    public DomicilioDTO crearDomicilio(DomicilioDTO dto) {
        if (dto.getPersonaId() == null) {
            throw new BusinessException("El ID de la persona asociada es obligatorio");
        }
        return agregarDomicilio(dto.getPersonaId(), dto);
    }

    @Transactional
    public DomicilioDTO actualizarDomicilio(Long domicilioId, DomicilioDTO dto) {
        Domicilio d = domicilioRepository.findById(domicilioId)
                .orElseThrow(() -> new ResourceNotFoundException("Domicilio no encontrado con ID: " + domicilioId));

        d.setCalle(dto.getCalle().trim());
        d.setNumeroExterior(dto.getNumeroExterior().trim());
        d.setNumeroInterior(dto.getNumeroInterior() != null ? dto.getNumeroInterior().trim() : null);
        d.setColonia(dto.getColonia().trim());
        d.setCodigoPostal(dto.getCodigoPostal().trim());
        d.setMunicipio(dto.getMunicipio().trim());
        d.setEstado(dto.getEstado().trim());
        if (dto.getTipo() != null) {
            d.setTipo(dto.getTipo());
        }
        if (dto.getEsPrincipal() != null) {
            d.setEsPrincipal(dto.getEsPrincipal());
        }

        return mapper.toDomicilioDTO(domicilioRepository.save(d));
    }

    @Transactional
    public void eliminarDomicilio(Long domicilioId) {
        if (!domicilioRepository.existsById(domicilioId)) {
            throw new ResourceNotFoundException("Domicilio no encontrado con ID: " + domicilioId);
        }
        domicilioRepository.deleteById(domicilioId);
    }

    @Transactional(readOnly = true)
    public Map<String, Long> obtenerEstadisticas() {
        long totalPersonas = personaRepository.count();
        long totalDomicilios = domicilioRepository.count();
        return Map.of(
                "totalPersonas", totalPersonas,
                "totalDomicilios", totalDomicilios
        );
    }
}