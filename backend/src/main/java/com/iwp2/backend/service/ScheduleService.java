package com.iwp2.backend.service;

import com.iwp2.backend.dto.schedule.*;
import com.iwp2.backend.entity.Reservation;
import com.iwp2.backend.model.Day;
import com.iwp2.backend.repository.ReservationRepository;

import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class ScheduleService {

	private final ReservationRepository reservationRepository;

	public ScheduleService(ReservationRepository reservationRepository) {
		this.reservationRepository = reservationRepository;
	}

	public ClassroomSchedule getClassroomSchedule(Long classroomId, Integer week) {

		List<Reservation> reservations = reservationRepository.findByClassroom_IdAndWeekNumber(classroomId, week);

		Map<Day, Map<Integer, Reservation>> reservationMap = new HashMap<>();

		for (Reservation r : reservations) {

			reservationMap
					.computeIfAbsent(r.getDay(), d -> new HashMap<>())
					.put(r.getTimeSlot(), r);
		}

		List<DaySchedule> schedule = new ArrayList<>();

		for (Day day : Day.values()) {

			List<SlotSchedule> slots = new ArrayList<>();

			for (int slot = 1; slot <= 6; slot++) {

				Reservation reservation = null;

				if (reservationMap.containsKey(day)) {
					reservation = reservationMap.get(day).get(slot);
				}

				if (reservation == null) {
					slots.add(new SlotSchedule(slot, false, null, null));
				} else {
					slots.add(
							new SlotSchedule(
									slot,
									true,
									reservation.getTeacher().getEmail(),
									reservation.getId()));
				}
			}

			schedule.add(new DaySchedule(day, slots));
		}

		return new ClassroomSchedule(classroomId, week, schedule);
	}
}