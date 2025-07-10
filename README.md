# oBerry

## Overview

oBerry is a lightweight and modern JQuery alternative designed to simplyfy the manipulation of HTML elements, handling user interactions and biding reactive data to HTML content.

## Features

- 🚀 Lightweight - Minimal footprint with no dependencies
- 🎯 jQuery-like API - Familiar syntax for easy migration
- ⚡ Reactive Data Binding - Built-in reactivity system
- 📦 TypeScript Support - Full type definitions included
- 🎨 Comprehensive DOM Manipulation - Full suite of element manipulation methods
- 🖱️ Rich Event Handling - Support for all common DOM events
- 🔄 Flexible Content Insertion - Multiple ways to add content to elements

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

#### Class Management

```js
$('.element')
  .addClass('new-class')
  .removeClass('old-class')
  .toggleClass('toggle-class');
```

#### Styling

```js
$('.element').css({
  color: 'red',
  fontSize: '16px',
  backgroundColor: '#f0f0f0',
});
```

#### Content Manipulation

```js
$('.element')
  .setHTML('<p>New HTML content</p>')
  .setText('Plain text content')
  .getHTML() // Returns HTML of first element
  .getText(); // Returns text of first element
```

#### Content insertion

```js
// Append content to elements
$('.element').append('<p>Appended content</p>');
$('.element').append(document.createElement('div'));
$('.element').append($('.other-element'));

// Prepend content to elements
$('.element').prepend('<p>Prepended content</p>');
$('.element').prepend(document.createElement('div'));
$('.element').prepend($('.other-element'));

// Insert content after elements
$('.element').after('<p>Content after</p>');
$('.element').after(document.createElement('div'));
$('.element').after($('.other-element'));

// Insert content before elements
$('.element').before('<p>Content before</p>');
$('.element').before(document.createElement('div'));
$('.element').before($('.other-element'));
```

#### Form Values

```js
// Get/set values for input, textarea, select elements
$('#input-field').setValue('New value').getValue(); // Returns current value
```

#### Element Navigation

```js
// Get parent element (wrapped)
$('.child').parent();

// Get children of first element (wrapped)
$('.parent').children();

// Get children of all elements (wrapped)
$('.parents').allChildren();

// Get array of wrapped elements
$('.elements').getArray();
```

#### Element Filtering and Selection

```js
// Get specific element by index
$('.elements').eq(2); // Get the 3rd element (zero-indexed)

// Get first element
$('.elements').first();

// Get last element
$('.elements').last();

// Get even-indexed elements (2nd, 4th, 6th, etc.)
$('.elements').even();

// Get odd-indexed elements (1st, 3rd, 5th, etc.)
$('.elements').odd();
```

#### Visibility Control

```js
// Hide elements (preserves original display value)
$('.element').hide();

// Show elements (restores original display value)
$('.element').show();

// Toggle visibility
$('.element').toggle();
```

### Event Handling

```js
$('.element')
  // Mouse events
  .onClick(event => console.log('Clicked'))
  .onDblClick(event => console.log('Double clicked'))
  .onMouseOver(event => console.log('Mouse over'))
  .onMouseOut(event => console.log('Mouse out'))
  .onContextMenu(event => console.log('Right clicked'))

  // Form events
  .onChange(event => console.log('Changed'))
  .onInput(event => console.log('Input changed'))
  .onSubmit(event => console.log('Form submitted'))
  .onFocus(event => console.log('Focused'))
  .onBlur(event => console.log('Blurred'))

  // Keyboard events
  .onKeyDown(event => console.log('Key down'))
  .onKeyUp(event => console.log('Key up'))
  .onKeyPress(event => console.log('Key pressed'))

  // Other events
  .onScroll(event => console.log('Scrolled'))
  .onResize(event => console.log('Resized'))
  .onLoad(event => console.log('Loaded'))
  .onDrag(event => console.log('Dragged'))
  .onDrop(event => console.log('Dropped'));
```

### Reactive Data

#### Simple reactive references

```js
// Create reactive reference
const count = $ref(0);
const message = $ref('Hello');

// Bind to DOM elements
$('#counter').bind(count); // Binds as text content
$('#message').bindHTML(message); // Binds as HTML content

// Update values
count.value = 42;
message.value = '<strong>Bold Hello</strong>';
```

#### Deep Reactive Objects

```js
// Create deep reactive object
const user = $deepRef({
  name: 'John',
  age: 30,
  address: {
    city: 'New York',
    zip: '10001',
  },
});

// Bind computed values
$('#user-name').bind($ref(() => user.value.name));
$('#user-info').bind($ref(() => `${user.value.name} (${user.value.age})`));

// Update nested properties (automatically triggers reactivity)
user.value.name = 'Jane';
user.value.address.city = 'Los Angeles';
```

#### Watching Changes

```js
// Watch simple refs
$watch(count, (newValue, oldValue) => {
  console.log(`Count changed from ${oldValue} to ${newValue}`);
});

// Watch deep reactive objects
$watch(user, newValue => {
  console.log('User object changed:', newValue);
});

// Unwatch functionality
const unwatch = $watch(count, (newValue, oldValue) => {
  console.log('Watching...');
});

// Stop watching
unwatch();
```

#### Input Binding

```js
// Bind an input element to a reactive reference
const name = $ref('');
$('#name-input').bindInput(name);

// Now, whenever the input value changes, `name.value` is updated automatically
```
