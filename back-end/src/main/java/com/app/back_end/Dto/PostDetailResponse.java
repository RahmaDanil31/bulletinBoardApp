package com.app.back_end.Dto;

import java.time.LocalDateTime;

public interface PostDetailResponse {
    Integer getId();

    String getTitle();

    String getContent();

    String getAuthorName();

    Integer getViewers();

    LocalDateTime getCreatedDate();

    LocalDateTime getUpdatedDate();
}
