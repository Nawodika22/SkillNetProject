package com.skillnet.user_service.repository;

import com.skillnet.user_service.entity.Worker;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WorkerRepository extends JpaRepository<Worker, Long> {

    Optional<Worker> findByEmail(String email);

    boolean existsByEmail(String email);

    @Query("SELECT w FROM Worker w WHERE " +
           "(:profession IS NULL OR :profession = '' OR LOWER(w.profession) LIKE LOWER(CONCAT('%', :profession, '%'))) AND " +
           "(:location IS NULL OR :location = '' OR LOWER(w.location) LIKE LOWER(CONCAT('%', :location, '%'))) AND " +
           "(:availableOnly = false OR w.isAvailable = true)")
    List<Worker> searchWorkers(@Param("profession") String profession,
                               @Param("location") String location,
                               @Param("availableOnly") boolean availableOnly);
}
