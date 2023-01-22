---
title: Hello, world!
head:
  title: Hello, world!
  description: 'Since the day I became a web developer I always wanted to build my personal website. I tried to make it several times but I always failed in the very beginning: I had no idea what it should look like and what it would exactly be about. But my desire was too strong.'
---

{% picture "src/assets/img/posts/hello-world/1.jpg", "Hello, world" %}

Since the day I became a web developer I always wanted to build my personal website. I tried to make it several times but I always failed in the very beginning: I had no idea what it should look like and what it would exactly be about. But my desire was too strong.

A few years ago I finally I came up with the first version of my site. It was just a single page that contained only some basic info about me. It was a really small website but it was enough to fulfil my obsession for some time.

Recently, I found some free time to rethink and redo my homepage. Firstly, I divided information about myself and contact information into separate pages to make my website to not look like an ugly landing page.

The main update is a blog section. So, this is my first post in the blog. I hope this section will not be abandoned soon and I will have some interesting ideas that I will share from time to time.

Additionally, I decided to get rid of Russian version of the site. I don’t want to support 2 versions of the same site and write each post in two different languages. I’m sure that English version is more than enough for the majority of potential visitors. Besides, blogging in English is a good playground to improve language skills. I apologize in advance for my embarrassing command of the English language and grammar.

On the technical side, this project is built on top of 11ty. If you have ever heard about Jamstack, you would probably heard about 11ty. It is a powerful, flexible and beginner-friendly static site generator that is quite popular among developers for building blog sites. The content is kept inside markdown files right in your code base what is extremely convenient. It means that you don’t need to handle some separate CMS what is a true nightmare for any web developer. After each content update you should rebuild your project to convert content into a pack of ready to deploy static html files. 11ty doesn’t use any JavaScript framework under the hood like Gatsby or Gridsome, so it is quite simple and blazingly fast by its design. All in all, 11ty is not suitable for large complex web applications with a lot of interactivity, but it is a perfect solution for simple web sites and blogs with a lot of static content.

If you work with 11ty you should probably care about bundling process. You can use any bundler you like but I prefer Webpack as a de facto modern standard in frontend development. If you are interested in building your own project using 11ty, check out the source code of this website for a better understanding.

Finally, I have my own cool looking website I’m happy with.

Stay tuned!
