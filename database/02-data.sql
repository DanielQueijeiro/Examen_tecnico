INSERT INTO personas (nombre, apellido_paterno, apellido_materno, curp, rfc, fecha_nacimiento, email, telefono) VALUES
('Carlos', 'Mendoza', 'Ruiz', 'MERC900512HQTMRN01', 'MERC900512AB1', '1990-05-12', 'carlos.mendoza@ejemplo.mx', '4421234567'),
('Sofía', 'Hernández', 'López', 'HELS940823MQTNR02', 'HELS940823XY9', '1994-08-23', 'sofia.hernandez@ejemplo.mx', '4429876543'),
('Alejandro', 'Torres', 'Vargas', 'TOVA881104HQTRL08', 'TOVA881104KL2', '1988-11-04', 'alejandro.torres@ejemplo.mx', '4423344556')
ON CONFLICT (curp) DO NOTHING;

INSERT INTO domicilios (persona_id, calle, numero_exterior, numero_interior, colonia, codigo_postal, municipio, estado, tipo, es_principal) VALUES
(1, 'Av. 5 de Mayo', '124', 'B', 'Centro Histórico', '76000', 'Querétaro', 'Querétaro', 'CASA', true),
(1, 'Paseo Constituyentes', '802', NULL, 'El Pueblito', '76900', 'Corregidora', 'Querétaro', 'TRABAJO', false),
(2, 'Blvd. Bernardo Quintana', '450', 'Piso 3', 'Arboledas', '76140', 'Querétaro', 'Querétaro', 'CASA', true),
(3, 'Carretera Huimilpan', '15', NULL, 'El Cimatario', '76090', 'Querétaro', 'Querétaro', 'CASA', true)
ON CONFLICT DO NOTHING;