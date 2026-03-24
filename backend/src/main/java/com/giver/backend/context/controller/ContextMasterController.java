package com.giver.backend.context.controller;

import com.giver.backend.context.dto.ContextMasterResponse;
import com.giver.backend.context.service.ContextMasterService;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/context-masters")
public class ContextMasterController {

  private final ContextMasterService contextMasterService;

  public ContextMasterController(ContextMasterService contextMasterService) {
    this.contextMasterService = contextMasterService;
  }

  @GetMapping
  public ResponseEntity<List<ContextMasterResponse>> findActive() {
    return ResponseEntity.ok(contextMasterService.findActive());
  }
}
