---
title: Developer environment setup
date: 2023-02-19
head:
  title: Developer environment setup
  description: Automated MacOS setup for development.
---

Preparing new computer for work can be a real headache. You need to remember all of the applications and packages that you use day to day to reinstall them on a new machine. It is an important problem, because until then, you can’t actually get to work without being constantly distracted by installing required applications. Of course you can use some migration tools to recover your previous system from backup on a new device. But this is not the case if you use an employer-issued laptop as you probably should do a clean install.

## Solution

My original idea was to make a single bash script that would automate the process to a simple double-click: just execute the script file and you are ready to go. But soon I realised, that this script would be hard to maintain. If something goes wrong during the script execution due to some specific system presets, it should definitely take this problem into account and not to let the whole script fail. For instance, some commands may depend on broken commands, so the further process would also fail. It looks really complicated to handle. So I came up with a straightforward solution: make a some kind of a simple todo list with actions to be performed manually. Yes, the whole setup would take more time than running a single bash script, but not by much.

As a result, I have prepared a text file with instructions and terminal commands to set up a new system for work from scratch in a separate [repo](https://github.com/kirillunlimited/dev-env){target="\_blank" rel="noopener noreferrer"}.

Note, that this guide is specifically for MacOS.

## Setup

The very first step is to install [Oh My Zsh](https://ohmyz.sh/){target="\_blank" rel="noopener noreferrer"}. Oh My Zsh is a framework that expands functionality of the Z shell terminal. This step is not mandatory, but recommended for better terminal experience:

```bash
# Install oh-my-zsh
sh -c "$(curl -fsSL https://raw.githubusercontent.com/robbyrussell/oh-my-zsh/master/tools/install.sh)"

# Install "powerlevel10k" theme
git clone https://github.com/romkatv/powerlevel10k.git $ZSH_CUSTOM/themes/powerlevel10k

# Setup oh-my-zsh
cp .zshrc ~/
cp .p10k.zsh ~/
source ~/.zshrc
```

Copy configuration files for tools like Git and [Karabiner](https://karabiner-elements.pqrs.org/){target="\_blank" rel="noopener noreferrer"} (I wrote about Karabiner in my previous article, [check it out](/blog/enhanced-keyboard-navigation/)):

```bash
cp .gitconfig ~/
mkdir -p ~/.config/karabiner && cp karabiner.json $_
mkdir ~/.nvm
```

The key part of this setup is installing packages from the [Brewfile](https://github.com/kirillunlimited/dev-env/blob/master/Brewfile){target="\_blank" rel="noopener noreferrer"} via [Homebrew](https://brew.sh/){target="\_blank" rel="noopener noreferrer"}. Homebrew is the most popular package manager for MacOS. And the Brewfile is a file with the list of packages to be installed. You can think of Brewfile as a `package.json` but for your system. Create your own Brewfile, list in it all dependencies you need and you are good to go:

```bash
# Install Homebrew
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install.sh)"

# Install packages
brew bundle
```

Finally, put the finishing touches: set up the keyboard, mouse, IDE and install the rest of the applications from the AppStore. This step is not automated via terminal commands, so it should be done individually.

If you are interested in this kind of automation of your developer environment on new machines, then you can take my [original repo](https://github.com/kirillunlimited/dev-env){target="\_blank" rel="noopener noreferrer"} as a sample and come up with your own automated setup process. You will be surprised how much time it will save you.
