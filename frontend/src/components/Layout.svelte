<style>
  main {
    text-align: center;
    padding: 1em;
    max-width: 480px;
    height: calc(100% - 32px);
    display: flex;
    flex-direction: column;
    margin: 0 auto;
    border: 1px solid #cdcdcd;
  }

  @media (max-width: 480px) {
    main {
      border: none;
    }
  }
</style>

<main>
  <!-- use slot to allow any other custom element to sit inside -->
  <slot />
</main>
