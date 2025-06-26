# oBerry

## Overview

oBerry is a lightweight and modern JQuery alternative designed to simplyfy the manipulation of HTML elements, handling user interactions and biding reactive data to HTML content.

## Features

- 🚀 Lightweight - Minimal footprint with no dependencies
- 🎯 jQuery-like API - Familiar syntax for easy migration
- ⚡ Reactive Data Binding - Built-in reactivity system
- 📦 TypeScript Support - Full type definitions included
- 🌐 Modern ES Modules - Tree-shakable imports

## installation

```sh
npm install oberry
```

## Quick start

```js
import { $, $ref, $watch } from 'oberry';

// Select and manipulate elements
$('.my-button')
  .addClass('active')
  .onClick(() => console.log('Clicked!'));

// Reactive data binding
const message = $ref('Hello World');
$('#output').bind(message);

// Watch for changes
$watch(message, (newValue, oldValue) => {
  console.log(`Changed from ${oldValue} to ${newValue}`);
});

// Update reactive value
message.value = 'Hello OBerry!';
```

## API Reference

### Element selection

```js
// CSS selector
$('.class-name');
$('#element-id');
$('div');

// HTML Element
$(document.getElementById('myElement'));

// NodeList or Array of elements
$(document.querySelectorAll('.items'));
```

### DOM Manipulation

```js
$('.element')
  .addClass('new-class')
  .removeClass('old-class')
  .toggleClass('toggle-class')
  .css({ color: 'red', fontSize: '16px' })
  .setHTML('<p>New content</p>')
  .setText('Plain text content')
  .append('<span>Appended</span>')
  .prepend('<span>Prepended</span>');
```

### Event Handling

```js
$('.button')
  .onClick(event => console.log('Clicked'))
  .onMouseOver(event => console.log('Mouse over'))
  .onChange(event => console.log('Changed'))
  .onInput(event => console.log('Input changed'));
```

### Reactive Data

```js
// Simple reactive reference
const count = $ref(0);
$('#counter').bind(count);

// Deep reactive object
const user = $deepRef({ name: 'John', age: 30 });
$('#user-name').bind($ref(() => user.value.name));

// Watch for changes
$watch(count, newValue => {
  console.log('Count changed:', newValue);
});
```
