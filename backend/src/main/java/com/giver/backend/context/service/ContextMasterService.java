package com.giver.backend.context.service;

import com.giver.backend.context.dto.ContextMasterResponse;
import com.giver.backend.context.entity.ContextMaster;
import com.giver.backend.context.repository.ContextMasterRepository;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class ContextMasterService {

  private final ContextMasterRepository contextMasterRepository;

  public ContextMasterService(ContextMasterRepository contextMasterRepository) {
    this.contextMasterRepository = contextMasterRepository;
  }

  public List<ContextMasterResponse> findActive() {
    return contextMasterRepository.findByIsActiveTrueOrderBySortOrderAscIdAsc().stream()
        .map(this::toResponse)
        .toList();
  }

  private ContextMasterResponse toResponse(ContextMaster contextMaster) {
    return new ContextMasterResponse(
        contextMaster.getId(),
        contextMaster.getCode(),
        contextMaster.getName(),
        contextMaster.getCategory(),
        contextMaster.getSortOrder()
    );
  }
}
