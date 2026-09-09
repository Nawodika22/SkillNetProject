package com.skillnet.user_service.repository;

import com.skillnet.user_service.entity.WorkerProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.List;

@Repository
public interface WorkerProfileRepository extends JpaRepository<WorkerProfile, Long> {
	Optional<WorkerProfile> findByUser_UserId(Long userId);
	List<WorkerProfile> findByIsAvailable(Boolean isAvailable);
	List<WorkerProfile> findByLocation(String location);
	List<WorkerProfile> findByProfession(String profession);
	
	@Query("SELECT w FROM WorkerProfile w WHERE w.location = :location AND w.isAvailable = true")
	List<WorkerProfile> findAvailableWorkersByLocation(@Param("location") String location);
	
	@Query("SELECT w FROM WorkerProfile w WHERE w.profession = :profession AND w.isAvailable = true")
	List<WorkerProfile> findAvailableWorkersByProfession(@Param("profession") String profession);
}
