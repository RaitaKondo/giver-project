package com.giver.backend.user.service;

import com.giver.backend.post.repository.PostRepository;
import com.giver.backend.user.entity.Bookmark;
import com.giver.backend.user.entity.BookmarkId;
import com.giver.backend.user.repository.BookmarkRepository;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class BookmarkService {

  private final BookmarkRepository bookmarkRepository;
  private final PostRepository postRepository;

  public BookmarkService(
      BookmarkRepository bookmarkRepository,
      PostRepository postRepository
  ) {
    this.bookmarkRepository = bookmarkRepository;
    this.postRepository = postRepository;
  }

  @Transactional
  public void bookmark(UUID userId, UUID postId) {
    postRepository.findById(postId)
        .orElseThrow(() -> new IllegalArgumentException("Post does not exist."));
    if (!bookmarkRepository.existsByIdUserIdAndIdPostId(userId, postId)) {
      bookmarkRepository.save(new Bookmark(userId, postId));
    }
  }

  @Transactional
  public void removeBookmark(UUID userId, UUID postId) {
    bookmarkRepository.deleteById(new BookmarkId(userId, postId));
  }
}
