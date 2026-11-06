package com.vemasmas.api.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "domicilios")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Domicilio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "persona_id", nullable = false)
    private Persona persona;

    @Column(nullable = false, length = 150)
    private String calle;

    @Column(name = "numero_exterior", nullable = false, length = 20)
    private String numeroExterior;

    @Column(name = "numero_interior", length = 20)
    private String numeroInterior;

    @Column(nullable = false, length = 100)
    private String colonia;

    @Column(name = "codigo_postal", nullable = false, length = 10)
    private String codigoPostal;

    @Column(nullable = false, length = 100)
    private String municipio;

    @Column(nullable = false, length = 100)
    private String estado;

    @Column(length = 50)
    @Builder.Default
    private String tipo = "CASA";

    @Column(name = "es_principal")
    @Builder.Default
    private Boolean esPrincipal = false;
}