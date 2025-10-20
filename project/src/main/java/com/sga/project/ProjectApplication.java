package com.sga.project;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.sga.project.models.Barrio;
import com.sga.project.models.Rol;
import com.sga.project.models.TipoDoc;
import com.sga.project.models.Usuario;
import com.sga.project.repositoryes.BarrioRepositoryes;
import com.sga.project.repositoryes.RolRepositoryes;
import com.sga.project.repositoryes.TipoDocRepositoryes;
import com.sga.project.repositoryes.UsuarioRepositoryes;

@SpringBootApplication
public class ProjectApplication {

	public static void main(String[] args) {
		SpringApplication.run(ProjectApplication.class, args);
	}

	@Bean
	CommandLineRunner initDatabase(
			UsuarioRepositoryes usuarioRepo,
			RolRepositoryes rolRepo,
			BarrioRepositoryes barrioRepo,
			TipoDocRepositoryes tipoDocRepo,
			PasswordEncoder passwordEncoder) {
		return args -> {
			System.out.println("=== Inicializando base de datos ===");

			// 1. Crear tipos de documento si no existen
			if (tipoDocRepo.count() == 0) {
				System.out.println("Creando tipos de documento...");
				TipoDoc cc = new TipoDoc();
				cc.setNomDoc("Cédula de Ciudadanía");
				tipoDocRepo.save(cc);

				TipoDoc ce = new TipoDoc();
				ce.setNomDoc("Cédula de Extranjería");
				tipoDocRepo.save(ce);

				TipoDoc pasaporte = new TipoDoc();
				pasaporte.setNomDoc("Pasaporte");
				tipoDocRepo.save(pasaporte);

				TipoDoc nit = new TipoDoc();
				nit.setNomDoc("NIT");
				tipoDocRepo.save(nit);

				System.out.println("✅ Tipos de documento creados");
			}

			// 2. Crear barrios si no existen
			if (barrioRepo.count() == 0) {
				System.out.println("Creando barrios...");
				String[] barrios = {"Centro", "Norte", "Sur", "Oriente", "Occidente"};
				for (String nombreBarrio : barrios) {
					Barrio barrio = new Barrio();
					barrio.setNomBar(nombreBarrio);
					barrioRepo.save(barrio);
				}
				System.out.println("✅ Barrios creados");
			}

			// 3. Crear roles si no existen
			Rol adminRol = rolRepo.findByNomRol("ADMIN").orElseGet(() -> {
				System.out.println("Creando rol ADMIN...");
				Rol newRol = new Rol();
				newRol.setNomRol("ADMIN");
				return rolRepo.save(newRol);
			});

			Rol vendedorRol = rolRepo.findByNomRol("VENDEDOR").orElseGet(() -> {
				System.out.println("Creando rol VENDEDOR...");
				Rol newRol = new Rol();
				newRol.setNomRol("VENDEDOR");
				return rolRepo.save(newRol);
			});

			rolRepo.findByNomRol("CLIENTE").orElseGet(() -> {
				System.out.println("Creando rol CLIENTE...");
				Rol newRol = new Rol();
				newRol.setNomRol("CLIENTE");
				return rolRepo.save(newRol);
			});

			System.out.println("✅ Roles creados");

			// 4. Verificar si ya existen los usuarios
			if (usuarioRepo.findByCorreoElec("admin@ejemplo.com").isPresent()) {
				System.out.println("✅ Los usuarios iniciales ya están creados");
				return;
			}

			System.out.println("\n=== Creando usuarios iniciales ===");

			// Obtener un barrio y tipo de documento
			Barrio barrio = barrioRepo.findAll().stream().findFirst()
					.orElseThrow(() -> new RuntimeException("No hay barrios en la base de datos"));

			TipoDoc tipoDoc = tipoDocRepo.findAll().stream().findFirst()
					.orElseThrow(() -> new RuntimeException("No hay tipos de documento en la base de datos"));

			// Crear usuario ADMIN
			Usuario admin = new Usuario();
			admin.setNumDoc(1000000001);
			admin.setNom1("Admin");
			admin.setNom2("Super");
			admin.setApe1("Sistema");
			admin.setApe2("Principal");
			admin.setDireccion("Calle Principal #123");
			admin.setNumTel(3001234567L);
			admin.setCorreoElec("admin@ejemplo.com");
			admin.setContraseña(passwordEncoder.encode("admin123"));
			admin.setBarrio(barrio);
			admin.setTipoDoc(tipoDoc);
			admin.setRol(adminRol);
			usuarioRepo.save(admin);

			// Crear usuario VENDEDOR
			Usuario vendedor = new Usuario();
			vendedor.setNumDoc(1000000002);
			vendedor.setNom1("Vendedor");
			vendedor.setNom2("Prueba");
			vendedor.setApe1("Sistema");
			vendedor.setApe2("Test");
			vendedor.setDireccion("Avenida Principal #456");
			vendedor.setNumTel(3009876543L);
			vendedor.setCorreoElec("vendedor@ejemplo.com");
			vendedor.setContraseña(passwordEncoder.encode("vendedor123"));
			vendedor.setBarrio(barrio);
			vendedor.setTipoDoc(tipoDoc);
			vendedor.setRol(vendedorRol);
			usuarioRepo.save(vendedor);

			System.out.println("✅ Usuario ADMIN creado:");
			System.out.println("   Email: admin@ejemplo.com");
			System.out.println("   Contraseña: admin123");

			System.out.println("\n✅ Usuario VENDEDOR creado:");
			System.out.println("   Email: vendedor@ejemplo.com");
			System.out.println("   Contraseña: vendedor123");

			System.out.println("\n==========================================");
		};
	}
}
