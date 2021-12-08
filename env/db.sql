create table tipo (
	id_tipo int (1) not null primary key,
	descripcion varchar (255)
);



create table alumnos (
	id_usuario bigint not null primary key auto_increment,
	nombre varchar(255) not null,
	appat varchar(255) not null,
	apmat varchar(255) not null,
	num_boleta INT(10),
	pass varchar(255) not null
);

create table gestion (
	id_usuario bigint not null primary key auto_increment,
	nombre varchar(255) not null,
	appat varchar(255) not null,
	apmat varchar(255) not null,
	area VARCHAR(255) not null);

create table publicacion (
	id_publicacion bigint not null primary key auto_increment,
	id_usuario bigint not null,
	fecha_publicacion date not null,
	ruta_contenido mediumtext not null,
	texto mediumtext not null,
	habilitado tinyint not null,
	foreign key (id_usuario) references usuarios(id_usuario)

);

create table comentario (
	id_comentario bigint not null primary key auto_increment,
	id_usuario bigint not null,
	fecha_publicacion date not null,
	habilitado tinyint not null,
	foreign key (id_usuario) references usuarios(id_usuario)
);

create table publicacion_comentario (
	id_publicacion bigint not null,
	id_comentario bigint not null,
	primary key (id_publicacion,id_comentario),
	foreign key (id_publicacion) references publicacion (id_publicacion),
	foreign key (id_comentario) references comentario (id_comentario)

);

create table pregunta (
	id_pregunta bigint not null primary key auto_increment,
	descripcion varchar (255) not null
);


create table mensaje (
	id_mensaje bigint not null primary key auto_increment,
	cuerpo mediumtext not null,
	hora_envio time not null
);

create table mensaje_usuario (
	id_mensaje bigint not null,
	id_remitente bigint not null,
	id_destinatario bigint not null,
	primary key (id_remitente,id_destinatario),
	foreign key (id_mensaje) references mensaje(id_mensaje),
	foreign key (id_remitente) references usuarios(id_usuario),
	foreign key (id_destinatario) references usuarios (id_usuario)
);

create table sesion (
	id_sesion bigint not null primary key ,
	id_usuario bigint not null,
	foreign key (id_usuario) references usuarios(id_usuario)
);
create table areas (
	id_areas bigint not null primary key auto_increment,
	descripcion varchar (255)
);
create table sesion_areas (
	id_sesion bigint not null,
	id_areas  bigint not null,
	foreign key (id_sesion) references sesion(id_sesion),
	foreign key (id_areas) references areas (id_areas)

);

create table pregunta_usuario(
	id_pregunta bigint not null,
	id_usuario bigint not null,
	foreign key (id_pregunta) references pregunta(id_pregunta),
	foreign key (id_usuario) references usuarios (id_usuario)
);