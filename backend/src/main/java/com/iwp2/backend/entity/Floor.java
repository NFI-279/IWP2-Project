package com.iwp2.backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import com.fasterxml.jackson.annotation.JsonIgnore;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "floors")
@Getter
@Setter
public class Floor {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(nullable = false)
	private String name;

	@Column(name = "image_path", nullable = false)
	private String imagePath;

	@Column(name = "created_at")
	private LocalDateTime createdAt;

	@ManyToOne
	@JoinColumn(name = "building_id", nullable = false)
	@JsonIgnore
	private Building building;

	@OneToMany(mappedBy = "floor", cascade = CascadeType.ALL)
	private List<Classroom> classrooms;

	@PrePersist
	public void prePersist() {
		createdAt = LocalDateTime.now();
	}
}