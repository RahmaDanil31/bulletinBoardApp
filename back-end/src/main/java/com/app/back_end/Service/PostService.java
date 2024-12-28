package com.app.back_end.Service;

import com.app.back_end.Dto.PostCreateRequest;
import com.app.back_end.Dto.PostDetailResponse;
import com.app.back_end.Model.Post;
import com.app.back_end.Repository.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class PostService{

    @Autowired
    PostRepository postRepository;

    public Object get() {
        return postRepository.findAllPosts();
    }

    public void save(PostCreateRequest postCreateRequest) {
        Post post = new Post();
        post.setAuthorName(postCreateRequest.getAuthorName());
        post.setTitle(postCreateRequest.getTitle());
        post.setContent(postCreateRequest.getContent());
        post.setPassword(postCreateRequest.getPassword());

        postRepository.save(post);

    }

    public Optional<PostDetailResponse> getPostById(Integer id,Boolean isUpdated) {
        Optional<PostDetailResponse> post = postRepository.findPostById(id);

        if(!isUpdated.equals(Boolean.TRUE)){
            post.ifPresent(view -> {
                int updatedViewers = view.getViewers() + 1;
                postRepository.updatePostById(id, updatedViewers);
            });
        }
        return post;
    }

    public boolean validatePassword(Integer id, String password) {
        Optional<Post> post = postRepository.findById(id);
        return post.isPresent() &&post.get().getPassword().trim().equals(password.trim());
    }

    public void update(Integer id, PostCreateRequest postCreateRequest) {
        Optional<Post> post = postRepository.findById(id);

        post.ifPresent(post1 -> {
            post1.setAuthorName(postCreateRequest.getAuthorName());
            post1.setTitle(postCreateRequest.getTitle());
            post1.setContent(postCreateRequest.getContent());

            if(post1.getPassword().equals(postCreateRequest.getPassword())) {
                postRepository.save(post1);
            }
        });
    }

    public void delete(Integer id, String password) {
        Optional<Post> post = postRepository.findById(id);

        post.ifPresent(post1 -> {
            if(post1.getPassword().equals(password)){
                post1.setDeleted(true);
                postRepository.save(post1);
            }
        });
    }
}
