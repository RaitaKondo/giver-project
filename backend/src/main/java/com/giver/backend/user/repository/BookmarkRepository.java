package com.giver.backend.user.repository;

import com.giver.backend.user.entity.Bookmark;
import com.giver.backend.user.entity.BookmarkId;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BookmarkRepository extends JpaRepository<Bookmark, BookmarkId> {

  boolean existsByIdUserIdAndIdPostId(UUID userId, UUID postId);
}
