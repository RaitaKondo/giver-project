package com.giver.backend.context.repository;

import com.giver.backend.context.entity.ContextMaster;
import java.util.Collection;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ContextMasterRepository extends JpaRepository<ContextMaster, Long> {

  List<ContextMaster> findByIsActiveTrueOrderBySortOrderAscIdAsc();

  List<ContextMaster> findByIdInAndIsActiveTrue(Collection<Long> ids);
}
