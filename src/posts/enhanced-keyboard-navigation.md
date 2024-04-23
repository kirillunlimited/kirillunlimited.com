---
title: Enhanced Keyboard Navigation
description: A guide on how to improve keyboard navigation on MacOS.
picture: enhanced-keyboard-navigation.jpeg
toc:
  - Keyboard navigation problem
  - Karabiner-Elements
---

## Keyboard navigation problem

If you have ever used VIM text editor for at least a short amount of time, you should know about its unusual navigation layout. If you unfamiliar with VIM, in short, you use HJKL keys instead of arrows:

- **H** – ⬅️
- **J** – ⬇️
- **K** – ⬆️
- **L** – ➡️

At first glance it may seem strange and uncomfortable. But after you get used to it, you would probably start to benefit from this approach as it boosts your typing performance pretty much.

I've always thought about how nice it would be to have this kind of layout in the whole system, not just in VIM (I don't use VIM, by the way). Just think about how much time you spend on moving your right hand from the centre of your keyboard to the cursor keys and back. Also, the cursor keys on the MacBook are really terrible, so it's almost impossible to find them when typing blindly. The last point for me was that lately my hand has started to hurt from this unnatural hand movement to allow my fingers to reach the arrow keys in the lower right area of the keyboard, which feels like the beginning of tunnel syndrome.

Fortunately, I found a solution that I would like to share.

## Karabiner-Elements

[Karabiner-Elements](https://karabiner-elements.pqrs.org/){target="\_blank" rel="noopener noreferrer"} – is a powerful MacOS application that allows you to script key bindings on a system level. You can setup any key combination you want. In the **Complex Modifications** section you can add custom rules. If you try to add a new rule, it will offer you some examples. One of the examples enables cursor navigation behaviour for HJKL keys while holding right command modifier key – that's what we were looking for.

If you want to add more hotkeys then you can edit configuration file by yourself. It is a `.json` file where everything is pretty simple. Just experiment and come up with key bindings that suits you best. As for me, I use Caps Lock as a modifier because I really don’t use Caps Lock for uppercase that often. I also added some hotkeys for language switch, undo/redo, quick launch of some applications etc. You can find my configuration file [here](https://raw.githubusercontent.com/kirillunlimited/dev-env/master/karabiner.json){target="\_blank" rel="noopener noreferrer"} which you can use as a boilerplate for your setup. Also there is a nice [collection of presets](https://ke-complex-modifications.pqrs.org/){target="\_blank" rel="noopener noreferrer"} for any taste.

The downside of this approach is that once you get used to it, you will not be able to use default layout with arrow keys anymore. You will be doomed to setup your key bindings every time you switch your working machine. This is the price of convenience.
