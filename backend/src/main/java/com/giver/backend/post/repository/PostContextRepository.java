package com.giver.backend.post.repository;

import com.giver.backend.post.entity.PostContext;
import com.giver.backend.post.entity.PostContextId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PostContextRepository extends JpaRepository<PostContext, PostContextId> {
}
