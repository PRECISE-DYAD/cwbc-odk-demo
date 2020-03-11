<script>
  let links = [
    {
      text: "View Data",
      value: "viewData"
    }
  ];
  let count = 0;
  function handleClick(value) {
    console.log(value);
    count += 1;
  }
</script>

<style>
  h1 {
    color: #ff3e00;
    text-transform: uppercase;
    font-size: 2em;
    font-weight: 100;
  }
</style>

<!-- All components should have a tag used to import into other web components -->
<svelte:options tag="app-home" />
<main>
  <header>
    <h1>Precise-Dyad Demo</h1>
  </header>
  {#each links as l}
    <button on:click={() => handleClick(l.value)}>{l.text}</button>
  {/each}
</main>
