package com.vemasmas.api.repository;

import com.vemasmas.api.entity.Domicilio;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface DomicilioRepository extends JpaRepository<Domicilio, Long> {

    List<Domicilio> findByPersonaId(Long personaId);

    List<Domicilio> findByPersonaIdOrderByIdAsc(Long personaId);
}