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
        <p class="blog__title">{{ post.data.title }}</p>
        <p class="blog__description">{{ post.data.description }}</p>
      </div>
      <footer class="blog__footer">
        <time>{{post.date | postDate}}</time>
        <div><a href="{{post.url}}" class="blog__link">Read post</a></div>
      </footer>
    </div>
  {%- endfor %}
</div>
