---
title: Blog
order: 2
head:
  title: Blog – Kirill Ivanov
  description: The place where I share my thoughts and knowledge.
---

<ul class="postsList">
  {%- for element in collections.posts -%}
    <li class="postsList__element">
      <time class="postsList__date">{{ element.date | postDate}}</time>
      <a href="{{element.url}}">
        {{ element.data.title }}
      </a>
    </li>
  {%- endfor -%}
</ul>
