# oBerry

## Overview

oBerry is a lightweight and modern JQuery alternative designed to simplyfy the manipulation of HTML elements, handling user interactions and biding reactive data to HTML content.

## Features

- 🚀 Lightweight - Minimal footprint with no dependencies
- 🎯 jQuery-like API - Familiar syntax for easy migration
- ⚡ Reactive Data Binding - Built-in reactivity system
- 📦 TypeScript Support - Full type definitions included
- 🌐 Modern ES Modules - Tree-shakable imports
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

// Get children as arrays
$('.parent').childrenArray(); // Children of first element
$('.parents').allChildrenArray(); // Children of all elements

// Get array of wrapped elements
$('.elements').getArray();
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
$('#counter').bind(count);        // Binds as text content
$('#message').bindHTML(message);  // Binds as HTML content

// Update values
count.value = 42;
message.value = '<strong>Bold Hello</strong>';
});
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
```

#### Input Binding

```js
// Bind an input element to a reactive reference
const name = $ref('');
$('#name-input').bindInput(name);

// Now, whenever the input value changes, `name.value` is updated automatically
```

### Cookie Management

```js
import { $cookie } from 'oberry';

// Set a cookie
$cookie.set('username', 'john_doe');

// Set a cookie with options
$cookie.set('session_token', 'abc123', {
  expires: new Date(Date.now() + 86400000), // 1 day
  maxAge: 3600, // 1 hour in seconds
  domain: '.example.com',
  path: '/admin',
  secure: true,
  sameSite: 'Strict',
});

// Get a cookie
const username = $cookie.get('username');

// Delete a cookie
$cookie.delete('session_token');

// Delete a cookie with specific path and domain
$cookie.delete('session_token', '/admin', '.example.com');
```
