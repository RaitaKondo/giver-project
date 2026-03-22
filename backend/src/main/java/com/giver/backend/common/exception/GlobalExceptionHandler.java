package com.giver.backend.common.exception;

import com.fasterxml.jackson.core.JsonProcessingException;
import jakarta.validation.ConstraintViolationException;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.NoSuchElementException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

  @ExceptionHandler(MethodArgumentNotValidException.class)
  public ResponseEntity<ErrorResponse> handleMethodArgumentNotValid(MethodArgumentNotValidException ex) {
    final List<String> details = ex.getBindingResult().getFieldErrors().stream()
        .map(this::formatFieldError)
        .toList();
    return badRequest("Validation failed.", details);
  }

  @ExceptionHandler(ConstraintViolationException.class)
  public ResponseEntity<ErrorResponse> handleConstraintViolation(ConstraintViolationException ex) {
    final List<String> details = ex.getConstraintViolations().stream()
        .map(violation -> violation.getPropertyPath() + ": " + violation.getMessage())
        .toList();
    return badRequest("Validation failed.", details);
  }

  @ExceptionHandler(IllegalArgumentException.class)
  public ResponseEntity<ErrorResponse> handleIllegalArgument(IllegalArgumentException ex) {
    // 例外処理の意図:
    // - 業務バリデーションエラーは 400 としてクライアントに伝える。
    return badRequest(ex.getMessage(), List.of());
  }

  @ExceptionHandler(HttpMessageNotReadableException.class)
  public ResponseEntity<ErrorResponse> handleHttpMessageNotReadable(HttpMessageNotReadableException ex) {
    return badRequest("Malformed request body.", List.of());
  }

  @ExceptionHandler(JsonProcessingException.class)
  public ResponseEntity<ErrorResponse> handleJsonProcessing(JsonProcessingException ex) {
    return badRequest("Malformed JSON in 'request' part.", List.of());
  }

  @ExceptionHandler(NoSuchElementException.class)
  public ResponseEntity<ErrorResponse> handleNotFound(NoSuchElementException ex) {
    // 例外処理の意図:
    // - 明確な not found は 404 として返し、クライアントが再試行不要と判断できるようにする。
    final ErrorResponse body = new ErrorResponse(ex.getMessage(), List.of(), OffsetDateTime.now());
    return ResponseEntity.status(HttpStatus.NOT_FOUND).body(body);
  }

  @ExceptionHandler(Exception.class)
  public ResponseEntity<ErrorResponse> handleException(Exception ex) {
    // 例外処理の意図:
    // - 予期しない障害は詳細を出し過ぎず 500 で返す。
    final ErrorResponse body = new ErrorResponse(
        // "Internal server error.",
        ex.getMessage(), // --- 例外のメッセージをそのまま返す。開発初期はこれで十分。将来必要に応じてカスタマイズする。
        List.of(),
        OffsetDateTime.now()
    );
    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(body);
  }

  private ResponseEntity<ErrorResponse> badRequest(String message, List<String> details) {
    final ErrorResponse body = new ErrorResponse(message, details, OffsetDateTime.now());
    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(body);
  }

  private String formatFieldError(FieldError fieldError) {
    return fieldError.getField() + ": " + fieldError.getDefaultMessage();
  }

  public record ErrorResponse(
      String message,
      List<String> details,
      OffsetDateTime timestamp
  ) {
  }
}
