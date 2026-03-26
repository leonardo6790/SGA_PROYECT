package com.sga.project.repositoryes;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.sga.project.models.Usuario;

@Repository
public interface UsuarioRepositoryes extends JpaRepository<Usuario, Integer> {
    Optional<Usuario> findByCorreoElec(String correoElec);

    @Query("SELECT u FROM Usuario u WHERE u.rol.nomRol IN ('ADMIN', 'VENDEDOR') AND u.activo = true")
    List<Usuario> findVendedores();
}
