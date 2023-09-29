---
title: Stumbling Blocks of Backend-Driven UI on the Web
head:
  description: Unobvious issues to be aware of before implementing backend-driven UI architecture in a web application.
---

Backend-driven UI (BDUI, also known as server-driver UI) is a powerful concept for building modern applications instead of the classical client-server architecture. It implies that the backend dictates not only **what** to render, but also **how** it should look like. In other words, BDUI is a quintessence of a “thin client” architecture. Technically, the server response contains not just raw data, but also detailed information about each UI element on the page, its position in the layout, description of its behaviour and reactions to user actions.

This approach has a lot of advantages such as less code on the client, a single source of truth for different platforms and simplified AB-testing. But I believe that the main feature of BDUI is its blazingly fast time to market. This advantage is due to the fact that ideally all new functionality should be delivered as a new response from the backend. Thus, client applications don’t need to make any updates if they already know how to process response with such structure. This solution is very suitable for mobile platforms: it allows to drastically improve feature delivery speed, because mobile developers avoid the need to publish their application in the marketplace and wait for users to install the update.

It may seem like a good idea to develop a single BDUI platform for both mobile and web applications. Obviously, business customers would be happy to be able to manage the view of each client from the single CMS provided by the backend. Of course, this whole concept has some common disadvantages, such as strict design limitations, worse responsiveness and increased complexity of testing and versioning. But there are some important stumbling blocks that are exclusive to the web platform. They can negate the benefits of cross-platform architecture in the long run. I have a small experience of implementing BDUI methodology in a large e-commerce project. In this article I would like to share the main drawbacks that I wish I had known about before starting building a BDUI web application.

## Cross-Platform Layout

Basically, mobile layout implies the arrangement of widgets along one axis – the vertical axis. If product managers and designers don’t have special wishes for unique arrangement of elements for different mobile operating systems, this one-dimensional layout can be common to all mobile platforms. It is really convenient, as you only need to care about this source of truth for the interface, which greatly simplifies the work of both designers and developers. But if the desktop web appears among the platforms, its two-dimensional layout must now be taken into account. API can no longer be generic, which leads to certain complex and unobvious decisions that complicate back-end support. As a result, one of the key advantages of the backend-centric approach – its platform agnosticism – is lost.

## Tree-Shaking

If you really care about the performance of your web application, you may encounter some optimization challenges related to proper code splitting. There is no such problem in mobile apps, as user needs to download the whole application before using it. In the case of the web, things work differently: ideally, front-end application should be splitted into a small chunks that would be downloaded by the client on demand. It leads to a certain constraints that, again, force the backend to care about the content for each particular platform.

If you work with BDUI, sooner or later you will face the necessity to render widgets of the same type, but differing in some features. It can be literally any types of elements: from simple static blocks to complex fields and forms. The easiest way to solve this issue is to implement some kind of widget factory. The basic idea is to have a method that renders some similar widgets according to a set of different configuration values that are dictated by the backend. This technique can be easily implemented within the modern component-based approach using high-order components (HOCs). As a result, you don’t need to create a bunch of identical components. Instead, you have one big component, that generates more specific and customisable components.

For simplicity, let's consider an example of icons. The backend sends a certain icon alias to the client. The client probably should have some simple key-value data structure that allows the icon component to be identified by the received alias:

```jsx
import SuccessIcon from './success';
import WarningIcon from './warning';
import FailIcon from './fail';

export const IconComponents = {
	success: SuccessIcon,
	warning: WarningIcon,
	fail: FailIcon
}
```

Maintaining this list is not a big problem, since it can be generated automatically by the design library tools. But the real problem is that generic icon component cannot predict which exact icon component will be needed at actual runtime, so every single icon will be included into a bundle. In React we will have a high-order component that will render an icon based on the alias value passed in. It will look something like this:

```jsx
import React from "react";
import IconComponents from './icons';

export default function Icon({iconName}) {
  return React.createElement(IconComponents[iconName]);
}
```

The tree-shaking won’t work: the user will download every icon component even though only one of them will be rendered. Imagine if your design kit contains more than a hundred icons. It would certainly affect the overall performance.

In this particular case, there is a simple solution – do not use components for icons, and just use urls to these images, which will be stored somewhere on CDN. Admittedly, this comes with some other limitations, such as the difficulty of changing the color of the icon, although there are more reasonable solutions to this problem as well. Either way, it puts a spoke in the wheel of developer experience as there are a plenty of other elements, not only icons.

## Page Load Time

Another big issue is the optimization of initial page load time. The initial page load for a BDUI application can be much slower, because the backend should generate the entire layout dynamically in a single response. This can negatively impact user engagement and SEO rankings which is crucial for any web application. Solving this problem can be a real headache. You may think of a tricky data subloading in separate requests as a simple solution, but then there may be a problem of inconsistency of widgets on the page. And now imagine you have to explain this issue to your back-end developers who have to deal with it: they won't like it at all.

## Scalability and Maintainability

It is likely that implementing this concept on the web could lead to over-engineering. Instead of creating new awesome front-end features, developers will have to maintain complicated data structures from the server. Obviously, this will become a routine for any front-end developer, as supporting a “dumb” ui-system is not fun at all. It might seem exciting at first, but you are bound to realize soon enough that the development process is going to be a torture. Even though business customers gain profit, developers will either endure and suffer or simply quit the project in search of better opportunities. Eventually, it will be hard to find an experienced and ambitions developer who would agree to maintain and support this kind of project.

Unfortunately, I can't give any advice to avoid such issues. Exciting challenges will be encountered only at the very beginning, mostly related to the design and building this system while solving a lot of low-level engineering problems. But further maintenance and support will be demotivating with its monotony, offering no benefits for the developer's experience and leading to work fatigue and burnout. Be sure to read [one of my previous articles](/blog/stay-hungry/) to avoid these kinds of problems.

## Conclusion

In this article I highlighted the biggest problems of BDUI from the web perspective. The issue of the long release cycle of mobile apps can certainly be solved with this concept, but this is not the case for the web – we just don't have that kind of problem. As a result, the BDUI concept along with the cross-platform approach introduces artificial obstacles that front-end developers have to overcome without gaining any valuable advantages. It means one step forward for mobile and one step back for web. You should think carefully before agreeing to implement BDUI in your web project and see if the benefits really outweigh all of the difficulties. Probably, it is a good idea to come up with a hybrid back-end service capable of producing different data sets: one for BDUI-based mobile platforms, and the other for the web, adhering to the classical "client-server" approach.