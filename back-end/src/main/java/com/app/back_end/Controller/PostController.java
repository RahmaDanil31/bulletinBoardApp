package com.app.back_end.Controller;

import com.app.back_end.Dto.PostCreateRequest;
import com.app.back_end.Dto.PostDetailResponse;
import com.app.back_end.Service.PostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping(value = "/post")
public class PostController {

    @Autowired
    PostService service;

    @GetMapping()
    public ResponseEntity<?> view(){
        try {
            return ResponseEntity.ok().body(service.get());
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping()
    public ResponseEntity<?> createPost(@RequestBody PostCreateRequest postCreateRequest) {
        service.save(postCreateRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(postCreateRequest);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getPostById(@PathVariable Integer id, Boolean isUpdated) {
        try {
            Optional<PostDetailResponse> post = service.getPostById(id,isUpdated);

            if(post.isPresent())
                return ResponseEntity.ok(post);

            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/{id}/validate-password")
    public ResponseEntity<Map<String, Object>> validatePassword(
            @PathVariable Integer id,
            @RequestBody Map<String, String> body) {

        String password = body.get("password");
        boolean isValid = service.validatePassword(id,password);
        Map<String, Object> response = new HashMap<>();
        response.put("valid", isValid);

        if (isValid) {
            response.put("message", "Password is valid.");
            return ResponseEntity.ok(response);
        } else {
            response.put("message", "Password is invalid.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updatedPost(@PathVariable Integer id,@RequestBody PostCreateRequest postCreateRequest) {
        service.update(id,postCreateRequest);
        return ResponseEntity.status(HttpStatus.OK).body(postCreateRequest);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Integer id, String password) {
        service.delete(id,password);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }
}
