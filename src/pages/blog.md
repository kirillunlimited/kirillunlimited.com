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

{%- for year, yearPosts in collections.postsByYear %}

  <h2>{{ year }}</h2>
  <ul class="postsList">
    {%- for post in yearPosts %}
      <li>
        <div>
          <a href="{{post.url}}">
          {{ post.data.title }}
          </a>
          <div class="postsList__description">{{ post.data.head.description }}</div>
        </div>
      </li>
    {%- endfor %}
  </ul>
{%- endfor %}
