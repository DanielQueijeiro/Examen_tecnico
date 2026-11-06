package com.vemasmas.api.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class PersonaDTO {
    private Long id;

    @NotBlank(message = "El nombre es obligatorio")
    private String nombre;

    @NotBlank(message = "El apellido paterno es obligatorio")
    private String apellidoPaterno;

    private String apellidoMaterno;

    @NotBlank(message = "La CURP es obligatoria")
    @Pattern(
        regexp = "^[A-Z]{4}\\d{6}[HM][A-Z]{5}[A-Z0-9]\\d$",
        message = "Formato de CURP inválido (18 caracteres en mayúsculas)"
    )
    private String curp;

    @NotBlank(message = "El RFC es obligatorio")
    @Pattern(
        regexp = "^[A-ZÑ&]{3,4}\\d{6}[A-Z0-9]{3}$",
        message = "Formato de RFC inválido (12 o 13 caracteres en mayúsculas)"
    )
    private String rfc;

    @NotNull(message = "La fecha de nacimiento es obligatoria")
    private LocalDate fechaNacimiento;

    @NotBlank(message = "El correo electrónico es obligatorio")
    @Email(message = "El formato del correo electrónico no es válido")
    private String email;

    @NotBlank(message = "El teléfono es obligatorio")
    @Pattern(regexp = "^\\d{10}$", message = "El teléfono debe contener 10 dígitos numéricos")
    private String telefono;

    private LocalDateTime fechaRegistro;

    @Valid
    @Builder.Default
    private List<DomicilioDTO> domicilios = new ArrayList<>();
}