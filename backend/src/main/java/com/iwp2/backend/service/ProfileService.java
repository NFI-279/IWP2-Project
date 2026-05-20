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
			int upcomingClasses = subscriptions.size();
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

			int upcomingSessions = reservationCount;

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

			activity.add("Managing campus infrastructure");
			activity.add("Monitoring classroom system");
			activity.add("Managing platform resources");
		}

		return new ProfileDashboardResponse(stats, activity);
	}
}