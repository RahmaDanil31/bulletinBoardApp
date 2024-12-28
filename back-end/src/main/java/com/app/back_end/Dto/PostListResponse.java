package com.app.back_end.Dto;

import java.time.LocalDateTime;

public interface PostListResponse {

    Integer getId();

    String getTitle();

    String getAuthorName();

    Integer getViewers();

    LocalDateTime getCreatedDate();
}