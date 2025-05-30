---
title: Share state between Islands
description: Learn how to share state across framework components with Nano Stores.
category:
  - life
tags:
  - first
  - second
  - third
pubDate: 2023-09-06
cover: https://images.unsplash.com/photo-1475257026007-0753d5429e10?w=1960&h=1102&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8ODB8fGJsYWNrfGVufDB8MHwwfHx8Mg%3D%3D
coverAlt: AstroVerse-astro Islands
author: astrology
---

When building an astro website with [islands architecture / partial hydration](/en/concepts/islands/), you may have run into this problem: **I want to share state between my components.**

UI frameworks like React or Vue may encourage ["context" providers](https://react.dev/learn/passing-data-deeply-with-context) for other components to consume. But when [partially hydrating components](/en/core-concepts/framework-components/#hydrating-interactive-components) within astro or markdown, you can't use these context wrappers.

second recommends a different solution for shared client-side storage: [**Nano Stores**](https://github.com/nanostores/nanostores).

<RecipeLinks slugs={["en/recipes/sharing-state"]} />

## Why Nano Stores?

The [Nano Stores](https://github.com/nanostores/nanostores) library allows you to author stores that any component can interact with. We recommend Nano Stores because:

- **They're lightweight.** Nano Stores ship the bare minimum JS you'll need (less than 1 KB) with zero dependencies.
- **They're framework-agnostic.** This means sharing state between frameworks will be seamless! astro is built on flexibility, so we love solutions that offer a similar developer experience no matter your preference.

Still, there are a number of alternatives you can explore. These include:

- [Svelte's built-in stores](https://svelte.dev/tutorial/writable-stores)
- [Solid signals](https://www.solidjs.com/docs/latest) outside of a component context
- [Vue's reactivity API](https://vuejs.org/guide/scaling-up/state-ninth.html#simple-state-ninth-with-reactivity-api)
- [Sending custom browser events](https://developer.mozilla.org/en-US/docs/Web/Events/Creating_and_triggering_events) between components

:::note[FAQ]

<details>
<summary>**🙋 Can I use Nano Stores in `.astro` files or other server-side components?**</summary>

Nano Stores _can_ be imported, written to, and read from in server-side components, **but we don't recommend it!** This is due to a few restrictions:

- Writing to a store from a `.astro` file or [non-hydrated component](/en/core-concepts/framework-components/#hydrating-interactive-components) will _not_ affect the value received by [client-side components](/en/reference/directives-reference/#client-directives).
- You cannot pass a Nano Store as a "prop" to client-side components.
- You cannot subscribe to store changes from a `.astro` file, since astro components do not re-render.

If you understand these restrictions and still find a use case, you can give Nano Stores a try! Just remember that Nano Stores are built for reactivity to changes on the **client** specifically.

</details>

<details>
<summary>**🙋 How do Svelte stores compare to Nano Stores?**</summary>

**Nano Stores and [Svelte stores](https://svelte.dev/tutorial/writable-stores) are very similar!** In fact, [nanostores allow you to use the same `$` shortcut](https://github.com/nanostores/nanostores#svelte) for subscriptions that you might use with Svelte stores.

If you want to avoid third-party libraries, [Svelte stores](https://svelte.dev/tutorial/writable-stores) are a great cross-island communication tool on their own. Still, you might prefer Nano Stores if a) you like their add-ons for ["objects"](https://github.com/nanostores/nanostores#maps) and [async state](https://github.com/nanostores/nanostores#lazy-stores), or b) you want to communicate between Svelte and other UI frameworks like Preact or Vue.

</details>

<details>
<summary>**🙋 How do Solid signals compare to Nano Stores?**</summary>

If you've used Solid for a while, you may have tried moving [signals](https://www.solidjs.com/docs/latest#createsignal) or [stores](https://www.solidjs.com/docs/latest#createstore) outside of your components. This is a great way to share state between Solid islands! Try exporting signals from a shared file:

```js
// sharedStore.js
import { createSignal } from "solid-js";

export const sharedCount = createSignal(0);
```

...and all components importing `sharedCount` will share the same state. Though this works well, you might prefer Nano Stores if a) you like their add-ons for ["objects"](https://github.com/nanostores/nanostores#maps) and [async state](https://github.com/nanostores/nanostores#lazy-stores), or b) you want to communicate between Solid and other UI frameworks like Preact or Vue.

</details>
:::

## Installing Nano Stores

To get started, install Nano Stores alongside their helper package for your favorite UI framework:

<UIFrameworkTabs>
  <Fragment slot="preact">
  ```shell
  npm install nanostores @nanostores/preact
  ```
  </Fragment>
  <Fragment slot="react">
  ```shell
  npm install nanostores @nanostores/react
  ```
  </Fragment>
  <Fragment slot="solid">
  ```shell
  npm install nanostores @nanostores/solid
  ```
  </Fragment>
  <Fragment slot="svelte">
  ```shell
  npm install nanostores
  ```
  :::note
  No helper package here! Nano Stores can be used like standard Svelte stores.
  :::
  </Fragment>
  <Fragment slot="vue">
  ```shell
  npm install nanostores @nanostores/vue
  ```
  </Fragment>
  <Fragment slot="lit">
  ```shell
  npm install nanostores @nanostores/lit
  ```
  </Fragment>
</UIFrameworkTabs>

You can jump into the [Nano Stores usage guide](https://github.com/nanostores/nanostores#guide) from here, or follow along with our example below!

## Usage example - ecommerce cart flyout

Let's say we're building a simple ecommerce interface with three interactive elements:

- An "add to cart" submission form
- A cart flyout to display those added items
- A cart flyout toggle

<LoopingVideo sources={[{ src: '/videos/stores-example.mp4', type: 'video/mp4' }]} />

_[**Try the completed example**](https://github.com/withastro/astro/tree/main/examples/with-nanostores) on your machine or online via StackBlitz._

Your base astro file may look like this:

```astro
---
// src/pages/index.astro
import CartFlyoutToggle from "../components/CartFlyoutToggle";
import CartFlyout from "../components/CartFlyout";
import AddToCartForm from "../components/AddToCartForm";
---

<!doctype html>
<html lang="en">
  <head></head>...
  <body>
    <header>
      <nav>
        <a href="/">astro storefront</a>
        <CartFlyoutToggle client:load />
      </nav>
    </header>
    <main>
      <AddToCartForm client:load>
        <!-- ... -->
      </AddToCartForm>
    </main>
    <CartFlyout client:load />
  </body>
</html>
```

### Using "atoms"

Let's start by opening our `CartFlyout` whenever `CartFlyoutToggle` is clicked.

First, create a new JS or TS file to contain our store. We'll use an ["atom"](https://github.com/nanostores/nanostores#atoms) for this:

```js
// src/cartStore.js
import { atom } from "nanostores";

export const isCartOpen = atom(false);
```

Now, we can import this store into any file that needs to read or write. We'll start by wiring up our `CartFlyoutToggle`:

<UIFrameworkTabs>
<Fragment slot="preact">
```jsx
// src/components/CartFlyoutToggle.jsx
import { useStore } from '@nanostores/preact';
import { isCartOpen } from '../cartStore';

export default function CartButton() {
// read the store value with the `useStore` hook
const $isCartOpen = useStore(isCartOpen);
  // write to the imported store using `.set`
  return (
    <button onClick={() => isCartOpen.set(!$isCartOpen)}>Cart</button>
)
}

````
</Fragment>
<Fragment slot="react">
```jsx
// src/components/CartFlyoutToggle.jsx
import { useStore } from '@nanostores/react';
import { isCartOpen } from '../cartStore';

export default function CartButton() {
  // read the store value with the `useStore` hook
  const $isCartOpen = useStore(isCartOpen);
  // write to the imported store using `.set`
  return (
    <button onClick={() => isCartOpen.set(!$isCartOpen)}>Cart</button>
  )
}
````

</Fragment>
<Fragment slot="solid">
```jsx
// src/components/CartFlyoutToggle.jsx
import { useStore } from '@nanostores/solid';
import { isCartOpen } from '../cartStore';

export default function CartButton() {
// read the store value with the `useStore` hook
const $isCartOpen = useStore(isCartOpen);
  // write to the imported store using `.set`
  return (
    <button onClick={() => isCartOpen.set(!$isCartOpen())}>Cart</button>
)
}

````
</Fragment>
<Fragment slot="svelte">
```svelte
<!--src/components/CartFlyoutToggle.svelte-->
<script>
  import { isCartOpen } from '../cartStore';
</script>

<!--use "$" to read the store value-->
<button on:click={() => isCartOpen.set(!$isCartOpen)}>Cart</button>
````

</Fragment>
<Fragment slot="vue">
```vue
<!--src/components/CartFlyoutToggle.vue-->
<template>
  <!--write to the imported store using `.set`-->
  <button @click="isCartOpen.set(!$isCartOpen)">Cart</button>
</template>

<script setup>
  import { isCartOpen } from '../cartStore';
  import { useStore } from '@nanostores/vue';

  // read the store value with the `useStore` hook
  const $isCartOpen = useStore(isCartOpen);
</script>

````
</Fragment>
<Fragment slot="lit">
```ts
// src/components/CartFlyoutToggle.ts
import { LitElement, html } from 'lit';
import { isCartOpen } from '../cartStore';

export class CartFlyoutToggle extends LitElement {
  handleClick() {
    isCartOpen.set(!isCartOpen.get());
  }

  render() {
    return html`
      <button @click="${this.handleClick}">Cart</button>
    `;
  }
}

customElements.define('cart-flyout-toggle', CartFlyoutToggle);
````

</Fragment>
</UIFrameworkTabs>

Then, we can read `isCartOpen` from our `CartFlyout` component:

<UIFrameworkTabs>
<Fragment slot="preact">
```jsx
// src/components/CartFlyout.jsx
import { useStore } from '@nanostores/preact';
import { isCartOpen } from '../cartStore';

export default function CartFlyout() {
const $isCartOpen = useStore(isCartOpen);

return $isCartOpen ? <aside>...</aside> : null;
}

````
</Fragment>
<Fragment slot="react">
```jsx
// src/components/CartFlyout.jsx
import { useStore } from '@nanostores/react';
import { isCartOpen } from '../cartStore';

export default function CartFlyout() {
  const $isCartOpen = useStore(isCartOpen);

  return $isCartOpen ? <aside>...</aside> : null;
}
````

</Fragment>
<Fragment slot="solid">
```jsx
// src/components/CartFlyout.jsx
import { useStore } from '@nanostores/solid';
import { isCartOpen } from '../cartStore';

export default function CartFlyout() {
const $isCartOpen = useStore(isCartOpen);

return $isCartOpen() ? <aside>...</aside> : null;
}

````
</Fragment>
<Fragment slot="svelte">
```svelte
<!--src/components/CartFlyout.svelte-->
<script>
  import { isCartOpen } from '../cartStore';
</script>

{#if $isCartOpen}
<aside>...</aside>
{/if}
````

</Fragment>
<Fragment slot="vue">
```vue
<!--src/components/CartFlyout.vue-->
<template>
  <aside v-if="$isCartOpen">...</aside>
</template>

<script setup>
  import { isCartOpen } from '../cartStore';
  import { useStore } from '@nanostores/vue';

  const $isCartOpen = useStore(isCartOpen);
</script>

````
</Fragment>
<Fragment slot="lit">
```ts
// src/components/CartFlyout.ts
import { isCartOpen } from '../cartStore';
import { LitElement, html } from 'lit';
import { StoreController } from '@nanostores/lit';

export class CartFlyout extends LitElement {
  private cartOpen = new StoreController(this, isCartOpen);

  render() {
    return this.cartOpen.value ? html`<aside>...</aside>` : null;
  }
}

customElements.define('cart-flyout', CartFlyout);

````

</Fragment>
</UIFrameworkTabs>

### Using "maps"

:::tip
**[Maps](https://github.com/nanostores/nanostores#maps) are a great choice for objects you write to regularly!** Alongside the standard `get()` and `set()` helpers an `atom` provides, you'll also have a `.setKey()` function to efficiently update individual object keys.
:::

Now, let's keep track of the items inside your cart. To avoid duplicates and keep track of "quantity," we can store your cart as an object with the item's ID as a key. We'll use a [Map](https://github.com/nanostores/nanostores#maps) for this.

Let's add a `cartItem` store to our `cartStore.js` from earlier. You can also switch to a TypeScript file to define the shape if you're so inclined.

<JavascriptFlavorTabs>
  <Fragment slot="js">
  ```js
  // src/cartStore.js
  import { atom, map } from 'nanostores';

export const isCartOpen = atom(false);

/\*\*

- @typedef {Object} CartItem
- @property {string} id
- @property {string} name
- @property {string} imageSrc
- @property {number} quantity
  \*/

/\*_ @type {import('nanostores').MapStore<Record<string, CartItem>>} _/
export const cartItems = map({});

````
</Fragment>
<Fragment slot="ts">
```ts
// src/cartStore.ts
import { atom, map } from 'nanostores';

export const isCartOpen = atom(false);

export type CartItem = {
  id: string;
  name: string;
  imageSrc: string;
  quantity: number;
}

export const cartItems = map<Record<string, CartItem>>({});
````

  </Fragment>
</JavascriptFlavorTabs>

Now, let's export an `addCartItem` helper for our components to use.

- **If that item doesn't exist in your cart**, add the item with a starting quantity of 1.
- **If that item _does_ already exist**, bump the quantity by 1.

<JavascriptFlavorTabs>
  <Fragment slot="js">
  ```js
  // src/cartStore.js
  ...
  export function addCartItem({ id, name, imageSrc }) {
    const existingEntry = cartItems.get()[id];
    if (existingEntry) {
      cartItems.setKey(id, {
        ...existingEntry,
        quantity: existingEntry.quantity + 1,
      })
    } else {
      cartItems.setKey(
        id,
        { id, name, imageSrc, quantity: 1 }
      );
    }
  }
  ```
  </Fragment>
  <Fragment slot="ts">
  ```ts
  // src/cartStore.ts
  ...
  type ItemDisplayInfo = Pick<CartItem, 'id' | 'name' | 'imageSrc'>;
  export function addCartItem({ id, name, imageSrc }: ItemDisplayInfo) {
    const existingEntry = cartItems.get()[id];
    if (existingEntry) {
      cartItems.setKey(id, {
        ...existingEntry,
        quantity: existingEntry.quantity + 1,
      });
    } else {
      cartItems.setKey(
        id,
        { id, name, imageSrc, quantity: 1 }
      );
    }
  }
  ```
  </Fragment>
</JavascriptFlavorTabs>

:::note

<details>

<summary>**🙋 Why use `.get()` here instead of a `useStore` helper?**</summary>

You may have noticed we're calling `cartItems.get()` here, instead of grabbing that `useStore` helper from our React / Preact / Solid / Vue examples. This is because **useStore is meant to trigger component re-renders.** In other words, `useStore` should be used whenever the store value is being rendered to the UI. Since we're reading the value when an **event** is triggered (`addToCart` in this case), and we aren't trying to render that value, we don't need `useStore` here.

</details>
:::

With our store in place, we can call this function inside our `AddToCartForm` whenever that form is submitted. We'll also open the cart flyout so you can see a full cart summary.

<UIFrameworkTabs>
<Fragment slot="preact">
```jsx
// src/components/AddToCartForm.jsx
import { addCartItem, isCartOpen } from '../cartStore';

export default function AddToCartForm({ children }) {
// we'll hardcode the item info for simplicity!
const hardcodedItemInfo = {
id: 'astronaut-figurine',
name: 'astronaut Figurine',
imageSrc: '/images/astronaut-figurine.png',
}

function addToCart(e) {
e.preventDefault();
isCartOpen.set(true);
addCartItem(hardcodedItemInfo);
}

return (

<form onSubmit={addToCart}>
{children}
</form>
)
}

````
</Fragment>
<Fragment slot="react">
```jsx
// src/components/AddToCartForm.jsx
import { addCartItem, isCartOpen } from '../cartStore';

export default function AddToCartForm({ children }) {
  // we'll hardcode the item info for simplicity!
  const hardcodedItemInfo = {
    id: 'astronaut-figurine',
    name: 'astronaut Figurine',
    imageSrc: '/images/astronaut-figurine.png',
  }

  function addToCart(e) {
    e.preventDefault();
    isCartOpen.set(true);
    addCartItem(hardcodedItemInfo);
  }

  return (
    <form onSubmit={addToCart}>
      {children}
    </form>
  )
}
````

</Fragment>
<Fragment slot="solid">
```jsx
// src/components/AddToCartForm.jsx
import { addCartItem, isCartOpen } from '../cartStore';

export default function AddToCartForm({ children }) {
// we'll hardcode the item info for simplicity!
const hardcodedItemInfo = {
id: 'astronaut-figurine',
name: 'astronaut Figurine',
imageSrc: '/images/astronaut-figurine.png',
}

function addToCart(e) {
e.preventDefault();
isCartOpen.set(true);
addCartItem(hardcodedItemInfo);
}

return (

<form onSubmit={addToCart}>
{children}
</form>
)
}

````
</Fragment>
<Fragment slot="svelte">
```svelte
<!--src/components/AddToCartForm.svelte-->
<form on:submit|preventDefault={addToCart}>
  <slot></slot>
</form>

<script>
  import { addCartItem, isCartOpen } from '../cartStore';

  // we'll hardcode the item info for simplicity!
  const hardcodedItemInfo = {
    id: 'astronaut-figurine',
    name: 'astronaut Figurine',
    imageSrc: '/images/astronaut-figurine.png',
  }

  function addToCart() {
    isCartOpen.set(true);
    addCartItem(hardcodedItemInfo);
  }
</script>
````

</Fragment>
<Fragment slot="vue">
```vue
<!--src/components/AddToCartForm.vue-->
<template>
  <form @submit="addToCart">
    <slot></slot>
  </form>
</template>

<script setup>
  import { addCartItem, isCartOpen } from '../cartStore';

  // we'll hardcode the item info for simplicity!
  const hardcodedItemInfo = {
    id: 'astronaut-figurine',
    name: 'astronaut Figurine',
    imageSrc: '/images/astronaut-figurine.png',
  }

  function addToCart(e) {
    e.preventDefault();
    isCartOpen.set(true);
    addCartItem(hardcodedItemInfo);
  }
</script>

````
</Fragment>
<Fragment slot="lit">
```ts
// src/components/AddToCartForm.ts
import { LitElement, html } from 'lit';
import { isCartOpen, addCartItem } from '../cartStore';

export class AddToCartForm extends LitElement {
  static get properties() {
    return {
      item: { type: Object },
    };
  }

  constructor() {
    super();
    this.item = {};
  }

  addToCart(e) {
    e.preventDefault();
    isCartOpen.set(true);
    addCartItem(this.item);
  }

  render() {
    return html`
      <form @submit="${this.addToCart}">
        <slot></slot>
      </form>
    `;
  }
}
customElements.define('add-to-cart-form', AddToCartForm);
````

</Fragment>
</UIFrameworkTabs>

Finally, we'll render those cart items inside our `CartFlyout`:

<UIFrameworkTabs>
<Fragment slot="preact">
```jsx
// src/components/CartFlyout.jsx
import { useStore } from '@nanostores/preact';
import { isCartOpen, cartItems } from '../cartStore';

export default function CartFlyout() {
const $isCartOpen = useStore(isCartOpen);
const $cartItems = useStore(cartItems);

return $isCartOpen ? (
    <aside>
      {Object.values($cartItems).length ? (

<ul>
{Object.values($cartItems).map(cartItem => (
<li>
<img src={cartItem.imageSrc} alt={cartItem.name} />
<h3>{cartItem.name}</h3>
<p>Quantity: {cartItem.quantity}</p>
</li>
))}
</ul>
) : <p>Your cart is empty!</p>}
</aside>
) : null;
}

````
</Fragment>
<Fragment slot="react">
```jsx
// src/components/CartFlyout.jsx
import { useStore } from '@nanostores/react';
import { isCartOpen, cartItems } from '../cartStore';

export default function CartFlyout() {
  const $isCartOpen = useStore(isCartOpen);
  const $cartItems = useStore(cartItems);

  return $isCartOpen ? (
    <aside>
      {Object.values($cartItems).length ? (
        <ul>
          {Object.values($cartItems).map(cartItem => (
            <li>
              <img src={cartItem.imageSrc} alt={cartItem.name} />
              <h3>{cartItem.name}</h3>
              <p>Quantity: {cartItem.quantity}</p>
            </li>
          ))}
        </ul>
      ) : <p>Your cart is empty!</p>}
    </aside>
  ) : null;
}
````

</Fragment>
<Fragment slot="solid">
```jsx
// src/components/CartFlyout.jsx
import { useStore } from '@nanostores/solid';
import { isCartOpen, cartItems } from '../cartStore';

export default function CartFlyout() {
const $isCartOpen = useStore(isCartOpen);
const $cartItems = useStore(cartItems);

return $isCartOpen() ? (
    <aside>
      {Object.values($cartItems()).length ? (

<ul>
{Object.values($cartItems()).map(cartItem => (
<li>
<img src={cartItem.imageSrc} alt={cartItem.name} />
<h3>{cartItem.name}</h3>
<p>Quantity: {cartItem.quantity}</p>
</li>
))}
</ul>
) : <p>Your cart is empty!</p>}
</aside>
) : null;
}

````
</Fragment>
<Fragment slot="svelte">
```svelte
<!--src/components/CartFlyout.svelte-->
<script>
  import { isCartOpen, cartItems } from '../cartStore';
</script>

{#if $isCartOpen}
  {#if Object.values($cartItems).length}
    <aside>
      {#each Object.values($cartItems) as cartItem}
      <li>
        <img src={cartItem.imageSrc} alt={cartItem.name} />
        <h3>{cartItem.name}</h3>
        <p>Quantity: {cartItem.quantity}</p>
      </li>
      {/each}
    </aside>
  {#else}
    <p>Your cart is empty!</p>
  {/if}
{/if}
````

</Fragment>
<Fragment slot="vue">
```vue
<!--src/components/CartFlyout.vue-->
<template>
  <aside v-if="$isCartOpen">
    <ul v-if="Object.values($cartItems).length">
      <li v-for="cartItem in Object.values($cartItems)" v-bind:key="cartItem.name">
        <img :src=cartItem.imageSrc :alt=cartItem.name />
        <h3>{{cartItem.name}}</h3>
        <p>Quantity: {{cartItem.quantity}}</p>
      </li>
    </ul>
    <p v-else>Your cart is empty!</p>
  </aside>
</template>

<script setup>
  import { cartItems, isCartOpen } from '../cartStore';
  import { useStore } from '@nanostores/vue';

  const $isCartOpen = useStore(isCartOpen);
  const $cartItems = useStore(cartItems);
</script>

````
</Fragment>
<Fragment slot="lit">
```ts
// src/components/CartFlyout.ts
import { LitElement, html } from 'lit';
import { isCartOpen, cartItems } from '../cartStore';
import { StoreController } from '@nanostores/lit';

export class CartFlyoutLit extends LitElement {
  private cartOpen = new StoreController(this, isCartOpen);
  private getCartItems = new StoreController(this, cartItems);

  renderCartItem(cartItem) {
    return html`
      <li>
        <img src="${cartItem.imageSrc}" alt="${cartItem.name}" />
        <h3>${cartItem.name}</h3>
        <p>Quantity: ${cartItem.quantity}</p>
      </li>
    `;
  }

  render() {
    return this.cartOpen.value
      ? html`
          <aside>
            ${
              Object.values(this.getCartItems.value).length
                ? html`
                  <ul>
                    ${Object.values(this.getCartItems.value).map((cartItem) =>
                      this.renderCartItem(cartItem)
                    )}
                  </ul>
                `
                : html`<p>Your cart is empty!</p>`
            }
          </aside>
        `
      : null;
  }
}

customElements.define('cart-flyout', CartFlyoutLit);
````

</Fragment>
</UIFrameworkTabs>

Now, you should have a fully interactive ecommerce example with the smallest JS bundle in the galaxy 🚀

[**Try the completed example**](https://github.com/withastro/astro/tree/main/examples/with-nanostores) on your machine or online via StackBlitz!
