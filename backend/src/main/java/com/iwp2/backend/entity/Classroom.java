package com.iwp2.backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "classrooms")
@Getter
@Setter
public class Classroom {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(nullable = false)
	private String name;

	@Column(nullable = false)
	private Integer capacity;

	@ManyToOne
	@JoinColumn(name = "floor_id", nullable = false)
	@JsonIgnore
	private Floor floor;

	@Column(name = "top_left_x", nullable = false)
	private Double topLeftX;

	@Column(name = "top_left_y", nullable = false)
	private Double topLeftY;

	@Column(name = "bottom_right_x", nullable = false)
	private Double bottomRightX;

	@Column(name = "bottom_right_y", nullable = false)
	private Double bottomRightY;
}