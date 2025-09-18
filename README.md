# oBerry

![oberry](https://img.shields.io/npm/v/oberry.svg) ![License](https://img.shields.io/github/license/radeqq007/oberry) ![downloads](https://img.shields.io/npm/dm/oberry) ![npm bundle size](https://img.shields.io/bundlephobia/minzip/oberry)

## Overview

oBerry is a lightweight and modern JQuery alternative designed to simplify the manipulation of HTML elements, handling user interactions and binding reactive data to HTML content.

### So... why oBerry?

|                            | oBerry                            | jQuery                         |
| -------------------------- | --------------------------------- | ------------------------------ |
| **Bundle size**            | ~6 KB (2 KB gzipped)              | ~90 KB (30 KB gzipped)         |
| **API style**              | jQuery-like, modern ES modules    | jQuery-style, legacy-friendly  |
| **Reactivity**             | ✅ Built-in reactive data binding | ❌ Not built-in                |
| **TypeScript support**     | ✅ Full type definitions          | ❌ Limited (community typings) |
| **Plugin system**          | ✅ Simple `Plugin` API            | ✅ `$.fn` plugin interface     |
| **DOM manipulation**       | ✅ Yes, full API                  | ✅ Yes, full API               |
| **Event handling**         | ✅ Yes, with typed callbacks      | ✅ Yes                         |
| **Modern build support**   | ✅ ESM / tree-shakable            | ❌ UMD only                    |
| **Legacy browser support** | ❌ Modern browsers only           | ✅ IE9+                        |
| **Learning curve**         | Low                               | Low                             |

## Features

- 🚀 Lightweight - Minimal footprint
- 🎯 jQuery-like API - Familiar syntax for easy migration
- ⚡ Reactive Data Binding - Built-in reactivity system
- 📦 TypeScript Support - Full type definitions included
- 🎨 Comprehensive DOM Manipulation - Full suite of element manipulation methods
- 🔄 Flexible Content Insertion - Multiple ways to add content to elements

## Installation

```sh
npm install oberry
```

## Quick start

1. Using with a bundler (e.g. Vite, Webpack)

```js
import { $, $ref } from 'oberry';

// Select and manipulate elements
$('.my-button')
  .class('active')
  .on('click', () => console.log('Clicked!'));

// Reactive data binding
const message = $ref('Hello World');
$('#output').bind(message);

// Update reactive value
message('Hello!');
```

2. Using via CDN

```js
import { $, $ref } from 'https://cdn.skypack.dev/oberry';

// Select and manipulate elements
$('.my-button')
  .class('active')
  .on('click', () => console.log('Clicked!'));

// Reactive data binding
const message = $ref('Hello World');
$('#output').bind(message);

// Update reactive value
message('Hello!');
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
  .class() // Get the array of classes
  .class('old-class', 'remove') // Remove a class
  .class('new-class', 'add'); // Add a class
  .class('toggled-class', 'toggle') // Toggle a class
  .hasClass('my-class') // Check if element has class
```

if you don't specify the mode it will toggle the class by default:

```js
$('.element').class('this-will-toggle-a-class');
```

#### ID Management

```js
// Get ID of first element
const elementId = $('.element').id();

// Set ID for all elements
$('.element').id('new-id');
```

#### Element Testing and Matching

```js
// Check if element matches selector
$('.element').is('.active'); // Returns boolean

// Filter out elements that match selector
$('.elements').not('.disabled'); // Returns wrapper with non-matching elements
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
  .html('<p>New HTML content</p>')
  .text('Plain text content')
  .html() // Returns HTML of first element
  .text(); // Returns text of first element
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

#### Element Removal

```js
// Remove all elements from DOM
$('.element').remove();
```

#### Form Values

```js
// Get/set values for input, textarea, select elements
$('#input-field')
  .value('New value') // Sets the current value
  .value(); // Returns current value
```

#### Attributes and Data

```js
// Get/set attributes
$('.element')
  .attr('data-id', '123') // Set attribute
  .attr('data-id'); // Get attribute

// Get/set data attributes
$('.element')
  .data('userId', '456') // Set data attribute
  .data('userId'); // Get data attribute
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

// Find descendants matching selector
$('.parent').find('.child-class');

// Find closest ancestor matching selector
$('.element').closest('.ancestor-class');
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

// Filter elements by CSS selector
$('.elements').filter('.active');

// Filter elements by predicate function
$('.elements').filter((element, index) => {
  return element.classList.contains('highlight');
});
```

#### Element Iteration

```js
// Iterate over each element
$('.elements').forEach(wrappedElement => {
  wrappedElement.class('processed');
});
```

#### Element Information

```js
// Get number of elements
$('.elements').length();

// Check if selection is empty
$('.elements').isEmpty();
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

#### Element Creation

```js
import { $new } from 'oberry';

// Create new elements
const newDiv = $new('div').class('my-class').text('Hello World');
```

### Event Handling

```js
$('.element').on('click' () => console.log("Clicked!"))
```

### Reactivity

oBerry's reactivity system is built on top of [alien-signals](https://github.com/stackblitz/alien-signals), providing efficient and fine-grained reactivity.

#### Reactive References

```js
// Create reactive reference
const count = $ref(0);
const message = $ref('Hello');

// Reading values
console.log(count()); // 0
console.log(message()); // 'Hello'

// Setting values
count(42);
message('Hello World');

// Bind to DOM elements
$('#counter').bind(count); // Binds as text content
$('#message').bindHTML(message); // Binds as HTML content
$('#title').bindAttr('title', message); // Binds to attribute
```

#### Computed Values

```js
const firstName = $ref('John');
const lastName = $ref('Doe');

// Create computed value that automatically updates
const fullName = $computed(() => {
  return `${firstName()} ${lastName()}`;
});

// Bind computed to DOM
$('#full-name').bind(fullName);

// Updates automatically when dependencies change
firstName('Jane'); // '#full-name' will show 'Jane Doe'
```

#### Effects

```js
const count = $ref(0);

// Run side effects when reactive values change
$effect(() => {
  console.log(`Count is now: ${count()}`);
  document.title = `Count: ${count()}`;
});

count(1); // Console: 'Count is now: 1', Title updates
count(2); // Console: 'Count is now: 2', Title updates
```

#### Effect Scope

```js
// Group multiple effects together for cleanup
const stopScope = $effectScope(() => {
  $effect(() => {
    console.log(`Count in scope: ${count()}`);
  });
});

// Stop all effects in the scope
stopScope();
```

#### Input Binding

```js
// Two-way binding with form inputs
const name = $ref('');
$('#name-input').bindInput(name);

// The input value and ref stay in sync
name('John'); // Input shows 'John'
// User types 'Jane' -> name() returns 'Jane'
```

### Plugins

```js
// Create the plugin
const myPlugin = new Plugin('myPlugin', extend => {
  // Add custom method to ElementWrapper
  extend('customMethod', function (value) {
    return this.css({ backgroundColor: value });
  });

  extend('fadeIn', function (duration = 300) {
    this.css({ opacity: 0, transition: `opacity ${duration}ms` });
    setTimeout(() => this.css({ opacity: 1 }), 10);
    return this;
  });
});

// Install the plugin
use(myPlugin);

// Use the custom methods
$('.element').customMethod('red').fadeIn(500);
```
