---
title: Blog
order: 2
head:
  title: Blog – Kirill Ivanov
  description: My thoughts, knowledge and guides that I would like to share.
speedlify: d368102b
templateEngineOverride: njk,md
---

[Subscribe to my RSS feed](/feed.xml) if you don't want to miss new posts.

<ul class="postsList">
  {%- for post in collections.posts | reverse -%}
    <li class="postsList__post">
      <div>
        <time>{{post.date | postDate}}</time>
        <p class="postsList__title">{{ post.data.title }}</p>
        <p class="postsList__description">{{ post.data.head.description }}</p>
      </div>
      <a href="{{post.url}}" class="postsList__link">Read post</a>
    </li>
  {%- endfor %}
</ul>
