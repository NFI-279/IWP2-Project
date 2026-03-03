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

CREATE TABLE classrooms (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  capacity INTEGER NOT NULL CHECK (capacity > 0),
  building_id INTEGER NOT NULL REFERENCES buildings(id),
  UNIQUE (name, building_id)
);

CREATE TABLE reservations (
  id SERIAL PRIMARY KEY,
  teacher_id INTEGER NOT NULL REFERENCES users(id),
  classroom_id INTEGER NOT NULL REFERENCES classrooms(id),
  week_number INTEGER NOT NULL CHECK (week_number >= 1 AND week_number <= 53),
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 1 AND day_of_week <= 7),
  time_slot INTEGER NOT NULL CHECK (time_slot >= 1 AND time_slot <= 12),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (classroom_id, week_number, day_of_week, time_slot),
  UNIQUE (teacher_id, week_number, day_of_week, time_slot)
);

-- seed roles
INSERT INTO roles (name) VALUES ('STUDENT'), ('TEACHER'), ('ADMIN');