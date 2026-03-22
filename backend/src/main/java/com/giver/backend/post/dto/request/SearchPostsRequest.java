package com.giver.backend.post.dto.request;

public record SearchPostsRequest(
    String visibility,
    Integer page,
    Integer size
) {

  private static final int DEFAULT_PAGE = 0;
  private static final int DEFAULT_SIZE = 20;
  private static final int MAX_SIZE = 100;

  public int normalizedPage() {
    if (page == null || page < 0) {
      return DEFAULT_PAGE;
    }
    return page;
  }

  public int normalizedSize() {
    if (size == null || size <= 0) {
      return DEFAULT_SIZE;
    }
    return Math.min(size, MAX_SIZE);
  }
}
