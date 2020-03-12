<script>
  import FormOpen from "./FormOpen.svelte";
  let links = [
    {
      text: "View Data",
      value: "view"
    },
    {
      text: "Add Record",
      value: "add"
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
  button {
    margin: 0.5em;
  }
</style>

<main>
  <header>
    <h1>Precise-Dyad Demo</h1>
  </header>
  {#each links as l}
    <button on:click={() => handleClick(l.value)}>{l.text}</button>
  {/each}
  <FormOpen label="Open Example Form" formId="exampleForm" />
</main>
