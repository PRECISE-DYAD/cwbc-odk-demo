<style>
  main {
    text-align: center;
    padding: 1em;
    max-width: 240px;
    margin: 0 auto;
  }

  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }
</style>

<svelte:options tag="app-layout" />
<main>
  <!-- use slot to allow any other custom element to sit inside -->
  <slot />
</main>
