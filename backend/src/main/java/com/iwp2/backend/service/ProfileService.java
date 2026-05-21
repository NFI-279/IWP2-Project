package com.iwp2.backend.service;

import com.iwp2.backend.dto.ProfileDashboardResponse;
import com.iwp2.backend.dto.ProfileStat;
import com.iwp2.backend.entity.Reservation;
import com.iwp2.backend.entity.ReservationSubscription;
import com.iwp2.backend.entity.User;
import com.iwp2.backend.repository.*;

import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class ProfileService {

	private final UserRepository userRepository;
	private final ReservationRepository reservationRepository;
	private final ReservationSubscriptionRepository subscriptionRepository;
	private final BuildingRepository buildingRepository;
	private final FloorRepository floorRepository;
	private final ClassroomRepository classroomRepository;

	private int getCurrentWeekNumber() {
		java.time.LocalDate date = java.time.LocalDate.now();
		return date.get(
				java.time.temporal.IsoFields.WEEK_OF_WEEK_BASED_YEAR);
	}

	public ProfileService(
			UserRepository userRepository,
			ReservationRepository reservationRepository,
			ReservationSubscriptionRepository subscriptionRepository,
			BuildingRepository buildingRepository,
			FloorRepository floorRepository,
			ClassroomRepository classroomRepository) {

		this.userRepository = userRepository;
		this.reservationRepository = reservationRepository;
		this.subscriptionRepository = subscriptionRepository;
		this.buildingRepository = buildingRepository;
		this.floorRepository = floorRepository;
		this.classroomRepository = classroomRepository;
	}

	public ProfileDashboardResponse getDashboard(String email) {

		User user = userRepository.findByEmail(email)
				.orElseThrow(() -> new RuntimeException("User not found"));

		String role = user.getRole().getName();

		List<ProfileStat> stats = new ArrayList<>();
		List<String> activity = new ArrayList<>();

		// STUDENT
		if (role.equals("STUDENT")) {

			List<ReservationSubscription> subscriptions = subscriptionRepository.findByStudentId(user.getId());
			int joinedClasses = subscriptions.size();
			int currentWeek = getCurrentWeekNumber();
			int upcomingClasses = (int) subscriptions.stream()
					.filter(sub -> sub.getReservation().getWeekNumber() >= currentWeek)
					.count();
			int totalHours = joinedClasses * 2;

			stats.add(new ProfileStat("Joined Classes", joinedClasses));
			stats.add(new ProfileStat("Upcoming Classes", upcomingClasses));
			stats.add(new ProfileStat("Total Hours", totalHours));

			subscriptions.stream()
					.limit(3)
					.forEach(sub -> {
						String classroom = sub.getReservation()
								.getClassroom()
								.getName();

						String course = sub.getReservation()
								.getCourseName();

						activity.add(
								"Joined " + course + " in " + classroom);
					});
		}

		// TEACHER
		else if (role.equals("TEACHER")) {

			List<Reservation> reservations = reservationRepository.findByTeacher_Email(email);
			int reservationCount = reservations.size();
			int totalStudents = reservations.stream()
					.mapToInt(r -> subscriptionRepository
							.countByReservationId(r.getId()))
					.sum();
			int currentWeek = getCurrentWeekNumber();
			int upcomingSessions = (int) reservations.stream()
					.filter(r -> r.getWeekNumber() >= currentWeek)
					.count();

			stats.add(new ProfileStat(
					"Reservations Created",
					reservationCount));

			stats.add(new ProfileStat(
					"Total Students",
					totalStudents));

			stats.add(new ProfileStat(
					"Upcoming Sessions",
					upcomingSessions));

			reservations.stream()
					.limit(3)
					.forEach(r -> {

						activity.add(
								"Created " +
										r.getCourseName() +
										" in " +
										r.getClassroom().getName());
					});
		}

		// ADMIN
		else if (role.equals("ADMIN")) {

			stats.add(new ProfileStat(
					"Buildings",
					(int) buildingRepository.count()));

			stats.add(new ProfileStat(
					"Floors",
					(int) floorRepository.count()));

			stats.add(new ProfileStat(
					"Classrooms",
					(int) classroomRepository.count()));

			buildingRepository.findTop3ByOrderByCreatedAtDesc()
					.forEach(building -> {

						activity.add(
								"Added building " +
										building.getName());
					});

			floorRepository.findTop3ByOrderByCreatedAtDesc()
					.forEach(floor -> {

						activity.add(
								"Added floor " +
										floor.getName() +
										" to " +
										floor.getBuilding().getName());
					});

			classroomRepository.findTop3ByOrderByCreatedAtDesc()
					.forEach(classroom -> {

						activity.add(
								"Added classroom " +
										classroom.getName() +
										" on " +
										classroom.getFloor().getName() +
										" in " +
										classroom.getFloor()
												.getBuilding()
												.getName());
					});
		}

		return new ProfileDashboardResponse(stats, activity);
	}
}