package com.app.back_end.Repository;

import com.app.back_end.Dto.PostDetailResponse;
import com.app.back_end.Dto.PostListResponse;
import com.app.back_end.Model.Post;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PostRepository extends JpaRepository<Post,Integer> {
    @Query(value = "SELECT " +
            "p.id AS id," +
            "p.title AS title," +
            "p.author_name AS authorName," +
            "p.viewers AS viewers," +
            "p.created_date AS createdDate " +
            "FROM post p " +
            "where p.deleted = false " +
            "order by p.id asc", nativeQuery = true)
    List<PostListResponse> findAllPosts();

    @Query(value = "SELECT " +
            "p.id AS id, " +
            "p.title AS title, " +
            "p.content AS content, " +
            "p.author_name AS authorName, " +
            "p.viewers AS viewers, " +
            "p.created_date AS createdDate, " +
            "p.updated_date AS updatedDate " +
            "FROM post p " +
            "WHERE p.id = :id", nativeQuery = true)
    Optional<PostDetailResponse> findPostById(@Param("id") Integer id);

    @Modifying
    @Transactional
    @Query("UPDATE Post p SET p.viewers = :viewers WHERE p.id = :id")
    int updatePostById(@Param("id") Integer id, @Param("viewers") Integer viewers);

}
