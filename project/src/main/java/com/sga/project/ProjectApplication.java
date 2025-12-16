package com.sga.project;

import java.util.List;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.sga.project.models.Barrio;
import com.sga.project.models.Categoria;
import com.sga.project.models.Articulo;
import com.sga.project.models.Rol;
import com.sga.project.models.TipoDoc;
import com.sga.project.models.Usuario;
import com.sga.project.repositoryes.BarrioRepositoryes;
import com.sga.project.repositoryes.CategoriaRepositoryes;
import com.sga.project.repositoryes.ArticuloRepositoryes;
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
			CategoriaRepositoryes categoriaRepo,
			ArticuloRepositoryes articuloRepo,
			PasswordEncoder passwordEncoder) {
		return args -> {
			System.out.println("=== Inicializando base de datos ===");

			// 0. Limpiar roles duplicados si existen
			System.out.println("Verificando datos duplicados...");
			try {
				List<Rol> rolesAdmin = rolRepo.findAll().stream()
						.filter(r -> "ADMIN".equals(r.getNomRol()))
						.toList();
				
				if (rolesAdmin.size() > 1) {
					System.out.println("⚠️  Detectados roles duplicados. Limpiando toda la base de datos...");
					// Eliminar todos los usuarios y roles para empezar limpio
					usuarioRepo.deleteAll();
					rolRepo.deleteAll();
					System.out.println("✅ Datos de usuarios y roles limpiados");
				}
			} catch (Exception e) {
				System.out.println("Verificación completada: " + e.getMessage());
			}

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
				String[] barrios = {"Bosa el recreo", "La victoria", "Castilla"};
				for (String nombreBarrio : barrios) {
					Barrio barrio = new Barrio();
					barrio.setNomBar(nombreBarrio);
					barrioRepo.save(barrio);
				}
				System.out.println("✅ Barrios creados");
			}

			// 3. Crear roles si no existen
			System.out.println("Creando o verificando roles...");
			Rol adminRol;
			Rol vendedorRol;
			Rol clienteRol;
			
			try {
				// Intentar buscar roles existentes
				List<Rol> allRoles = rolRepo.findAll();
				
				// Buscar ADMIN
				adminRol = allRoles.stream()
						.filter(r -> "ADMIN".equals(r.getNomRol()))
						.findFirst()
						.orElseGet(() -> {
							System.out.println("Creando rol ADMIN...");
							Rol newRol = new Rol();
							newRol.setNomRol("ADMIN");
							return rolRepo.save(newRol);
						});
				
				// Buscar VENDEDOR
				vendedorRol = allRoles.stream()
						.filter(r -> "VENDEDOR".equals(r.getNomRol()))
						.findFirst()
						.orElseGet(() -> {
							System.out.println("Creando rol VENDEDOR...");
							Rol newRol = new Rol();
							newRol.setNomRol("VENDEDOR");
							return rolRepo.save(newRol);
						});
				
				// Buscar CLIENTE
				clienteRol = allRoles.stream()
						.filter(r -> "CLIENTE".equals(r.getNomRol()))
						.findFirst()
						.orElseGet(() -> {
							System.out.println("Creando rol CLIENTE...");
							Rol newRol = new Rol();
							newRol.setNomRol("CLIENTE");
							return rolRepo.save(newRol);
						});
				
				System.out.println("✅ Roles verificados/creados");
			} catch (Exception e) {
				System.out.println("Error al gestionar roles: " + e.getMessage());
				throw e;
			}

			// 4. Verificar y crear usuarios si no existen
			boolean usuariosExisten = usuarioRepo.findByCorreoElec("admin@ejemplo.com").isPresent();
			
			if (!usuariosExisten) {
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
			} else {
				System.out.println("✅ Los usuarios iniciales ya están creados");
			}

			// 5. Crear categorías si no existen
			long catCount = categoriaRepo.count();
			System.out.println("Categorías existentes: " + catCount);
			
			if (catCount == 0) {
				System.out.println("\n=== Creando categorías ===");
				Categoria catDama = new Categoria();
				catDama.setNomCate("Vestidos");
				catDama = categoriaRepo.save(catDama);

				Categoria catCaballero = new Categoria();
				catCaballero.setNomCate("Trajes");
				catCaballero = categoriaRepo.save(catCaballero);

				Categoria catNino = new Categoria();
				catNino.setNomCate("Smoking");
				catNino = categoriaRepo.save(catNino);

				System.out.println("✅ Categorías creadas");

				// ⚠️ ARTÍCULOS DE MUESTRA DESACTIVADOS
				// Si deseas crear artículos de muestra, descomenta el código a continuación
				
				/* 
				// 6. Crear artículos de muestra
				System.out.println("\n=== Creando artículos de muestra ===");

				// Artículos para dama
				crearArticulo(articuloRepo, "Vestido Elegante Rojo", "Femenino", "M", "Rojo", 150000, 
					"https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400", catDama);
				crearArticulo(articuloRepo, "Vestido de Noche Azul", "Femenino", "S", "Azul", 200000, 
					"https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=400", catDama);
				crearArticulo(articuloRepo, "Vestido Casual Blanco", "Femenino", "L", "Blanco", 120000, 
					"https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400", catDama);
				crearArticulo(articuloRepo, "Vestido de Fiesta Negro", "Femenino", "M", "Negro", 180000, 
					"https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=400", catDama);
				crearArticulo(articuloRepo, "Vestido Verano Amarillo", "Femenino", "S", "Amarillo", 130000, 
					"https://images.unsplash.com/photo-1617019114583-affb34d1b3cd?w=400", catDama);
				crearArticulo(articuloRepo, "Vestido Largo Verde", "Femenino", "L", "Verde", 160000, 
					"https://images.unsplash.com/photo-1612423284934-2850a4ea6b0f?w=400", catDama);

				// Artículos para caballero
				crearArticulo(articuloRepo, "Traje Ejecutivo Negro", "Masculino", "L", "Negro", 250000, 
					"https://images.unsplash.com/photo-1594938291221-94f18cbb5660?w=400", catCaballero);
				crearArticulo(articuloRepo, "Smoking Azul Marino", "Masculino", "M", "Azul Marino", 280000, 
					"https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400", catCaballero);
				crearArticulo(articuloRepo, "Traje Gris Oxford", "Masculino", "XL", "Gris", 230000, 
					"https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=400", catCaballero);
				crearArticulo(articuloRepo, "Traje Casual Beige", "Masculino", "L", "Beige", 190000, 
					"https://images.unsplash.com/photo-1598808503491-c8c5ac9ee097?w=400", catCaballero);

				// Artículos para niño
				crearArticulo(articuloRepo, "Vestido Niña Rosa", "Femenino", "8", "Rosa", 80000, 
					"https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=400", catNino);
				crearArticulo(articuloRepo, "Traje Niño Azul", "Masculino", "10", "Azul", 90000, 
					"https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=400", catNino);
				crearArticulo(articuloRepo, "Vestido Niña Lila", "Femenino", "6", "Lila", 75000, 
					"https://images.unsplash.com/photo-1621452773781-0f992fd1f5cb?w=400", catNino);
				crearArticulo(articuloRepo, "Traje Niño Negro", "Masculino", "12", "Negro", 95000, 
					"https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=400", catNino);

				System.out.println("✅ 14 artículos creados (6 para dama, 4 para caballero, 4 para niño)");
				*/
			} else {
				System.out.println("✅ Las categorías ya existen (" + catCount + " categorías)");
				long artCount = articuloRepo.count();
				System.out.println("✅ Artículos existentes: " + artCount);
			}

			System.out.println("\n==========================================");
		};
	}

	private void crearArticulo(ArticuloRepositoryes repo, String nombre, String genero, 
								String talla, String color, Integer precio, String foto, Categoria categoria) {
		Articulo articulo = new Articulo();
		articulo.setNomArt(nombre);
		articulo.setGenero(genero);
		articulo.setTalla(talla);
		articulo.setColor(color);
		articulo.setPrecio(precio);
		articulo.setFoto(foto);
		articulo.setCategoria(categoria);
		repo.save(articulo);
	}
}
