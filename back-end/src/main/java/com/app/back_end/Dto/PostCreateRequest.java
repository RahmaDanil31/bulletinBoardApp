package com.app.back_end.Dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;

public class PostCreateRequest {

    @NotEmpty(message = "Title is required")
    private String title;

    @NotEmpty(message = "Author name is required")
    @Size(min = 3, max = 10, message = "Author name must be between 3 and 10 characters")
    private String authorName;

    @NotEmpty(message = "Content is required")
    private String content;

    @NotEmpty(message = "Password is required")
    private String password;

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getAuthorName() {
        return authorName;
    }

    public void setAuthorName(String authorName) {
        this.authorName = authorName;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
