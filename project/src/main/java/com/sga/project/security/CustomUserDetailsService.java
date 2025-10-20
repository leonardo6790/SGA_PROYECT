package com.sga.project.security;

import java.util.Collections;

import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.sga.project.models.Usuario;
import com.sga.project.repositoryes.UsuarioRepositoryes;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UsuarioRepositoryes usuarioRepository;

    public CustomUserDetailsService(UsuarioRepositoryes usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Usuario usuario = usuarioRepository.findByCorreoElec(email)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado: " + email));

        return User.builder()
                .username(usuario.getCorreoElec())
                .password(usuario.getContraseña())
                .authorities(Collections.singletonList(
                        new SimpleGrantedAuthority("ROLE_" + usuario.getRol().getNomRol())))
                .build();
    }
}
