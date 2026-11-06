package com.vemasmas.api.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DomicilioDTO {

    private Long id;
    private Long personaId;

    @NotBlank(message = "La calle es obligatoria")
    @Size(max = 150, message = "La calle no puede exceder 150 caracteres")
    private String calle;

    @NotBlank(message = "El número exterior es obligatorio")
    @Size(max = 20, message = "El número exterior no puede exceder 20 caracteres")
    private String numeroExterior;

    @Size(max = 20, message = "El número interior no puede exceder 20 caracteres")
    private String numeroInterior;

    @NotBlank(message = "La colonia es obligatoria")
    @Size(max = 100, message = "La colonia no puede exceder 100 caracteres")
    private String colonia;

    @NotBlank(message = "El código postal es obligatorio")
    @Size(min = 4, max = 10, message = "El código postal debe tener entre 4 y 10 caracteres")
    private String codigoPostal;

    @NotBlank(message = "El municipio es obligatorio")
    @Size(max = 100, message = "El municipio no puede exceder 100 caracteres")
    private String municipio;

    @NotBlank(message = "El estado es obligatorio")
    @Size(max = 100, message = "El estado no puede exceder 100 caracteres")
    private String estado;

    private String tipo;
    private Boolean esPrincipal;
}