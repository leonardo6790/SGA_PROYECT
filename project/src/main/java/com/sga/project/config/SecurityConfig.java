package com.sga.project.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.sga.project.security.JwtAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthFilter) {
        this.jwtAuthFilter = jwtAuthFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> {})
                .authorizeHttpRequests(auth -> auth
                        // Endpoints públicos
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers("/api/setup/**").permitAll() // Endpoint de configuración
                        .requestMatchers("/uploads/**").permitAll() // Permitir acceso a imágenes sin autenticación
                        
                        // Endpoints solo para ADMIN
                        .requestMatchers("/api/usu/**").hasRole("ADMIN")
                        
                        // ARTÍCULOS: Vendedor puede ver, crear y editar, pero NO eliminar
                        .requestMatchers(HttpMethod.GET, "/api/articulos/**").hasAnyRole("ADMIN", "VENDEDOR")
                        .requestMatchers(HttpMethod.POST, "/api/articulos/**").hasAnyRole("ADMIN", "VENDEDOR")
                        .requestMatchers(HttpMethod.PUT, "/api/articulos/**").hasAnyRole("ADMIN", "VENDEDOR")
                        .requestMatchers(HttpMethod.DELETE, "/api/articulos/**").hasRole("ADMIN")
                        
                        // PAGOS: ADMIN y VENDEDOR pueden acceder (crear, consultar y actualizar)
                        .requestMatchers("/api/pagos/**").hasAnyRole("ADMIN", "VENDEDOR")
                        
                        // Endpoints para ADMIN y VENDEDOR
                        .requestMatchers("/api/AlquilerArticulos/**").hasAnyRole("ADMIN", "VENDEDOR")
                        .requestMatchers("/api/alquiler/**").hasAnyRole("ADMIN", "VENDEDOR")
                        .requestMatchers("/api/cat/**").hasAnyRole("ADMIN", "VENDEDOR")
                        .requestMatchers("/api/cli/**").hasAnyRole("ADMIN", "VENDEDOR")
                        .requestMatchers("/api/categoria/**").hasAnyRole("ADMIN", "VENDEDOR")
                        .requestMatchers("/api/barrio/**").hasAnyRole("ADMIN", "VENDEDOR")
                        .requestMatchers("/api/tipodoc/**").hasAnyRole("ADMIN", "VENDEDOR")
                        
                        // Todos los demás endpoints requieren autenticación
                        .anyRequest().authenticated())
                .exceptionHandling(exceptions -> exceptions
                        // Acceso denegado (sin permisos) -> 401
                        .accessDeniedHandler((request, response, accessDeniedException) -> {
                            response.setStatus(401);
                            response.setContentType("application/json");
                            response.getWriter().write("{\"error\":\"No autorizado\",\"message\":\"No tienes permisos suficientes para realizar esta acción\",\"status\":401}");
                        })
                        // No autenticado (sin token o token inválido) -> 401
                        .authenticationEntryPoint((request, response, authException) -> {
                            response.setStatus(401);
                            response.setContentType("application/json");
                            response.getWriter().write("{\"error\":\"No autenticado\",\"message\":\"Debes iniciar sesión para acceder a este recurso\",\"status\":401}");
                        }))
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}
