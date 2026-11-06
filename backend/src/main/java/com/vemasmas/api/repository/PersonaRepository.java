package com.vemasmas.api.repository;

import com.vemasmas.api.entity.Persona;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface PersonaRepository extends JpaRepository<Persona, Long> {

    @Query("SELECT p FROM Persona p WHERE " +
           "(:search IS NULL OR :search = '' OR " +
           " LOWER(p.nombre) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           " LOWER(p.apellidoPaterno) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           " LOWER(p.apellidoMaterno) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           " LOWER(p.curp) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           " LOWER(p.rfc) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           " LOWER(p.email) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<Persona> searchPersonas(@Param("search") String search, Pageable pageable);

    boolean existsByCurpIgnoreCase(String curp);
    boolean existsByRfcIgnoreCase(String rfc);
    boolean existsByEmailIgnoreCase(String email);
    boolean existsByCurpIgnoreCaseAndIdNot(String curp, Long id);
    boolean existsByRfcIgnoreCaseAndIdNot(String rfc, Long id);
    boolean existsByEmailIgnoreCaseAndIdNot(String email, Long id);
}