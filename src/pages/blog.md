---
title: Blog
description: My thoughts, knowledge and guides that I would like to share.
order: 1
speedlify: d368102b
templateEngineOverride: njk,md
---

[Subscribe to my RSS feed](/feed.xml) if you don't want to miss new posts.

<div class="blog">
  {%- for post in collections.posts | reverse -%}
    <div class="blog__post">
      <div>
        {% if post.data.picture -%}
          <a href="{{post.url}}">{% postPreviewPicture post.data.picture | pagePicturePath, post.data.title, loop.index0 > 1 %}</a>
        {% endif -%}
        <p class="blog__title blog__text" >
          <a href="{{post.url}}">{{ post.data.title }}</a>
        </p>
        <p class="blog__description blog__text">{{ post.data.description }}</p>
      </div>
      <footer class="blog__footer blog__text">
        <time>{{post.date | postDate}}</time>
      </footer>
    </div>
  {%- endfor %}
</div>
