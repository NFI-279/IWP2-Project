CREATE TABLE roles (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role_id INTEGER NOT NULL REFERENCES roles(id),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE buildings (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE floors (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  image_path VARCHAR(255) NOT NULL,
  building_id INTEGER NOT NULL REFERENCES buildings(id),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE classrooms (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  capacity INTEGER NOT NULL CHECK (capacity > 0),
  floor_id INTEGER NOT NULL REFERENCES floors(id),

  top_left_x DOUBLE PRECISION NOT NULL,
  top_left_y DOUBLE PRECISION NOT NULL,
  bottom_right_x DOUBLE PRECISION NOT NULL,
  bottom_right_y DOUBLE PRECISION NOT NULL,

  UNIQUE (name, floor_id)
);

CREATE TABLE reservations (
  id SERIAL PRIMARY KEY,
  teacher_id INTEGER NOT NULL REFERENCES users(id),
  classroom_id INTEGER NOT NULL REFERENCES classrooms(id),
  week_number INTEGER NOT NULL CHECK (week_number BETWEEN 1 AND 53),
  day_of_week VARCHAR(20) NOT NULL,
  time_slot INTEGER NOT NULL CHECK (time_slot BETWEEN 1 AND 6),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

  UNIQUE (classroom_id, week_number, day_of_week, time_slot),
  UNIQUE (teacher_id, week_number, day_of_week, time_slot)
);

INSERT INTO roles (name) VALUES ('STUDENT'), ('TEACHER'), ('ADMIN');