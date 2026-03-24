package com.giver.backend.post.repository;

import com.giver.backend.post.entity.PostImage;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PostImageRepository extends JpaRepository<PostImage, UUID> {
}
