package com.giver.backend.context.controller;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.giver.backend.context.dto.ContextMasterResponse;
import com.giver.backend.context.service.ContextMasterService;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(ContextMasterController.class)
class ContextMasterControllerTest {

  @Autowired
  private MockMvc mockMvc;

  @MockitoBean
  private ContextMasterService contextMasterService;

  @Test
  void findActive_returnsOnlyActiveContexts() throws Exception {
    when(contextMasterService.findActive()).thenReturn(List.of(
        new ContextMasterResponse(1L, "workplace", "職場", "PLACE", 10),
        new ContextMasterResponse(2L, "family", "家族", "RELATIONSHIP", 20)
    ));

    mockMvc.perform(get("/api/context-masters"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.length()").value(2))
        .andExpect(jsonPath("$[0].code").value("workplace"))
        .andExpect(jsonPath("$[1].code").value("family"));
  }
}
