package com.vemasmas.api.mapper;

import com.vemasmas.api.dto.DomicilioDTO;
import com.vemasmas.api.dto.PersonaDTO;
import com.vemasmas.api.entity.Domicilio;
import com.vemasmas.api.entity.Persona;
import org.springframework.stereotype.Component;
import java.util.stream.Collectors;

@Component
public class PersonaMapper {

    public DomicilioDTO toDomicilioDTO(Domicilio d) {
        return DomicilioDTO.builder()
                .id(d.getId())
                .personaId(d.getPersona() != null ? d.getPersona().getId() : null)
                .calle(d.getCalle())
                .numeroExterior(d.getNumeroExterior())
                .numeroInterior(d.getNumeroInterior())
                .colonia(d.getColonia())
                .codigoPostal(d.getCodigoPostal())
                .municipio(d.getMunicipio())
                .estado(d.getEstado())
                .tipo(d.getTipo())
                .esPrincipal(d.getEsPrincipal())
                .build();
    }

    public Domicilio toDomicilioEntity(DomicilioDTO dto, Persona persona) {
        return Domicilio.builder()
                .id(dto.getId())
                .persona(persona)
                .calle(dto.getCalle())
                .numeroExterior(dto.getNumeroExterior())
                .numeroInterior(dto.getNumeroInterior())
                .colonia(dto.getColonia())
                .codigoPostal(dto.getCodigoPostal())
                .municipio(dto.getMunicipio())
                .estado(dto.getEstado())
                .tipo(dto.getTipo() != null ? dto.getTipo() : "CASA")
                .esPrincipal(dto.getEsPrincipal() != null ? dto.getEsPrincipal() : false)
                .build();
    }

    public PersonaDTO toPersonaDTO(Persona p) {
        return PersonaDTO.builder()
                .id(p.getId())
                .nombre(p.getNombre())
                .apellidoPaterno(p.getApellidoPaterno())
                .apellidoMaterno(p.getApellidoMaterno())
                .curp(p.getCurp())
                .rfc(p.getRfc())
                .fechaNacimiento(p.getFechaNacimiento())
                .email(p.getEmail())
                .telefono(p.getTelefono())
                .fechaRegistro(p.getFechaRegistro())
                .domicilios(p.getDomicilios() != null
                        ? p.getDomicilios().stream().map(this::toDomicilioDTO).collect(Collectors.toList())
                        : null)
                .build();
    }
}